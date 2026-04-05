import type { AuthSessionUser } from '@/features/authentication/types/auth.types';
import type {
  CreateDirectThreadRequest,
  CreateGroupThreadRequest,
} from '../../api/messages.contract';
import type { MessageParticipant, MessageThreadDetail } from '../../types/messages.types';
import { getMessagesSupabaseClient, isMessagesSupabaseConfigured } from '.';
import { ensureChatProfile } from './chat.actions';
import type {
  ChatProfileInsert,
  MessageThreadInsert,
  MessageThreadParticipantInsert,
  MessageThreadRow,
} from './types';

const THREAD_LOG_PREFIX = '[messages/supabase] threadMirror';
const THREAD_PARTICIPANTS_TABLE_CANDIDATES = [
  'thread_participants',
  'message_thread_participants',
] as const;

type ThreadParticipantsTableName = (typeof THREAD_PARTICIPANTS_TABLE_CANDIDATES)[number];
type SupabaseTableError = { code?: string | null; message?: string | null } | null | undefined;

function isMissingTableError(error: SupabaseTableError) {
  const message = `${error?.message ?? ''}`.toLowerCase();

  return (
    error?.code === '42P01' ||
    error?.code === 'PGRST205' ||
    message.includes('does not exist') ||
    message.includes('could not find the table') ||
    (message.includes('relation') && message.includes('exist'))
  );
}

async function queryThreadParticipantsTable<T>(
  operationName: string,
  operation: (tableName: ThreadParticipantsTableName) => Promise<{
    data: T | null;
    error: SupabaseTableError;
  }>,
) {
  let lastError: SupabaseTableError = null;

  for (let index = 0; index < THREAD_PARTICIPANTS_TABLE_CANDIDATES.length; index += 1) {
    const tableName = THREAD_PARTICIPANTS_TABLE_CANDIDATES[index];
    const result = await operation(tableName);

    if (!result.error) {
      return {
        data: result.data,
        tableName,
      };
    }

    if (
      !isMissingTableError(result.error) ||
      index === THREAD_PARTICIPANTS_TABLE_CANDIDATES.length - 1
    ) {
      console.error(`${THREAD_LOG_PREFIX}: ${operationName} failed`, {
        tableName,
        error: result.error,
      });
      throw result.error;
    }

    console.warn(`${THREAD_LOG_PREFIX}: ${operationName} could not use table, trying fallback`, {
      tableName,
      error: result.error,
    });

    lastError = result.error;
  }

  throw (
    lastError ?? new Error(`${operationName} failed for all thread participant table candidates.`)
  );
}

function buildDirectKey(memberIds: string[]) {
  return [...new Set(memberIds)].sort().join('__');
}

