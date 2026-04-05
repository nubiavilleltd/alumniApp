import type { AuthSessionUser } from '@/features/authentication/types/auth.types';
import { getMessagesSupabaseClient, isMessagesSupabaseConfigured } from '.';
import type { ChatProfileInsert, ChatProfileRow } from './types';

const CHAT_PROFILE_LOG_PREFIX = '[messages/supabase] ensureChatProfile';
const ensuredProfilesByMemberId = new Map<string, ChatProfileRow>();
const inFlightProfilesByMemberId = new Map<string, Promise<ChatProfileRow | null>>();

function buildChatProfileInsert(user: AuthSessionUser): ChatProfileInsert {
  return {
    member_id: user.memberId,
    slug: user.slug,
    full_name: user.fullName,
    graduation_year: user.graduationYear,
    avatar_url: user.photo ?? null,
    initials: user.avatarInitials,
    profile_href: user.profileHref,
  };
}

export async function ensureChatProfile(user: AuthSessionUser): Promise<ChatProfileRow | null> {
  if (!isMessagesSupabaseConfigured() || !user.memberId) {
    console.warn(`${CHAT_PROFILE_LOG_PREFIX}: skipped`, {
      isConfigured: isMessagesSupabaseConfigured(),
      memberId: user.memberId || null,
    });
    return null;
  }

  const cachedProfile = ensuredProfilesByMemberId.get(user.memberId);
  if (cachedProfile) {
    console.log(`${CHAT_PROFILE_LOG_PREFIX}: profile already ensured in memory, skipping insert`, {
      memberId: user.memberId,
      chatProfileId: cachedProfile.id,
    });
    return cachedProfile;
  }

  const existingInFlightRequest = inFlightProfilesByMemberId.get(user.memberId);
  if (existingInFlightRequest) {
    console.log(`${CHAT_PROFILE_LOG_PREFIX}: profile ensure already in flight, reusing request`, {
      memberId: user.memberId,
    });
    return existingInFlightRequest;
  }

  const ensurePromise = (async () => {
    console.log(`${CHAT_PROFILE_LOG_PREFIX}: checking profile`, {
      memberId: user.memberId,
      fullName: user.fullName,
    });

    const supabase = getMessagesSupabaseClient();
    const { data: existingProfiles, error: existingProfileError } = await supabase
      .from('chat_profiles')
      .select('*')
      .eq('member_id', user.memberId)
      .order('created_at', { ascending: true })
      .limit(2);

    if (existingProfileError) {
      console.error(`${CHAT_PROFILE_LOG_PREFIX}: failed while checking existing profile`, {
        memberId: user.memberId,
        error: existingProfileError,
      });
      throw existingProfileError;
    }

    if ((existingProfiles?.length ?? 0) > 1) {
      const firstProfile = existingProfiles?.[0] ?? null;

      console.error(`${CHAT_PROFILE_LOG_PREFIX}: duplicate profiles already exist for member_id`, {
        memberId: user.memberId,
        duplicateCount: existingProfiles?.length ?? 0,
        chatProfileIds: existingProfiles?.map((profile) => profile.id) ?? [],
      });

      if (firstProfile) {
        ensuredProfilesByMemberId.set(user.memberId, firstProfile);
      }

      return firstProfile;
    }

    const existingProfile = existingProfiles?.[0] ?? null;
    if (existingProfile) {
      console.log(`${CHAT_PROFILE_LOG_PREFIX}: profile already exists, skipping insert`, {
        memberId: user.memberId,
        chatProfileId: existingProfile.id,
      });
      ensuredProfilesByMemberId.set(user.memberId, existingProfile);
      return existingProfile;
    }

    const payload = buildChatProfileInsert(user);
    console.log(`${CHAT_PROFILE_LOG_PREFIX}: creating profile`, payload);

    const { data: createdProfile, error: createProfileError } = await supabase
      .from('chat_profiles')
      .insert(payload)
      .select('*')
      .single();

    if (!createProfileError) {
      console.log(`${CHAT_PROFILE_LOG_PREFIX}: profile created`, {
        memberId: user.memberId,
        chatProfileId: createdProfile.id,
      });
      ensuredProfilesByMemberId.set(user.memberId, createdProfile);
      return createdProfile;
    }

    if (createProfileError.code === '23505') {
      console.warn(
        `${CHAT_PROFILE_LOG_PREFIX}: duplicate insert race detected, reloading profile`,
        {
          memberId: user.memberId,
          error: createProfileError,
        },
      );

      const { data: raceWinnerProfile, error: raceWinnerError } = await supabase
        .from('chat_profiles')
        .select('*')
        .eq('member_id', user.memberId)
        .single();

      if (raceWinnerError) {
        console.error(`${CHAT_PROFILE_LOG_PREFIX}: duplicate race reload failed`, {
          memberId: user.memberId,
          error: raceWinnerError,
        });
        throw raceWinnerError;
      }

      console.log(`${CHAT_PROFILE_LOG_PREFIX}: recovered existing profile after duplicate race`, {
        memberId: user.memberId,
        chatProfileId: raceWinnerProfile.id,
      });
      ensuredProfilesByMemberId.set(user.memberId, raceWinnerProfile);
      return raceWinnerProfile;
    }

    console.error(`${CHAT_PROFILE_LOG_PREFIX}: profile creation failed`, {
      memberId: user.memberId,
      payload,
      error: createProfileError,
    });
    throw createProfileError;
  })();

  inFlightProfilesByMemberId.set(user.memberId, ensurePromise);

  try {
    return await ensurePromise;
  } finally {
    inFlightProfilesByMemberId.delete(user.memberId);
  }
}
