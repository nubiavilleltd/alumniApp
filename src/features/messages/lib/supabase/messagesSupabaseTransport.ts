import { getAlumnusByMemberId } from '@/data/site-data';
import { getMockAccountByMemberId } from '@/features/authentication/lib/mockAuth';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import type { AuthSessionUser } from '@/features/authentication/types/auth.types';
import {
  assertValidMessageAttachmentUploadRequest,
  assertValidMessageAttachments,
  assertValidMessageBody,
  describeAttachmentForPreview,
  formatBytes,
} from '../../api/adapters/messages.adapter';
import {
  MESSAGE_POLLING_INTERVAL_MS,
  type CreateDirectThreadRequest,
  type CreateDirectThreadResponse,
  type CreateGroupThreadRequest,
  type CreateGroupThreadResponse,
  type GetMessageThreadRequest,
  type GetMessageThreadResponse,
  type ListMessageThreadsRequest,
  type ListMessageThreadsResponse,
  type MarkMessageThreadReadRequest,
  type MarkMessageThreadReadResponse,
  type MessagesTransport,
  type SendMessageRequest,
  type SendMessageResponse,
  type UploadMessageAttachmentRequest,
  type UploadMessageAttachmentResponse,
} from '../../api/messages.contract';
import type {
  MessageAttachment,
  MessageInboxData,
  MessageParticipant,
  MessageThreadCategory,
  MessageThreadDetail,
  MessageThreadSummary,
} from '../../types/messages.types';
import { getRegisteredMessageRecipient } from '../messageRecipientRegistry';
import { ensureChatProfile } from './chat.actions';
import { getMessagesSupabaseClient } from './index';
import type {
  ChatProfileInsert,
  ChatProfileRow,
  MessageAttachmentRow,
  MessageInsert,
  MessageRow,
  MessageThreadInsert,
  MessageThreadParticipantInsert,
  MessageThreadParticipantRow,
  MessageThreadRow,
} from './types';

const TRANSPORT_LOG_PREFIX = '[messages/supabase] transport';
const THREAD_PARTICIPANTS_TABLE_CANDIDATES = [
  'thread_participants',
  'message_thread_participants',
] as const;
const DRAFT_DIRECT_THREAD_PREFIX = 'draft-direct__';
const MESSAGE_ATTACHMENTS_BUCKET = 'message-attachments';

type ThreadParticipantsTableName = (typeof THREAD_PARTICIPANTS_TABLE_CANDIDATES)[number];
type SupabaseTableError = { code?: string | null; message?: string | null } | null | undefined;

function nowIso() {
  return new Date().toISOString();
}