function buildChatProfileInsertForCurrentUser(user: AuthSessionUser): ChatProfileInsert {
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

function buildChatProfileInsertFromParticipant(participant: MessageParticipant): ChatProfileInsert {
  return {
    member_id: participant.memberId,
    slug: participant.slug,
    full_name: participant.fullName,
    graduation_year: participant.graduationYear,
    avatar_url: participant.avatar ?? null,
    initials: participant.initials,
    profile_href: participant.profileHref,
  };
}

async function ensureChatProfileCopyForParticipant(
  participant: MessageParticipant,
  currentUser?: AuthSessionUser,
) {
  const profilePayload =
    currentUser?.memberId === participant.memberId
      ? buildChatProfileInsertForCurrentUser(currentUser)
      : buildChatProfileInsertFromParticipant(participant);

  if (!isMessagesSupabaseConfigured()) {
    return null;
  }

  const supabase = getMessagesSupabaseClient();
  const { data: existingProfiles, error: existingProfilesError } = await supabase
    .from('chat_profiles')
    .select('*')
    .eq('member_id', participant.memberId)
    .order('created_at', { ascending: true })
    .limit(1);

  if (existingProfilesError) {
    console.error(`${THREAD_LOG_PREFIX}: failed while checking participant chat profile`, {
      memberId: participant.memberId,
      error: existingProfilesError,
    });
    throw existingProfilesError;
  }

  const existingProfile = existingProfiles?.[0] ?? null;
  if (existingProfile) {
    return existingProfile;
  }

  const { data: createdProfile, error: createProfileError } = await supabase
    .from('chat_profiles')
    .insert(profilePayload)
    .select('*')
    .single();

  if (createProfileError) {
    console.error(`${THREAD_LOG_PREFIX}: failed while creating participant chat profile`, {
      memberId: participant.memberId,
      payload: profilePayload,
      error: createProfileError,
    });
    throw createProfileError;
  }

  console.log(`${THREAD_LOG_PREFIX}: participant chat profile created`, {
    memberId: participant.memberId,
    chatProfileId: createdProfile.id,
  });

  return createdProfile;
}

async function ensureChatProfilesForThread(
  thread: Pick<MessageThreadDetail, 'participants'>,
  currentUser: AuthSessionUser,
) {
  await ensureChatProfile(currentUser);

  await Promise.all(
    thread.participants.map((participant) =>
      ensureChatProfileCopyForParticipant(participant, currentUser),
    ),
  );
}

function buildThreadInsertFromDetail(
  thread: Pick<
    MessageThreadDetail,
    | 'type'
    | 'title'
    | 'category'
    | 'lastMessagePreview'
    | 'lastMessageSenderName'
    | 'participants'
    | 'attachmentsEnabled'
    | 'audioEnabled'
  >,
  createdByMemberId: string,
): MessageThreadInsert {
  return {
    type: thread.type,
    title: thread.title || null,
    category: thread.category ?? null,
    created_by: createdByMemberId,
    updated_at: new Date().toISOString(),
    last_message_id: null,
    last_message_at: null,
    direct_key:
      thread.type === 'direct'
        ? buildDirectKey(thread.participants.map((participant) => participant.memberId))
        : null,
    last_message_preview: thread.lastMessagePreview || null,
    last_message_sender_name: thread.lastMessageSenderName || null,
    attachment_enabled: thread.attachmentsEnabled,
    audio_enabled: thread.audioEnabled,
  };
}

async function findExistingDirectThread(memberIds: [string, string]) {
  const supabase = getMessagesSupabaseClient();
  const directKey = buildDirectKey(memberIds);

  const { data: directKeyMatches, error: directKeyError } = await supabase
    .from('message_threads')
    .select('*')
    .eq('type', 'direct')
    .eq('direct_key', directKey)
    .order('created_at', { ascending: true })
    .limit(1);

  if (directKeyError) {
    console.error(`${THREAD_LOG_PREFIX}: failed while loading direct thread by direct_key`, {
      directKey,
      memberIds,
      error: directKeyError,
    });
    throw directKeyError;
  }

  const directKeyMatch = directKeyMatches?.[0] ?? null;
  if (directKeyMatch) {
    return directKeyMatch;
  }

  const participantSnapshot = await queryThreadParticipantsTable(
    'checking direct thread participants',
    async (tableName) => {
      const { data, error } = await getMessagesSupabaseClient()
        .from(tableName)
        .select('thread_id, member_id')
        .in('member_id', memberIds);

      return {
        data,
        error,
      };
    },
  );

  const participantRows = participantSnapshot.data ?? [];
  const threadIdsByCount = participantRows.reduce<Record<string, Set<string>>>(
    (accumulator, row) => {
      const set = accumulator[row.thread_id] ?? new Set<string>();
      set.add(row.member_id);
      accumulator[row.thread_id] = set;
      return accumulator;
    },
    {},
  );

  const candidateThreadIds = Object.entries(threadIdsByCount)
    .filter(([, participants]) => participants.size === memberIds.length)
    .map(([threadId]) => threadId);

  if (candidateThreadIds.length === 0) {
    return null;
  }

  const { data: existingThreads, error: existingThreadsError } = await supabase
    .from('message_threads')
    .select('*')
    .in('id', candidateThreadIds)
    .eq('type', 'direct')
    .order('created_at', { ascending: true })
    .limit(1);

  if (existingThreadsError) {
    console.error(`${THREAD_LOG_PREFIX}: failed while loading candidate direct threads`, {
      memberIds,
      candidateThreadIds,
      error: existingThreadsError,
    });
    throw existingThreadsError;
  }

  return existingThreads?.[0] ?? null;
}

async function findExistingGroupThread(
  thread: Pick<MessageThreadDetail, 'title' | 'participants'>,
  createdByMemberId: string,
) {
  const supabase = getMessagesSupabaseClient();
  let candidateQuery = supabase
    .from('message_threads')
    .select('*')
    .eq('type', 'group')
    .eq('created_by', createdByMemberId)
    .order('created_at', { ascending: true })
    .limit(20);

  candidateQuery = thread.title
    ? candidateQuery.eq('title', thread.title)
    : candidateQuery.is('title', null);

  const { data: candidateThreads, error: candidateThreadsError } = await candidateQuery;

  if (candidateThreadsError) {
    console.error(`${THREAD_LOG_PREFIX}: failed while loading candidate group threads`, {
      createdByMemberId,
      title: thread.title || null,
      error: candidateThreadsError,
    });
    throw candidateThreadsError;
  }

  if (!candidateThreads?.length) {
    return null;
  }

  const participantIds = [
    ...new Set(thread.participants.map((participant) => participant.memberId)),
  ].sort();
  const candidateThreadIds = candidateThreads.map((candidate) => candidate.id);

  const participantSnapshot = await queryThreadParticipantsTable(
    'checking group thread participants',
    async (tableName) => {
      const { data, error } = await getMessagesSupabaseClient()
        .from(tableName)
        .select('thread_id, member_id')
        .in('thread_id', candidateThreadIds);

      return {
        data,
        error,
      };
    },
  );

  const participantsByThreadId = (participantSnapshot.data ?? []).reduce<Record<string, string[]>>(
    (accumulator, row) => {
      accumulator[row.thread_id] = [...(accumulator[row.thread_id] ?? []), row.member_id];
      return accumulator;
    },
    {},
  );

  return (
    candidateThreads.find((candidate) => {
      const existingIds = [...new Set(participantsByThreadId[candidate.id] ?? [])].sort();

      return (
        existingIds.length === participantIds.length &&
        existingIds.every((memberId, index) => memberId === participantIds[index])
      );
    }) ?? null
  );
}

async function createThreadRecord(payload: MessageThreadInsert) {
  const supabase = getMessagesSupabaseClient();
  const { data: threadRow, error: threadError } = await supabase
    .from('message_threads')
    .insert(payload)
    .select('*')
    .single();

  if (threadError) {
    console.error(`${THREAD_LOG_PREFIX}: failed while creating thread row`, {
      payload,
      error: threadError,
    });
    throw threadError;
  }

  return threadRow;
}

async function updateThreadRecord(threadId: string, payload: Partial<MessageThreadInsert>) {
  const supabase = getMessagesSupabaseClient();
  const { data: threadRow, error: threadError } = await supabase
    .from('message_threads')
    .update(payload)
    .eq('id', threadId)
    .select('*')
    .single();

  if (threadError) {
    console.error(`${THREAD_LOG_PREFIX}: failed while updating thread row`, {
      threadId,
      payload,
      error: threadError,
    });
    throw threadError;
  }

  return threadRow;
}

async function loadMirroredThreadSnapshot(threadId: string) {
  const supabase = getMessagesSupabaseClient();
  const [{ data: threadRow, error: threadError }, participantSnapshot] = await Promise.all([
    supabase
      .from('message_threads')
      .select(
        'id, created_at, type, title, created_by, updated_at, last_message_id, last_message_at, category, direct_key, last_message_preview, last_message_sender_name, attachment_enabled, audio_enabled',
      )
      .eq('id', threadId)
      .single(),
    queryThreadParticipantsTable('reloading mirrored thread participants', async (tableName) => {
      const { data, error } = await getMessagesSupabaseClient()
        .from(tableName)
        .select('thread_id, member_id, role')
        .eq('thread_id', threadId)
        .order('member_id', { ascending: true });

      return {
        data,
        error,
      };
    }),
  ]);

  if (threadError) {
    console.error(`${THREAD_LOG_PREFIX}: failed while reloading mirrored thread`, {
      threadId,
      error: threadError,
    });
    throw threadError;
  }

  return {
    thread: threadRow,
    participants: participantSnapshot.data ?? [],
    participantsTable: participantSnapshot.tableName,
  };
}

async function saveThreadParticipants(
  threadId: string,
  creatorMemberId: string,
  memberIds: string[],
) {
  const participantRows: MessageThreadParticipantInsert[] = Array.from(new Set(memberIds)).map(
    (memberId) => ({
      thread_id: threadId,
      member_id: memberId,
      role: memberId === creatorMemberId ? 'admin' : 'member',
    }),
  );

  const participantSnapshot = await queryThreadParticipantsTable(
    'saving thread participants',
    async (tableName) => {
      const { data, error } = await getMessagesSupabaseClient()
        .from(tableName)
        .upsert(participantRows, { onConflict: 'thread_id,member_id' })
        .select('thread_id');

      return {
        data,
        error,
      };
    },
  );

  console.log(`${THREAD_LOG_PREFIX}: participants saved`, {
    threadId,
    participantCount: participantRows.length,
    participantsTable: participantSnapshot.tableName,
  });
}

export async function ensureSupabaseThreadForThreadDetail(params: {
  currentUser: AuthSessionUser;
  thread: MessageThreadDetail;
}) {
  if (!isMessagesSupabaseConfigured()) {
    console.warn(`${THREAD_LOG_PREFIX}: skipped thread ensure because Supabase is not configured`);
    return null;
  }

  await ensureChatProfilesForThread(params.thread, params.currentUser);

  const participantIds = [
    ...new Set(params.thread.participants.map((participant) => participant.memberId)),
  ];
  const createdByMemberId = params.currentUser.memberId;

  if (params.thread.type === 'direct' && participantIds.length >= 2) {
    const participantPair = participantIds.sort().slice(0, 2) as [string, string];
    const existingThread = await findExistingDirectThread(participantPair);

    if (existingThread) {
      await saveThreadParticipants(existingThread.id, createdByMemberId, participantPair);

      const syncedThread = await updateThreadRecord(
        existingThread.id,
        buildThreadInsertFromDetail(params.thread, createdByMemberId),
      );
      const snapshot = await loadMirroredThreadSnapshot(existingThread.id);

      console.log(
        `${THREAD_LOG_PREFIX}: direct thread already exists in Supabase, reused existing row`,
        {
          threadId: existingThread.id,
          participantPair,
          snapshot,
        },
      );

      return syncedThread;
    }

    const createdThread = await createThreadRecord(
      buildThreadInsertFromDetail(params.thread, createdByMemberId),
    );

    await saveThreadParticipants(createdThread.id, createdByMemberId, participantPair);

    const snapshot = await loadMirroredThreadSnapshot(createdThread.id);

    console.log(`${THREAD_LOG_PREFIX}: direct thread mirrored to Supabase`, {
      threadId: createdThread.id,
      participantPair,
      snapshot,
    });

    return createdThread;
  }

  const existingGroupThread = await findExistingGroupThread(params.thread, createdByMemberId);

  if (existingGroupThread) {
    await saveThreadParticipants(existingGroupThread.id, createdByMemberId, participantIds);

    const syncedThread = await updateThreadRecord(
      existingGroupThread.id,
      buildThreadInsertFromDetail(params.thread, createdByMemberId),
    );
    const snapshot = await loadMirroredThreadSnapshot(existingGroupThread.id);

    console.log(
      `${THREAD_LOG_PREFIX}: group thread already exists in Supabase, reused existing row`,
      {
        threadId: existingGroupThread.id,
        participantIds,
        snapshot,
      },
    );

    return syncedThread;
  }

  const createdThread = await createThreadRecord(
    buildThreadInsertFromDetail(params.thread, createdByMemberId),
  );

  await saveThreadParticipants(createdThread.id, createdByMemberId, participantIds);

  const snapshot = await loadMirroredThreadSnapshot(createdThread.id);

  console.log(`${THREAD_LOG_PREFIX}: group thread mirrored to Supabase`, {
    threadId: createdThread.id,
    participantIds,
    snapshot,
  });

  return createdThread;
}

export async function mirrorDirectThreadToSupabase(params: {
  currentUser: AuthSessionUser;
  request: CreateDirectThreadRequest;
  thread: MessageThreadDetail;
}) {
  return ensureSupabaseThreadForThreadDetail({
    currentUser: params.currentUser,
    thread: params.thread,
  });
}

export async function mirrorGroupThreadToSupabase(params: {
  currentUser: AuthSessionUser;
  request: CreateGroupThreadRequest;
  thread: MessageThreadDetail;
}) {
  return ensureSupabaseThreadForThreadDetail({
    currentUser: params.currentUser,
    thread: params.thread,
  });
}