function createSecureRandomSuffix() {
  if (typeof crypto !== 'undefined') {
    if (typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }

    if (typeof crypto.getRandomValues === 'function') {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      return Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
    }
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function deriveFirstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}

function deriveInitials(fullName: string) {
  const [first = '', second = ''] = fullName.trim().split(/\s+/);
  return `${first[0] ?? ''}${second[0] ?? ''}`.toUpperCase() || 'MB';
}

function normalizeCategory(value?: string | null): MessageThreadCategory {
  if (
    value === 'Mentorship' ||
    value === 'Events' ||
    value === 'Marketplace' ||
    value === 'Community'
  ) {
    return value;
  }

  return 'Community';
}

function normalizeAttachmentKind(value?: string | null): MessageAttachment['kind'] {
  if (value === 'image' || value === 'audio' || value === 'file') {
    return value;
  }

  return 'file';
}

function coerceNumber(value: number | string | null | undefined, fallback = 0) {
  if (typeof value === 'number') return value;

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function buildAttachmentWaveform(durationSeconds?: number) {
  const baseWaveform = [18, 28, 46, 34, 54, 23, 39, 58, 31, 43, 27, 48];
  const multiplier =
    durationSeconds && durationSeconds > 0 ? Math.min(durationSeconds / 10, 1.6) : 1;

  return baseWaveform.map((barHeight) => Math.round(barHeight * multiplier));
}

function sanitizeStoragePathSegment(value: string) {
  return (
    value
      .trim()
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'attachment'
  );
}

function createAttachmentStoragePath(viewerMemberId: string, fileName: string) {
  const safeMemberId = sanitizeStoragePathSegment(viewerMemberId);
  const safeFileName = sanitizeStoragePathSegment(fileName);
  const uniqueSuffix = createSecureRandomSuffix();

  return `members/${safeMemberId}/${uniqueSuffix}-${safeFileName}`;
}

async function resolveStorageObjectUrl(storagePath?: string | null, publicUrl?: string | null) {
  if (!storagePath) {
    return publicUrl ?? undefined;
  }

  const supabase = getMessagesSupabaseClient();
  const signedUrlResponse = await supabase.storage
    .from(MESSAGE_ATTACHMENTS_BUCKET)
    .createSignedUrl(storagePath, 60 * 60 * 24);

  if (!signedUrlResponse.error && signedUrlResponse.data?.signedUrl) {
    return signedUrlResponse.data.signedUrl;
  }

  if (signedUrlResponse.error) {
    console.warn(`${TRANSPORT_LOG_PREFIX}: failed while creating signed attachment url`, {
      storagePath,
      error: signedUrlResponse.error,
    });
  }

  return undefined;
}

async function mapAttachmentRowsToAttachments(attachmentRows: MessageAttachmentRow[]) {
  const attachments = await Promise.all(
    attachmentRows.map(async (attachmentRow) => {
      const durationSeconds =
        attachmentRow.duration_seconds == null
          ? undefined
          : coerceNumber(attachmentRow.duration_seconds);
      const url = await resolveStorageObjectUrl(
        attachmentRow.storage_path,
        attachmentRow.public_url,
      );

      return {
        id: String(attachmentRow.id),
        kind: normalizeAttachmentKind(attachmentRow.kind),
        fileName: attachmentRow.file_name ?? 'Attachment',
        mimeType: attachmentRow.mime_type ?? 'application/octet-stream',
        sizeInBytes: coerceNumber(attachmentRow.size_in_bytes),
        sizeLabel: formatBytes(coerceNumber(attachmentRow.size_in_bytes)),
        durationSeconds,
        uploadState: 'uploaded',
        url,
        waveform:
          normalizeAttachmentKind(attachmentRow.kind) === 'audio'
            ? buildAttachmentWaveform(durationSeconds)
            : undefined,
      } satisfies MessageAttachment;
    }),
  );

  return attachments;
}

function buildMessageType(request: SendMessageRequest) {
  const hasBody = !!request.body?.trim();
  const attachments = request.attachments ?? [];

  if (hasBody && attachments.length) return 'mixed';
  if (hasBody) return 'text';
  if (attachments.length === 1) return attachments[0].kind;
  return attachments.length > 1 ? 'attachment' : 'text';
}

function buildLastMessagePreview(request: SendMessageRequest) {
  const trimmedBody = request.body?.trim();
  if (trimmedBody) return trimmedBody;

  const attachments = request.attachments ?? [];
  if (attachments.length === 0) return '';
  if (attachments.length === 1) return describeAttachmentForPreview(attachments[0]);

  return `${attachments.length} attachments`;
}

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
      console.error(`${TRANSPORT_LOG_PREFIX}: ${operationName} failed`, {
        tableName,
        error: result.error,
      });
      throw result.error;
    }

    console.warn(`${TRANSPORT_LOG_PREFIX}: ${operationName} could not use table, trying fallback`, {
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

function createDraftDirectThreadId(viewerMemberId: string, participantMemberId: string) {
  return `${DRAFT_DIRECT_THREAD_PREFIX}${buildDirectKey([viewerMemberId, participantMemberId])}`;
}

function parseDraftDirectThreadId(threadId: string) {
  if (!threadId.startsWith(DRAFT_DIRECT_THREAD_PREFIX)) {
    return null;
  }

  const directKey = threadId.slice(DRAFT_DIRECT_THREAD_PREFIX.length);
  const memberIds = directKey.split('__').filter(Boolean);

  if (memberIds.length !== 2) {
    return null;
  }

  return {
    directKey,
    memberIds: memberIds as [string, string],
  };
}

function getCurrentSessionUser() {
  return useAuthStore.getState().user ?? null;
}

function requireAuthenticatedViewer(requestedViewerMemberId?: string | null) {
  const currentUser = getCurrentSessionUser();

  if (!currentUser?.memberId) {
    throw new Error('You must be logged in to use messages.');
  }

  if (requestedViewerMemberId && requestedViewerMemberId !== currentUser.memberId) {
    console.warn(`${TRANSPORT_LOG_PREFIX}: viewer member id mismatch, using current session user`, {
      requestedViewerMemberId,
      currentViewerMemberId: currentUser.memberId,
    });
  }

  return currentUser;
}

function buildProfileHrefFromSlug(slug?: string, fallbackMemberId?: string) {
  if (slug) return `/alumni/profiles/${slug}`;
  if (fallbackMemberId) return `/alumni/profiles/${fallbackMemberId}`;
  return '/alumni/profiles';
}

function buildChatProfileInsertForMemberId(
  memberId: string,
  currentUser?: AuthSessionUser | null,
): ChatProfileInsert | null {
  if (currentUser?.memberId === memberId) {
    return {
      member_id: currentUser.memberId,
      slug: currentUser.slug,
      full_name: currentUser.fullName,
      graduation_year: currentUser.graduationYear,
      avatar_url: currentUser.photo ?? null,
      initials: currentUser.avatarInitials,
      profile_href: currentUser.profileHref,
    };
  }

  const recipient = getRegisteredMessageRecipient(memberId);
  const alumnus = getAlumnusByMemberId(memberId);
  const account = getMockAccountByMemberId(memberId);
  const fullName =
    recipient?.fullName ||
    alumnus?.name ||
    [account?.otherNames, account?.surname].filter(Boolean).join(' ').trim();

  if (!fullName) {
    console.warn(`${TRANSPORT_LOG_PREFIX}: unable to build chat profile payload for member`, {
      memberId,
    });
    return null;
  }

  return {
    member_id: memberId,
    slug: recipient?.slug ?? alumnus?.slug ?? account?.slug ?? memberId,
    full_name: fullName,
    graduation_year:
      recipient?.graduationYear ??
      alumnus?.year ??
      account?.graduationYear ??
      new Date().getFullYear(),
    avatar_url: recipient?.avatar ?? alumnus?.photo ?? account?.photo ?? null,
    initials: deriveInitials(fullName),
    profile_href: recipient?.profileHref ?? buildProfileHrefFromSlug(alumnus?.slug, memberId),
  };
}

async function ensureProfileCopyForMemberId(
  memberId: string,
  currentUser?: AuthSessionUser | null,
) {
  const profilePayload = buildChatProfileInsertForMemberId(memberId, currentUser);

  if (!profilePayload) {
    return null;
  }

  const supabase = getMessagesSupabaseClient();
  const { data: existingProfiles, error: existingProfilesError } = await supabase
    .from('chat_profiles')
    .select('*')
    .eq('member_id', memberId)
    .order('created_at', { ascending: true })
    .limit(1);

  if (existingProfilesError) {
    console.error(`${TRANSPORT_LOG_PREFIX}: failed while checking chat profile copy`, {
      memberId,
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
    console.error(`${TRANSPORT_LOG_PREFIX}: failed while creating chat profile copy`, {
      memberId,
      payload: profilePayload,
      error: createProfileError,
    });
    throw createProfileError;
  }

  console.log(`${TRANSPORT_LOG_PREFIX}: chat profile copy created`, {
    memberId,
    chatProfileId: createdProfile.id,
  });

  return createdProfile;
}

async function ensureViewerProfile(viewerMemberId: string) {
  const currentUser = requireAuthenticatedViewer(viewerMemberId);
  await ensureChatProfile(currentUser);
  return currentUser;
}

async function loadProfilesByMemberIds(memberIds: string[]) {
  if (!memberIds.length) {
    return new Map<string, ChatProfileRow>();
  }

  const supabase = getMessagesSupabaseClient();
  const { data, error } = await supabase
    .from('chat_profiles')
    .select('*')
    .in('member_id', memberIds);

  if (error) {
    console.error(`${TRANSPORT_LOG_PREFIX}: failed while loading chat profiles`, {
      memberIds,
      error,
    });
    throw error;
  }

  return new Map((data ?? []).map((profile) => [profile.member_id, profile]));
}

function buildParticipantFromProfileLike(params: {
  memberId: string;
  role: MessageParticipant['roleInThread'];
  fullName: string;
  slug?: string;
  graduationYear?: number;
  avatarUrl?: string | null;
  initials?: string;
  profileHref?: string;
}) {
  const firstName = deriveFirstName(params.fullName);

  return {
    memberId: params.memberId,
    slug: params.slug ?? params.memberId,
    fullName: params.fullName,
    firstName,
    headline: params.graduationYear ? `Class of ${params.graduationYear}` : 'FGGC alumna',
    location: 'Nigeria',
    graduationYear: params.graduationYear ?? new Date().getFullYear(),
    avatar: params.avatarUrl ?? undefined,
    initials: params.initials ?? deriveInitials(params.fullName),
    profileHref: params.profileHref ?? buildProfileHrefFromSlug(params.slug, params.memberId),
    presence: 'offline',
    roleInThread: params.role,
  } satisfies MessageParticipant;
}

async function loadThreadRowsByIds(threadIds: string[]) {
  if (!threadIds.length) return [];

  const supabase = getMessagesSupabaseClient();
  const { data, error } = await supabase.from('message_threads').select('*').in('id', threadIds);

  if (error) {
    console.error(`${TRANSPORT_LOG_PREFIX}: failed while loading thread rows`, {
      threadIds,
      error,
    });
    throw error;
  }

  return (data ?? []) as MessageThreadRow[];
}

async function loadParticipantRowsForThreadIds(threadIds: string[]) {
  if (!threadIds.length) {
    return {
      rows: [] as MessageThreadParticipantRow[],
      tableName: THREAD_PARTICIPANTS_TABLE_CANDIDATES[0],
    };
  }

  const result = await queryThreadParticipantsTable(
    'loading thread participants',
    async (tableName) => {
      const { data, error } = await getMessagesSupabaseClient()
        .from(tableName)
        .select('thread_id, member_id, role')
        .in('thread_id', threadIds);

      return {
        data,
        error,
      };
    },
  );

  return {
    rows: (result.data ?? []) as MessageThreadParticipantRow[],
    tableName: result.tableName,
  };
}

async function loadParticipantRowsForViewer(viewerMemberId: string) {
  const result = await queryThreadParticipantsTable(
    'loading viewer participant rows',
    async (tableName) => {
      const { data, error } = await getMessagesSupabaseClient()
        .from(tableName)
        .select('thread_id, member_id, role')
        .eq('member_id', viewerMemberId);

      return {
        data,
        error,
      };
    },
  );

  return {
    rows: (result.data ?? []) as MessageThreadParticipantRow[],
    tableName: result.tableName,
  };
}

function buildParticipant(
  memberId: string,
  role: MessageThreadParticipantRow['role'],
  profile?: ChatProfileRow,
): MessageParticipant {
  if (profile) {
    return buildParticipantFromProfileLike({
      memberId,
      role,
      fullName: profile.full_name,
      slug: profile.slug,
      graduationYear: profile.graduation_year,
      avatarUrl: profile.avatar_url,
      initials: profile.initials,
      profileHref: profile.profile_href,
    });
  }

  return buildParticipantFromProfileLike({
    memberId,
    role,
    fullName: `Member ${memberId}`,
  });
}

async function buildDraftDirectThreadDetail(threadId: string, viewerMemberId: string) {
  const parsedDraft = parseDraftDirectThreadId(threadId);
  if (!parsedDraft) {
    return null;
  }

  if (!parsedDraft.memberIds.includes(viewerMemberId)) {
    throw new Error('You do not have access to this conversation.');
  }

  const participantMemberId =
    parsedDraft.memberIds.find((memberId) => memberId !== viewerMemberId) ?? viewerMemberId;
  const currentUser = getCurrentSessionUser();
  const profilesByMemberId = await loadProfilesByMemberIds(parsedDraft.memberIds);
  const viewerProfile = profilesByMemberId.get(viewerMemberId);
  const participantProfile = profilesByMemberId.get(participantMemberId);
  const participantFallback = buildChatProfileInsertForMemberId(participantMemberId, currentUser);

  const viewerParticipant = currentUser
    ? buildParticipantFromProfileLike({
        memberId: currentUser.memberId,
        role: 'admin',
        fullName: currentUser.fullName,
        slug: currentUser.slug,
        graduationYear: currentUser.graduationYear,
        avatarUrl: currentUser.photo ?? null,
        initials: currentUser.avatarInitials,
        profileHref: currentUser.profileHref,
      })
    : buildParticipant(viewerMemberId, 'admin', viewerProfile);

  const otherParticipant = participantProfile
    ? buildParticipant(participantMemberId, 'member', participantProfile)
    : buildParticipantFromProfileLike({
        memberId: participantMemberId,
        role: 'member',
        fullName: participantFallback?.full_name ?? `Member ${participantMemberId}`,
        slug: participantFallback?.slug ?? participantMemberId,
        graduationYear: participantFallback?.graduation_year,
        avatarUrl: participantFallback?.avatar_url ?? null,
        initials: participantFallback?.initials,
        profileHref: participantFallback?.profile_href,
      });

  return {
    id: threadId,
    type: 'direct',
    category: 'Community',
    title: otherParticipant.fullName,
    subtitle: otherParticipant.headline,
    topic: 'Direct conversation',
    avatar: otherParticipant.avatar,
    initials: otherParticipant.initials,
    unreadCount: 0,
    isPinned: false,
    lastActivityAt: nowIso(),
    lastMessagePreview: 'No messages yet.',
    lastMessageSenderName: undefined,
    presence: otherParticipant.presence,
    memberCount: 2,
    participants: [viewerParticipant, otherParticipant],
    description: undefined,
    attachmentsEnabled: true,
    audioEnabled: true,
    messages: [],
    syncToken: `supabase-draft-${parsedDraft.directKey}`,
    pollingIntervalMs: MESSAGE_POLLING_INTERVAL_MS,
  } satisfies MessageThreadDetail;
}

function buildThreadSummaryFromRows(params: {
  thread: MessageThreadRow;
  participantRows: MessageThreadParticipantRow[];
  profilesByMemberId: Map<string, ChatProfileRow>;
  viewerMemberId: string;
}): MessageThreadSummary {
  const participants = params.participantRows.map((participantRow) =>
    buildParticipant(
      participantRow.member_id,
      participantRow.role,
      params.profilesByMemberId.get(participantRow.member_id),
    ),
  );

  const lastActivityAt =
    params.thread.last_message_at ?? params.thread.updated_at ?? params.thread.created_at;
  const lastMessagePreview = params.thread.last_message_preview?.trim() || 'No messages yet.';

  if (params.thread.type === 'direct') {
    const otherParticipant =
      participants.find((participant) => participant.memberId !== params.viewerMemberId) ??
      participants[0];

    return {
      id: params.thread.id,
      type: 'direct',
      category: normalizeCategory(params.thread.category),
      title: otherParticipant?.fullName ?? 'Direct conversation',
      subtitle: otherParticipant?.headline ?? 'FGGC alumna',
      topic: 'Direct conversation',
      avatar: otherParticipant?.avatar,
      initials: otherParticipant?.initials ?? 'MB',
      unreadCount: 0,
      isPinned: false,
      lastActivityAt,
      lastMessagePreview,
      lastMessageSenderName: params.thread.last_message_sender_name ?? undefined,
      presence: otherParticipant?.presence ?? 'offline',
      memberCount: participants.length,
      participants,
    };
  }

  const groupTitle = params.thread.title?.trim() || 'Group conversation';

  return {
    id: params.thread.id,
    type: 'group',
    category: normalizeCategory(params.thread.category),
    title: groupTitle,
    subtitle: `${participants.length} members`,
    topic: groupTitle,
    initials: deriveInitials(groupTitle),
    unreadCount: 0,
    isPinned: false,
    lastActivityAt,
    lastMessagePreview,
    lastMessageSenderName: params.thread.last_message_sender_name ?? undefined,
    memberCount: participants.length,
    participants,
  };
}

async function loadThreadDetailById(threadId: string, viewerMemberId: string) {
  const draftThread = await buildDraftDirectThreadDetail(threadId, viewerMemberId);
  if (draftThread) {
    return draftThread;
  }

  const supabase = getMessagesSupabaseClient();
  const { data: threadRow, error: threadError } = await supabase
    .from('message_threads')
    .select('*')
    .eq('id', threadId)
    .single();

  if (threadError) {
    console.error(`${TRANSPORT_LOG_PREFIX}: failed while loading thread detail`, {
      threadId,
      error: threadError,
    });
    throw threadError;
  }

  const participantResult = await queryThreadParticipantsTable(
    'loading thread detail participants',
    async (tableName) => {
      const { data, error } = await getMessagesSupabaseClient()
        .from(tableName)
        .select('thread_id, member_id, role')
        .eq('thread_id', threadId);

      return {
        data,
        error,
      };
    },
  );

  const participantRows = (participantResult.data ?? []) as MessageThreadParticipantRow[];
  const viewerIsParticipant = participantRows.some(
    (participantRow) => participantRow.member_id === viewerMemberId,
  );

  if (!viewerIsParticipant) {
    throw new Error('You do not have access to this conversation.');
  }

  const memberIds = [...new Set(participantRows.map((participantRow) => participantRow.member_id))];
  const profilesByMemberId = await loadProfilesByMemberIds(memberIds);
  const summary = buildThreadSummaryFromRows({
    thread: threadRow as MessageThreadRow,
    participantRows,
    profilesByMemberId,
    viewerMemberId,
  });

  const { data: messageRows, error: messageRowsError } = await supabase
    .from('messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });

  if (messageRowsError) {
    console.error(`${TRANSPORT_LOG_PREFIX}: failed while loading thread messages`, {
      threadId,
      error: messageRowsError,
    });
    throw messageRowsError;
  }

  const messages = (messageRows ?? []) as MessageRow[];
  const messageIds = messages.map((message) => message.id);
  let attachmentsByMessageId = new Map<string, MessageAttachment[]>();

  if (messageIds.length) {
    const { data: attachmentRows, error: attachmentRowsError } = await supabase
      .from('messages_attachments')
      .select('*')
      .in('message_id', messageIds);

    if (attachmentRowsError) {
      console.error(`${TRANSPORT_LOG_PREFIX}: failed while loading message attachments`, {
        threadId,
        messageIds,
        error: attachmentRowsError,
      });
      throw attachmentRowsError;
    }

    const mappedAttachments = await mapAttachmentRowsToAttachments(
      (attachmentRows ?? []) as MessageAttachmentRow[],
    );

    attachmentsByMessageId = (attachmentRows ?? []).reduce<Map<string, MessageAttachment[]>>(
      (accumulator, attachmentRow, index) => {
        if (!attachmentRow.message_id) return accumulator;

        accumulator.set(attachmentRow.message_id, [
          ...(accumulator.get(attachmentRow.message_id) ?? []),
          mappedAttachments[index],
        ]);
        return accumulator;
      },
      new Map<string, MessageAttachment[]>(),
    );
  }

  const messagesById = messages.map((message) => {
    const sender = profilesByMemberId.get(message.sender_member_id ?? '');
    const senderName = sender?.full_name ?? `Member ${message.sender_member_id ?? ''}`;

    return {
      id: message.id,
      threadId,
      senderMemberId: message.sender_member_id ?? '',
      senderDisplayName: senderName,
      senderAvatar: sender?.avatar_url ?? undefined,
      body: message.deleted_at ? 'Message removed' : (message.body ?? ''),
      createdAt: message.created_at,
      status: message.sender_member_id === viewerMemberId ? 'sent' : 'seen',
      attachments: attachmentsByMessageId.get(message.id) ?? [],
      isOwn: message.sender_member_id === viewerMemberId,
    } satisfies MessageThreadDetail['messages'][number];
  });

  return {
    ...summary,
    description: undefined,
    attachmentsEnabled: threadRow.attachment_enabled ?? true,
    audioEnabled: threadRow.audio_enabled ?? true,
    messages: messagesById,
    syncToken: `supabase-${threadRow.updated_at ?? threadRow.created_at}`,
    pollingIntervalMs: MESSAGE_POLLING_INTERVAL_MS,
  } satisfies MessageThreadDetail;
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

  const result = await queryThreadParticipantsTable(
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

  console.log(`${TRANSPORT_LOG_PREFIX}: thread participants saved`, {
    threadId,
    participantCount: participantRows.length,
    participantsTable: result.tableName,
  });
}

async function createThreadRow(payload: MessageThreadInsert) {
  const { data, error } = await getMessagesSupabaseClient()
    .from('message_threads')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    console.error(`${TRANSPORT_LOG_PREFIX}: failed while creating thread`, {
      payload,
      error,
    });
    throw error;
  }

  return data as MessageThreadRow;
}

async function findExistingDirectThread(viewerMemberId: string, participantMemberId: string) {
  const directKey = buildDirectKey([viewerMemberId, participantMemberId]);
  const { data, error } = await getMessagesSupabaseClient()
    .from('message_threads')
    .select('*')
    .eq('type', 'direct')
    .eq('direct_key', directKey)
    .order('created_at', { ascending: true })
    .limit(1);

  if (error) {
    console.error(`${TRANSPORT_LOG_PREFIX}: failed while looking up direct thread`, {
      directKey,
      viewerMemberId,
      participantMemberId,
      error,
    });
    throw error;
  }

  return (data?.[0] ?? null) as MessageThreadRow | null;
}

async function createDirectThreadInSupabase(request: CreateDirectThreadRequest) {
  const currentUser = await ensureViewerProfile(request.viewerMemberId);
  await ensureProfileCopyForMemberId(request.participantMemberId, currentUser);

  const existingThread = await findExistingDirectThread(
    request.viewerMemberId,
    request.participantMemberId,
  );

  if (existingThread) {
    await saveThreadParticipants(existingThread.id, request.viewerMemberId, [
      request.viewerMemberId,
      request.participantMemberId,
    ]);

    return existingThread;
  }

  const createdThread = await createThreadRow({
    type: 'direct',
    title: null,
    created_by: request.viewerMemberId,
    updated_at: nowIso(),
    last_message_id: null,
    last_message_at: null,
    category: 'Community',
    direct_key: buildDirectKey([request.viewerMemberId, request.participantMemberId]),
    last_message_preview: null,
    last_message_sender_name: null,
    attachment_enabled: true,
    audio_enabled: true,
  });

  await saveThreadParticipants(createdThread.id, request.viewerMemberId, [
    request.viewerMemberId,
    request.participantMemberId,
  ]);

  return createdThread;
}

async function resolveThreadIdForSend(request: SendMessageRequest) {
  const parsedDraft = parseDraftDirectThreadId(request.threadId);

  if (!parsedDraft) {
    return request.threadId;
  }

  const participantMemberId =
    parsedDraft.memberIds.find((memberId) => memberId !== request.viewerMemberId) ??
    request.viewerMemberId;

  const threadRow = await createDirectThreadInSupabase({
    viewerMemberId: request.viewerMemberId,
    participantMemberId,
    topic: undefined,
  });

  return threadRow.id;
}

async function attachUploadedAttachmentsToMessage(params: {
  threadId: string;
  messageId: string;
  viewerMemberId: string;
  attachments: MessageAttachment[];
}) {
  const attachmentIds = params.attachments
    .map((attachment) => Number(attachment.id))
    .filter((attachmentId) => Number.isFinite(attachmentId));

  if (!attachmentIds.length) {
    return;
  }

  const expectedStoragePrefix = `members/${sanitizeStoragePathSegment(params.viewerMemberId)}/`;
  const { data: stagedAttachments, error: stagedAttachmentsError } =
    await getMessagesSupabaseClient()
      .from('messages_attachments')
      .select('id, storage_path, message_id')
      .in('id', attachmentIds);

  if (stagedAttachmentsError) {
    console.error(`${TRANSPORT_LOG_PREFIX}: failed while verifying staged uploads`, {
      threadId: params.threadId,
      messageId: params.messageId,
      attachmentIds,
      error: stagedAttachmentsError,
    });
    throw stagedAttachmentsError;
  }

  const safeStagedAttachments = stagedAttachments ?? [];
  if (safeStagedAttachments.length !== attachmentIds.length) {
    throw new Error('One or more attachments could not be verified before send.');
  }

  const invalidAttachment = safeStagedAttachments.find((attachmentRow) => {
    if (!attachmentRow.storage_path?.startsWith(expectedStoragePrefix)) {
      return true;
    }

    if (attachmentRow.message_id && attachmentRow.message_id !== params.messageId) {
      return true;
    }

    return false;
  });

  if (invalidAttachment) {
    throw new Error('One or more attachments do not belong to the current user.');
  }

  const { error } = await getMessagesSupabaseClient()
    .from('messages_attachments')
    .update({
      thread_id: params.threadId,
      message_id: params.messageId,
    })
    .in('id', attachmentIds);

  if (error) {
    console.error(`${TRANSPORT_LOG_PREFIX}: failed while attaching staged uploads to message`, {
      threadId: params.threadId,
      messageId: params.messageId,
      attachmentIds,
      error,
    });
    throw error;
  }
}

async function createGroupThreadInSupabase(request: CreateGroupThreadRequest) {
  const currentUser = await ensureViewerProfile(request.viewerMemberId);
  const participantIds = Array.from(new Set([request.viewerMemberId, ...request.memberIds]));

  await Promise.all(
    participantIds.map((memberId) => ensureProfileCopyForMemberId(memberId, currentUser)),
  );

  const createdThread = await createThreadRow({
    type: 'group',
    title: request.title,
    created_by: request.viewerMemberId,
    updated_at: nowIso(),
    last_message_id: null,
    last_message_at: null,
    category: request.category ?? 'Community',
    direct_key: null,
    last_message_preview: null,
    last_message_sender_name: null,
    attachment_enabled: true,
    audio_enabled: true,
  });

  await saveThreadParticipants(createdThread.id, request.viewerMemberId, participantIds);

  return createdThread;
}

async function buildInboxData(viewerMemberId: string, limit?: number): Promise<MessageInboxData> {
  const viewerParticipants = await loadParticipantRowsForViewer(viewerMemberId);
  const threadIds = [...new Set(viewerParticipants.rows.map((row) => row.thread_id))];
  const threadRows = await loadThreadRowsByIds(threadIds);

  if (!threadRows.length) {
    return {
      threads: [],
      unreadCount: 0,
      syncToken: `supabase-${nowIso()}`,
      pollingIntervalMs: MESSAGE_POLLING_INTERVAL_MS,
    };
  }

  const allParticipantRows = await loadParticipantRowsForThreadIds(threadIds);
  const participantRowsByThreadId = allParticipantRows.rows.reduce<
    Record<string, MessageThreadParticipantRow[]>
  >((accumulator, row) => {
    accumulator[row.thread_id] = [...(accumulator[row.thread_id] ?? []), row];
    return accumulator;
  }, {});

  const memberIds = [...new Set(allParticipantRows.rows.map((row) => row.member_id))];
  const profilesByMemberId = await loadProfilesByMemberIds(memberIds);

  const threads = [...threadRows]
    .sort((left, right) => {
      const leftTime = Date.parse(left.last_message_at ?? left.updated_at ?? left.created_at);
      const rightTime = Date.parse(right.last_message_at ?? right.updated_at ?? right.created_at);
      return rightTime - leftTime;
    })
    .map((threadRow) =>
      buildThreadSummaryFromRows({
        thread: threadRow,
        participantRows: participantRowsByThreadId[threadRow.id] ?? [],
        profilesByMemberId,
        viewerMemberId,
      }),
    );

  return {
    threads: typeof limit === 'number' ? threads.slice(0, limit) : threads,
    unreadCount: 0,
    syncToken: `supabase-${nowIso()}`,
    pollingIntervalMs: MESSAGE_POLLING_INTERVAL_MS,
  };
}

async function getSenderDisplayName(senderMemberId: string, viewerMemberId: string) {
  const currentUser = getCurrentSessionUser();

  if (currentUser?.memberId === senderMemberId) {
    return currentUser.fullName;
  }

  const profiles = await loadProfilesByMemberIds([senderMemberId]);
  return profiles.get(senderMemberId)?.full_name ?? senderMemberId;
}

export const supabaseMessagesTransport: MessagesTransport = {
  async listThreads(request: ListMessageThreadsRequest): Promise<ListMessageThreadsResponse> {
    const viewer = requireAuthenticatedViewer(request.viewerMemberId);
    const inbox = await buildInboxData(viewer.memberId, request.limit);

    return {
      ...inbox,
      serverTime: nowIso(),
    };
  },

  async getThread(request: GetMessageThreadRequest): Promise<GetMessageThreadResponse> {
    const viewer = requireAuthenticatedViewer(request.viewerMemberId);
    const thread = await loadThreadDetailById(request.threadId, viewer.memberId);

    return {
      thread,
      syncToken: thread.syncToken,
      serverTime: nowIso(),
    };
  },

  async uploadAttachment(
    request: UploadMessageAttachmentRequest,
  ): Promise<UploadMessageAttachmentResponse> {
    if (!request.binary) {
      throw new Error('Attachment data is missing. Please choose the file again.');
    }

    const viewer = requireAuthenticatedViewer(request.viewerMemberId);
    assertValidMessageAttachmentUploadRequest(request);
    await ensureViewerProfile(viewer.memberId);

    const storagePath = createAttachmentStoragePath(viewer.memberId, request.fileName);
    const supabase = getMessagesSupabaseClient();
    const uploadResponse = await supabase.storage
      .from(MESSAGE_ATTACHMENTS_BUCKET)
      .upload(storagePath, request.binary, {
        contentType: request.mimeType,
        upsert: false,
      });

    if (uploadResponse.error) {
      console.error(`${TRANSPORT_LOG_PREFIX}: failed while uploading attachment to storage`, {
        viewerMemberId: request.viewerMemberId,
        fileName: request.fileName,
        storagePath,
        error: uploadResponse.error,
      });
      throw uploadResponse.error;
    }

    const attachmentPayload: MessageAttachmentInsert = {
      message_id: null,
      thread_id: null,
      kind: request.kind,
      file_name: request.fileName,
      mime_type: request.mimeType,
      size_in_bytes: request.sizeInBytes,
      storage_path: storagePath,
      public_url: null,
      duration_seconds: request.durationSeconds ?? null,
    };

    const { data: createdAttachment, error: createAttachmentError } = await supabase
      .from('messages_attachments')
      .insert(attachmentPayload)
      .select('*')
      .single();

    if (createAttachmentError) {
      console.error(`${TRANSPORT_LOG_PREFIX}: failed while creating attachment row`, {
        viewerMemberId: request.viewerMemberId,
        payload: attachmentPayload,
        error: createAttachmentError,
      });
      throw createAttachmentError;
    }

    const [attachment] = await mapAttachmentRowsToAttachments([
      createdAttachment as MessageAttachmentRow,
    ]);

    return {
      attachment,
      serverTime: nowIso(),
    };
  },

  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    const viewer = requireAuthenticatedViewer(request.viewerMemberId);
    assertValidMessageBody(request.body);
    assertValidMessageAttachments(request.attachments);
    if (!request.body?.trim() && (!request.attachments || request.attachments.length === 0)) {
      throw new Error('Write a message before sending.');
    }

    const trustedRequest: SendMessageRequest = {
      ...request,
      viewerMemberId: viewer.memberId,
    };
    const resolvedThreadId = await resolveThreadIdForSend(trustedRequest);
    const thread = await loadThreadDetailById(resolvedThreadId, viewer.memberId);
    const existingMessage = await getMessagesSupabaseClient()
      .from('messages')
      .select('*')
      .eq('thread_id', resolvedThreadId)
      .eq('client_generated_id', trustedRequest.clientGeneratedId)
      .order('created_at', { ascending: true })
      .limit(1);

    if (existingMessage.error) {
      console.error(`${TRANSPORT_LOG_PREFIX}: failed while checking duplicate message send`, {
        threadId: request.threadId,
        resolvedThreadId,
        clientGeneratedId: request.clientGeneratedId,
        error: existingMessage.error,
      });
      throw existingMessage.error;
    }

    const duplicateMessage = (existingMessage.data?.[0] ?? null) as MessageRow | null;
    if (duplicateMessage) {
      const latestThread = await loadThreadDetailById(resolvedThreadId, viewer.memberId);
      return {
        thread: latestThread,
        messageId: duplicateMessage.id,
        serverTime: nowIso(),
      };
    }

    const payload: MessageInsert = {
      thread_id: resolvedThreadId,
      sender_member_id: viewer.memberId,
      body: trustedRequest.body?.trim() ?? '',
      updated_at: nowIso(),
      message_type: buildMessageType(trustedRequest),
      deleted_at: null,
      client_generated_id: trustedRequest.clientGeneratedId,
    };

    const { data: createdMessage, error: createMessageError } = await getMessagesSupabaseClient()
      .from('messages')
      .insert(payload)
      .select('*')
      .single();

    if (createMessageError) {
      console.error(`${TRANSPORT_LOG_PREFIX}: failed while creating message`, {
        payload,
        resolvedThreadId,
        error: createMessageError,
      });
      throw createMessageError;
    }

    if (trustedRequest.attachments?.length) {
      await attachUploadedAttachmentsToMessage({
        threadId: resolvedThreadId,
        messageId: createdMessage.id,
        viewerMemberId: viewer.memberId,
        attachments: trustedRequest.attachments,
      });
    }

    const senderDisplayName = await getSenderDisplayName(viewer.memberId, viewer.memberId);

    const lastMessagePreview = buildLastMessagePreview(trustedRequest);

    const { error: updateThreadError } = await getMessagesSupabaseClient()
      .from('message_threads')
      .update({
        updated_at: createdMessage.updated_at ?? createdMessage.created_at,
        last_message_id: createdMessage.id,
        last_message_at: createdMessage.created_at,
        last_message_preview: lastMessagePreview,
        last_message_sender_name: senderDisplayName,
      })
      .eq('id', resolvedThreadId);

    if (updateThreadError) {
      console.error(`${TRANSPORT_LOG_PREFIX}: failed while updating thread after send`, {
        threadId: resolvedThreadId,
        messageId: createdMessage.id,
        error: updateThreadError,
      });
      throw updateThreadError;
    }

    const latestThread = await loadThreadDetailById(thread.id, viewer.memberId);

    return {
      thread: latestThread,
      messageId: createdMessage.id,
      serverTime: nowIso(),
    };
  },

  async markThreadRead(
    request: MarkMessageThreadReadRequest,
  ): Promise<MarkMessageThreadReadResponse> {
    const viewer = requireAuthenticatedViewer(request.viewerMemberId);
    await loadThreadDetailById(request.threadId, viewer.memberId);

    return {
      threadId: request.threadId,
      unreadCount: 0,
      serverTime: nowIso(),
    };
  },

  async createDirectThread(
    request: CreateDirectThreadRequest,
  ): Promise<CreateDirectThreadResponse> {
    const viewer = requireAuthenticatedViewer(request.viewerMemberId);

    if (viewer.memberId === request.participantMemberId) {
      throw new Error('You cannot start a direct conversation with yourself.');
    }

    const existingThread = await findExistingDirectThread(
      viewer.memberId,
      request.participantMemberId,
    );
    let thread: MessageThreadDetail | null = null;

    if (existingThread) {
      try {
        thread = await loadThreadDetailById(existingThread.id, viewer.memberId);
      } catch (error) {
        console.warn(
          `${TRANSPORT_LOG_PREFIX}: existing direct thread could not be loaded yet, falling back to draft thread`,
          {
            threadId: existingThread.id,
            viewerMemberId: viewer.memberId,
            participantMemberId: request.participantMemberId,
            error,
          },
        );
      }
    }

    if (!thread) {
      thread = await buildDraftDirectThreadDetail(
        createDraftDirectThreadId(viewer.memberId, request.participantMemberId),
        viewer.memberId,
      );
    }

    if (!thread) {
      throw new Error('Unable to prepare this conversation.');
    }

    return {
      thread,
      serverTime: nowIso(),
    };
  },

  async createGroupThread(request: CreateGroupThreadRequest): Promise<CreateGroupThreadResponse> {
    const viewer = requireAuthenticatedViewer(request.viewerMemberId);
    const memberIds = Array.from(
      new Set(request.memberIds.map((memberId) => memberId.trim()).filter(Boolean)),
    ).filter((memberId) => memberId !== viewer.memberId);

    if (!request.title.trim()) {
      throw new Error('Give this group a title before creating it.');
    }

    if (memberIds.length === 0) {
      throw new Error('Add at least one other member to create a group.');
    }

    const threadRow = await createGroupThreadInSupabase({
      ...request,
      viewerMemberId: viewer.memberId,
      title: request.title.trim(),
      memberIds,
    });
    const thread = await loadThreadDetailById(threadRow.id, viewer.memberId);

    return {
      thread,
      serverTime: nowIso(),
    };
  },
};
