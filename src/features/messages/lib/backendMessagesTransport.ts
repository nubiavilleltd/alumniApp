import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import {
  extractList,
  extractObject,
  generateSlug,
  safeParseDate,
  safeParseInt,
  stringToBoolean,
} from '@/lib/utils/adapters';
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
} from '../api/messages.contract';
import { formatBytes } from '../api/adapters/messages.adapter';
import { getRegisteredMessageRecipient } from './messageRecipientRegistry';
import { placeholderMessagesTransport } from './placeholderMessagesTransport';
import type {
  MessageAttachment,
  MessageParticipant,
  MessageThreadCategory,
  MessageThreadDetail,
  MessageThreadSummary,
} from '../types/messages.types';

type BackendEnvelope = Record<string, unknown> & {
  status?: number;
  message?: string;
  data?: unknown;
};

type BackendThreadParticipant = Record<string, unknown>;
type BackendThreadLike = Record<string, unknown>;
type BackendMessageLike = Record<string, unknown>;
type DirectDraftThreadEntry = {
  participantMemberId: string;
  topic?: string;
  thread: MessageThreadDetail;
};
type StagedBackendAttachment = MessageAttachment & {
  __backendUploadRequest?: UploadMessageAttachmentRequest;
};

const DRAFT_DIRECT_THREAD_PREFIX = 'draft-direct__';
const directDraftThreads = new Map<string, DirectDraftThreadEntry>();

function nowIso() {
  return new Date().toISOString();
}

function createLocalAttachmentId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `staged-${crypto.randomUUID()}`;
  }

  return `staged-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sortThreadsForInbox(threads: MessageThreadSummary[]) {
  return [...threads].sort((left, right) => {
    if (left.isPinned !== right.isPinned) {
      return left.isPinned ? -1 : 1;
    }

    return Date.parse(right.lastActivityAt) - Date.parse(left.lastActivityAt);
  });
}

function sortMessagesChronologically(messages: MessageThreadDetail['messages']) {
  return [...messages].sort(
    (left, right) => Date.parse(left.createdAt) - Date.parse(right.createdAt),
  );
}

function normalizeBackendTimestamp(value: unknown) {
  if (typeof value === 'string' && value.includes(' ') && !value.includes('T')) {
    return safeParseDate(value.replace(' ', 'T'));
  }

  return safeParseDate(value);
}

function normalizeBackendIdentifierValue(value: string) {
  const trimmedValue = value.trim();

  if (/^\d+$/.test(trimmedValue)) {
    return Number(trimmedValue);
  }

  return trimmedValue;
}

function deriveInitials(value: string) {
  return (
    value
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'MB'
  );
}

function normalizeThreadCategory(value: unknown): MessageThreadCategory {
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

function normalizeThreadType(value: unknown): MessageThreadSummary['type'] {
  return value === 'group' ? 'group' : 'direct';
}

function normalizeParticipantRole(value: unknown): MessageParticipant['roleInThread'] {
  if (value === 'admin' || value === 'moderator' || value === 'member') {
    return value;
  }

  return 'member';
}

function getCurrentSessionUser() {
  return useAuthStore.getState().user;
}

function getEnvelopeData(responseData: unknown) {
  const envelope = extractObject(responseData, ['data']) as BackendEnvelope | null;
  if (envelope) {
    return envelope;
  }

  return (responseData as BackendEnvelope | null) ?? null;
}

function buildParticipantFromBackend(
  rawParticipant: BackendThreadParticipant,
  viewerMemberId: string,
): MessageParticipant {
  const rawUserId =
    rawParticipant.user_id ??
    rawParticipant.member_id ??
    rawParticipant.id ??
    rawParticipant.recipient_id ??
    '';
  const memberId = String(rawUserId || '');
  const currentUser = getCurrentSessionUser();
  const recipientRegistryEntry = getRegisteredMessageRecipient(memberId);
  const backendFullName =
    String(rawParticipant.fullname ?? rawParticipant.full_name ?? '').trim() || undefined;
  const fullName =
    (memberId === viewerMemberId ? currentUser?.fullName : undefined) ??
    backendFullName ??
    recipientRegistryEntry?.fullName ??
    `Member ${memberId}`;
  const firstName = fullName.split(/\s+/)[0] ?? fullName;
  const avatar =
    (memberId === viewerMemberId ? currentUser?.photo : undefined) ??
    (typeof rawParticipant.image === 'string' ? rawParticipant.image : undefined) ??
    recipientRegistryEntry?.avatar;
  const graduationYear =
    safeParseInt(rawParticipant.graduation_year ?? rawParticipant.year) ??
    (memberId === viewerMemberId ? currentUser?.graduationYear : undefined) ??
    recipientRegistryEntry?.graduationYear ??
    new Date().getFullYear();
  const slug =
    (memberId === viewerMemberId ? currentUser?.slug : undefined) ??
    recipientRegistryEntry?.slug ??
    generateSlug(fullName, memberId || firstName, 'member');

  return {
    memberId,
    slug,
    fullName,
    firstName,
    headline: graduationYear ? `Class of ${graduationYear}` : 'FGGC alumna',
    location: 'Nigeria',
    graduationYear,
    avatar,
    initials:
      (memberId === viewerMemberId ? currentUser?.avatarInitials : undefined) ??
      deriveInitials(fullName),
    profileHref:
      (memberId === viewerMemberId ? currentUser?.profileHref : undefined) ??
      recipientRegistryEntry?.profileHref ??
      `/alumni/profiles/${memberId}`,
    presence: 'offline',
    roleInThread: normalizeParticipantRole(rawParticipant.role),
  };
}

function getAttachmentKind(value: unknown): MessageAttachment['kind'] {
  if (value === 'audio') return 'audio';
  if (value === 'image') return 'image';
  return 'file';
}

function guessMimeTypeFromAttachmentKind(kind: MessageAttachment['kind']) {
  if (kind === 'audio') return 'audio/mpeg';
  if (kind === 'image') return 'image/jpeg';
  return 'application/octet-stream';
}

function buildAudioWaveform() {
  return [18, 28, 46, 34, 54, 23, 39, 58, 31, 43, 27, 48];
}

function describeAttachmentFallback(kind: MessageAttachment['kind']) {
  if (kind === 'audio') return 'Audio attachment';
  if (kind === 'image') return 'Image attachment';
  return 'File attachment';
}

function extractAttachmentUrl(rawMessage: BackendMessageLike) {
  const attachment =
    rawMessage.attachment ??
    rawMessage.attachment_url ??
    rawMessage.file_url ??
    rawMessage.media_url;

  return typeof attachment === 'string' && attachment.trim() ? attachment : undefined;
}

function isDeletedBackendMessage(rawMessage: BackendMessageLike) {
  return (
    stringToBoolean(rawMessage.is_deleted) === true ||
    stringToBoolean(rawMessage.deleted) === true ||
    typeof rawMessage.deleted_at === 'string'
  );
}

function buildAttachmentsFromBackendMessage(rawMessage: BackendMessageLike): MessageAttachment[] {
  const attachmentUrl = extractAttachmentUrl(rawMessage);
  if (!attachmentUrl) {
    return [];
  }

  const kind = getAttachmentKind(rawMessage.attachment_type);
  const fileName =
    attachmentUrl.split('/').pop()?.split('?')[0] || describeAttachmentFallback(kind);
  const sizeInBytes = safeParseInt(rawMessage.attachment_size ?? rawMessage.size_in_bytes) ?? 0;

  return [
    {
      id: String(
        rawMessage.attachment_id ?? `${rawMessage.id ?? rawMessage.message_id ?? 'attachment'}-0`,
      ),
      kind,
      fileName,
      mimeType:
        (typeof rawMessage.mime_type === 'string' && rawMessage.mime_type) ||
        guessMimeTypeFromAttachmentKind(kind),
      sizeInBytes,
      sizeLabel: formatBytes(sizeInBytes),
      durationSeconds: safeParseInt(rawMessage.duration_seconds),
      uploadState: 'uploaded',
      url: attachmentUrl,
      waveform: kind === 'audio' ? buildAudioWaveform() : undefined,
    },
  ];
}

function buildStagedAttachment(
  request: UploadMessageAttachmentRequest,
): UploadMessageAttachmentResponse['attachment'] {
  const previewUrl =
    request.binary && request.kind !== 'file' ? URL.createObjectURL(request.binary) : undefined;

  return {
    id: createLocalAttachmentId(),
    kind: request.kind,
    fileName: request.fileName,
    mimeType: request.mimeType || guessMimeTypeFromAttachmentKind(request.kind),
    sizeInBytes: request.sizeInBytes,
    sizeLabel: formatBytes(request.sizeInBytes),
    durationSeconds: request.durationSeconds,
    uploadState: 'processing',
    url: previewUrl,
    waveform: request.kind === 'audio' ? buildAudioWaveform() : undefined,
    __backendUploadRequest: request,
  } satisfies StagedBackendAttachment;
}

function getStagedUploadRequest(attachment: MessageAttachment) {
  return (attachment as StagedBackendAttachment).__backendUploadRequest ?? null;
}

function buildSendMultipartPayload(params: {
  threadId?: string;
  recipientId?: string;
  body?: string;
  attachment: MessageAttachment;
}) {
  const uploadRequest = getStagedUploadRequest(params.attachment);

  if (!uploadRequest?.binary) {
    throw new Error('That attachment is no longer available. Please attach it again.');
  }

  const payload = new FormData();

  if (params.threadId) {
    payload.append('group_id', String(normalizeBackendIdentifierValue(params.threadId)));
  }

  if (params.recipientId) {
    payload.append('recipient_id', String(normalizeBackendIdentifierValue(params.recipientId)));
  }

  if (params.body?.trim()) {
    payload.append('message', params.body.trim());
  }

  payload.append('attachment_type', params.attachment.kind);
  payload.append('file', uploadRequest.binary, uploadRequest.fileName);

  return payload;
}

function buildLastMessagePreview(rawLastMessage: BackendMessageLike | null | undefined) {
  if (!rawLastMessage) {
    return 'No messages yet.';
  }

  const messageBody = String(rawLastMessage.message ?? rawLastMessage.body ?? '').trim();
  if (messageBody) {
    return messageBody;
  }

  const attachments = buildAttachmentsFromBackendMessage(rawLastMessage);
  if (attachments.length) {
    return describeAttachmentFallback(attachments[0].kind);
  }

  return 'No messages yet.';
}

function buildThreadSummaryFromBackend(params: {
  rawThread: BackendThreadLike;
  viewerMemberId: string;
}): MessageThreadSummary {
  const type = normalizeThreadType(params.rawThread.type);
  const participants = extractList(params.rawThread.participants, []).map((participant) =>
    buildParticipantFromBackend(participant as BackendThreadParticipant, params.viewerMemberId),
  );
  const currentUser = getCurrentSessionUser();
  const participantsWithViewer =
    currentUser &&
    !participants.some((participant) => participant.memberId === params.viewerMemberId)
      ? [
          {
            memberId: currentUser.memberId,
            slug: currentUser.slug,
            fullName: currentUser.fullName,
            firstName:
              currentUser.otherNames ||
              currentUser.fullName.split(/\s+/)[0] ||
              currentUser.fullName,
            headline: currentUser.graduationYear
              ? `Class of ${currentUser.graduationYear}`
              : 'FGGC alumna',
            location: currentUser.city || 'Nigeria',
            graduationYear: currentUser.graduationYear,
            avatar: currentUser.photo,
            initials: currentUser.avatarInitials,
            profileHref: currentUser.profileHref,
            presence: 'offline',
            roleInThread: 'member',
          },
          ...participants,
        ]
      : participants;
  const otherParticipant =
    participantsWithViewer.find((participant) => participant.memberId !== params.viewerMemberId) ??
    participantsWithViewer[0];
  const title =
    type === 'direct'
      ? otherParticipant?.fullName ||
        String(params.rawThread.name ?? '').trim() ||
        'Direct conversation'
      : String(params.rawThread.name ?? params.rawThread.title ?? '').trim() ||
        'Group conversation';
  const lastMessage = extractObject(params.rawThread.last_message, []) as BackendMessageLike | null;
  const lastMessagePreview = buildLastMessagePreview(lastMessage);

  return {
    id: String(params.rawThread.group_id ?? params.rawThread.id ?? title),
    type,
    category: normalizeThreadCategory(params.rawThread.category),
    title,
    subtitle:
      type === 'direct'
        ? (otherParticipant?.headline ?? 'FGGC alumna')
        : `${participantsWithViewer.length} members`,
    topic:
      String(params.rawThread.description ?? params.rawThread.topic ?? '').trim() ||
      (type === 'direct' ? 'Direct conversation' : title),
    avatar:
      type === 'direct'
        ? otherParticipant?.avatar
        : typeof params.rawThread.cover_image === 'string'
          ? params.rawThread.cover_image
          : undefined,
    initials:
      type === 'direct'
        ? (otherParticipant?.initials ?? deriveInitials(title))
        : deriveInitials(title),
    unreadCount: safeParseInt(params.rawThread.unread_count) ?? 0,
    isPinned: stringToBoolean(params.rawThread.is_pinned) ?? false,
    lastActivityAt: normalizeBackendTimestamp(
      lastMessage?.created_at ?? params.rawThread.updated_at ?? params.rawThread.created_at,
    ),
    lastMessagePreview,
    lastMessageSenderName:
      typeof lastMessage?.sender_name === 'string' && lastMessage.sender_name
        ? lastMessage.sender_name
        : undefined,
    presence: type === 'direct' ? (otherParticipant?.presence ?? 'offline') : undefined,
    memberCount: participantsWithViewer.length,
    participants: participantsWithViewer,
  };
}

function buildMessageItemsFromBackend(params: {
  rawMessages: BackendMessageLike[];
  participants: MessageParticipant[];
  viewerMemberId: string;
  threadId: string;
}) {
  return sortMessagesChronologically(
    params.rawMessages.map((rawMessage) => {
      const senderMemberId = String(
        rawMessage.sender_id ??
          rawMessage.sender_user_id ??
          rawMessage.user_id ??
          rawMessage.member_id ??
          '',
      );
      const sender =
        params.participants.find((participant) => participant.memberId === senderMemberId) ?? null;
      const body = String(rawMessage.message ?? rawMessage.body ?? '').trim();
      const isDeleted = isDeletedBackendMessage(rawMessage);

      return {
        id: String(
          rawMessage.id ?? rawMessage.message_id ?? rawMessage.created_at ?? Math.random(),
        ),
        threadId: params.threadId,
        senderMemberId,
        senderDisplayName: sender?.fullName ?? String(rawMessage.sender_name ?? 'Member'),
        senderAvatar: sender?.avatar,
        body: isDeleted ? '[Message deleted]' : body || '',
        createdAt: normalizeBackendTimestamp(rawMessage.created_at),
        status: senderMemberId === params.viewerMemberId ? 'sent' : 'seen',
        attachments: isDeleted ? [] : buildAttachmentsFromBackendMessage(rawMessage),
        isOwn: senderMemberId === params.viewerMemberId,
      };
    }),
  );
}

async function fetchThreadsEnvelope() {
  const response = await apiClient.post(API_ENDPOINTS.MESSAGES.THREADS, {});
  return getEnvelopeData(response.data);
}

async function fetchThreadDetailEnvelope(threadId: string, limit = 50, offset = 0) {
  const response = await apiClient.post(API_ENDPOINTS.MESSAGES.THREAD_DETAIL, {
    group_id: normalizeBackendIdentifierValue(threadId),
    limit,
    offset,
  });

  return getEnvelopeData(response.data);
}

function buildThreadPayloadForDetail(rawPayload: Record<string, unknown>) {
  const nestedThread =
    (extractObject(rawPayload, ['thread']) as BackendThreadLike | null) ??
    (extractObject(rawPayload, ['group']) as BackendThreadLike | null);
  const messages = extractList(rawPayload, ['messages']).map((message) => message);
  const participants = extractList(rawPayload, ['participants']).map((participant) => participant);

  if (!nestedThread) {
    return {
      ...rawPayload,
      messages,
      participants,
    } as BackendThreadLike;
  }

  return {
    ...rawPayload,
    ...nestedThread,
    messages:
      messages.length > 0
        ? messages
        : extractList(nestedThread, ['messages']).map((message) => message),
    participants:
      participants.length > 0
        ? participants
        : extractList(nestedThread, ['participants']).map((participant) => participant),
  } as BackendThreadLike;
}

function buildThreadDetailFromBackend(params: {
  rawThreadPayload: BackendThreadLike;
  viewerMemberId: string;
}) {
  const summary = buildThreadSummaryFromBackend({
    rawThread: params.rawThreadPayload,
    viewerMemberId: params.viewerMemberId,
  });
  const rawMessages = extractList(params.rawThreadPayload.messages, []).map(
    (message) => message as BackendMessageLike,
  );

  return {
    ...summary,
    unreadCount: 0,
    description:
      typeof params.rawThreadPayload.description === 'string'
        ? params.rawThreadPayload.description
        : undefined,
    attachmentsEnabled: true,
    audioEnabled: true,
    messages: buildMessageItemsFromBackend({
      rawMessages,
      participants: summary.participants,
      viewerMemberId: params.viewerMemberId,
      threadId: summary.id,
    }),
    syncToken: `backend-${nowIso()}`,
    pollingIntervalMs: MESSAGE_POLLING_INTERVAL_MS,
  } satisfies MessageThreadDetail;
}

function isDraftDirectThreadId(threadId: string) {
  return threadId.startsWith(DRAFT_DIRECT_THREAD_PREFIX);
}

function buildDirectDraftThreadId(viewerMemberId: string, participantMemberId: string) {
  return `${DRAFT_DIRECT_THREAD_PREFIX}${encodeURIComponent(viewerMemberId)}__${encodeURIComponent(
    participantMemberId,
  )}`;
}

function parseDirectDraftThreadId(threadId: string) {
  if (!isDraftDirectThreadId(threadId)) {
    return null;
  }

  const encodedParts = threadId.slice(DRAFT_DIRECT_THREAD_PREFIX.length).split('__');
  if (encodedParts.length !== 2) {
    return null;
  }

  return {
    viewerMemberId: decodeURIComponent(encodedParts[0] ?? ''),
    participantMemberId: decodeURIComponent(encodedParts[1] ?? ''),
  };
}

function buildViewerParticipant(viewerMemberId: string) {
  const currentUser = getCurrentSessionUser();

  return buildParticipantFromBackend(
    {
      user_id: viewerMemberId,
      fullname: currentUser?.fullName,
      image: currentUser?.photo,
      role: 'member',
      graduation_year: currentUser?.graduationYear,
    },
    viewerMemberId,
  );
}

function buildDirectDraftThread(params: {
  viewerMemberId: string;
  participantMemberId: string;
  topic?: string;
}) {
  const serverTime = nowIso();
  const recipientEntry = getRegisteredMessageRecipient(params.participantMemberId);
  const viewerParticipant = buildViewerParticipant(params.viewerMemberId);
  const recipientParticipant = buildParticipantFromBackend(
    {
      user_id: params.participantMemberId,
      fullname: recipientEntry?.fullName ?? `Member ${params.participantMemberId}`,
      image: recipientEntry?.avatar,
      graduation_year: recipientEntry?.graduationYear,
      role: 'member',
    },
    params.viewerMemberId,
  );
  const threadId = buildDirectDraftThreadId(params.viewerMemberId, params.participantMemberId);

  const thread: MessageThreadDetail = {
    id: threadId,
    type: 'direct',
    category: 'Community',
    title: recipientParticipant.fullName,
    subtitle: recipientParticipant.headline ?? 'FGGC alumna',
    topic: params.topic?.trim() || 'Direct conversation',
    avatar: recipientParticipant.avatar,
    initials: recipientParticipant.initials,
    unreadCount: 0,
    isPinned: false,
    lastActivityAt: serverTime,
    lastMessagePreview: 'No messages yet.',
    presence: recipientParticipant.presence,
    memberCount: 2,
    participants: [viewerParticipant, recipientParticipant],
    attachmentsEnabled: true,
    audioEnabled: true,
    messages: [],
    syncToken: `draft-${serverTime}`,
    pollingIntervalMs: MESSAGE_POLLING_INTERVAL_MS,
  };

  directDraftThreads.set(threadId, {
    participantMemberId: params.participantMemberId,
    topic: params.topic,
    thread,
  });

  return {
    thread,
    serverTime,
  } satisfies CreateDirectThreadResponse;
}

function getStoredDirectDraftThread(threadId: string) {
  const storedEntry = directDraftThreads.get(threadId);
  if (storedEntry) {
    return storedEntry.thread;
  }

  const parsed = parseDirectDraftThreadId(threadId);
  if (!parsed) {
    return null;
  }

  return buildDirectDraftThread({
    viewerMemberId: parsed.viewerMemberId,
    participantMemberId: parsed.participantMemberId,
  }).thread;
}

function findExistingDirectThreadSummary(
  threads: MessageThreadSummary[],
  participantMemberId: string,
) {
  return (
    threads.find(
      (thread) =>
        thread.type === 'direct' &&
        thread.participants.some((participant) => participant.memberId === participantMemberId),
    ) ?? null
  );
}

async function resolveDirectThreadIdAfterFirstSend(params: {
  viewerMemberId: string;
  participantMemberId: string;
  payload: Record<string, unknown>;
}) {
  const threadPayload = extractObject(params.payload, ['thread']) as BackendThreadLike | null;
  const candidateId = String(
    params.payload.group_id ??
      params.payload.thread_id ??
      params.payload.id ??
      threadPayload?.group_id ??
      threadPayload?.id ??
      '',
  ).trim();

  if (candidateId) {
    return candidateId;
  }

  const threadsResponse = await backendMessagesTransport.listThreads({
    viewerMemberId: params.viewerMemberId,
  });
  const directThread = findExistingDirectThreadSummary(
    threadsResponse.threads,
    params.participantMemberId,
  );

  return directThread?.id ?? '';
}

export const backendMessagesTransport: MessagesTransport = {
  async listThreads(request: ListMessageThreadsRequest): Promise<ListMessageThreadsResponse> {
    const envelope = await fetchThreadsEnvelope();
    const payload = extractObject(envelope, ['data']) ?? envelope ?? {};
    const rawThreads = extractList(payload, ['threads']).map(
      (thread) => thread as BackendThreadLike,
    );
    const threads = sortThreadsForInbox(
      rawThreads.map((rawThread) =>
        buildThreadSummaryFromBackend({
          rawThread,
          viewerMemberId: request.viewerMemberId,
        }),
      ),
    );
    const serverTime = normalizeBackendTimestamp(
      (payload as Record<string, unknown>).server_time ?? envelope?.server_time ?? nowIso(),
    );

    return {
      threads: typeof request.limit === 'number' ? threads.slice(0, request.limit) : threads,
      unreadCount:
        safeParseInt((payload as Record<string, unknown>).unread_count) ??
        threads.reduce((total, thread) => total + thread.unreadCount, 0),
      syncToken: String((payload as Record<string, unknown>).sync_token ?? `backend-${serverTime}`),
      pollingIntervalMs:
        safeParseInt((payload as Record<string, unknown>).polling_interval_ms) ??
        MESSAGE_POLLING_INTERVAL_MS,
      serverTime,
    };
  },

  async getThread(request: GetMessageThreadRequest): Promise<GetMessageThreadResponse> {
    if (isDraftDirectThreadId(request.threadId)) {
      const thread = getStoredDirectDraftThread(request.threadId);

      if (!thread) {
        throw new Error('This direct conversation could not be restored.');
      }

      return {
        thread,
        syncToken: thread.syncToken,
        serverTime: nowIso(),
      };
    }

    const envelope = await fetchThreadDetailEnvelope(request.threadId, request.limit ?? 50, 0);
    const payload = extractObject(envelope, ['data']) ?? envelope ?? {};
    const threadPayload = buildThreadPayloadForDetail(payload);
    const thread = buildThreadDetailFromBackend({
      rawThreadPayload: threadPayload,
      viewerMemberId: request.viewerMemberId,
    });
    const serverTime = normalizeBackendTimestamp(
      (payload as Record<string, unknown>).server_time ?? envelope?.server_time ?? nowIso(),
    );

    return {
      thread,
      syncToken: thread.syncToken,
      serverTime,
    };
  },

  async uploadAttachment(
    request: UploadMessageAttachmentRequest,
  ): Promise<UploadMessageAttachmentResponse> {
    if (!request.binary) {
      throw new Error('Attachment data is missing. Please choose the file again.');
    }

    return {
      attachment: buildStagedAttachment(request),
      serverTime: nowIso(),
    };
  },

  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    const messageBody = request.body?.trim() ?? '';
    const safeAttachments = request.attachments ?? [];

    if (!messageBody && safeAttachments.length === 0) {
      throw new Error('Write a message before sending.');
    }

    if (safeAttachments.length > 1) {
      throw new Error('This backend currently supports one attachment per message.');
    }

    const isDraftDirectThread = isDraftDirectThreadId(request.threadId);
    const draftEntry = isDraftDirectThread ? directDraftThreads.get(request.threadId) : undefined;
    const parsedDraftThread = isDraftDirectThread
      ? parseDirectDraftThreadId(request.threadId)
      : null;
    const participantMemberId =
      draftEntry?.participantMemberId ?? parsedDraftThread?.participantMemberId;

    if (isDraftDirectThread && !participantMemberId) {
      throw new Error('This direct conversation could not be resolved for sending yet.');
    }

    const response = await apiClient.post(
      isDraftDirectThread
        ? API_ENDPOINTS.MESSAGES.DIRECT_THREAD
        : API_ENDPOINTS.MESSAGES.SEND_MESSAGE,
      safeAttachments.length > 0
        ? buildSendMultipartPayload({
            threadId: isDraftDirectThread ? undefined : request.threadId,
            recipientId: isDraftDirectThread ? participantMemberId : undefined,
            body: messageBody,
            attachment: safeAttachments[0],
          })
        : isDraftDirectThread
          ? {
              recipient_id: normalizeBackendIdentifierValue(participantMemberId),
              message: messageBody,
            }
          : {
              group_id: normalizeBackendIdentifierValue(request.threadId),
              message: messageBody,
            },
    );
    const envelope = getEnvelopeData(response.data) ?? {};
    const payload = extractObject(envelope, ['data']) ?? envelope ?? {};
    const returnedThreadId = isDraftDirectThread
      ? await resolveDirectThreadIdAfterFirstSend({
          viewerMemberId: request.viewerMemberId,
          participantMemberId: participantMemberId ?? '',
          payload: payload as Record<string, unknown>,
        })
      : String(
          (payload as Record<string, unknown>).group_id ??
            (payload as Record<string, unknown>).id ??
            request.threadId,
        );

    if (!returnedThreadId) {
      throw new Error('The direct message was sent, but the thread could not be resolved.');
    }

    const threadResponse = await backendMessagesTransport.getThread({
      viewerMemberId: request.viewerMemberId,
      threadId: returnedThreadId,
    });

    if (isDraftDirectThread) {
      directDraftThreads.delete(request.threadId);
    }

    return {
      thread: threadResponse.thread,
      messageId: String((payload as Record<string, unknown>).message_id ?? nowIso()),
      serverTime: threadResponse.serverTime,
    };
  },

  async markThreadRead(
    request: MarkMessageThreadReadRequest,
  ): Promise<MarkMessageThreadReadResponse> {
    if (isDraftDirectThreadId(request.threadId)) {
      return {
        threadId: request.threadId,
        unreadCount: 0,
        serverTime: nowIso(),
      };
    }

    const response = await apiClient.post(API_ENDPOINTS.MESSAGES.MARK_READ, {
      group_id: normalizeBackendIdentifierValue(request.threadId),
    });
    const envelope = getEnvelopeData(response.data) ?? {};
    const payload = extractObject(envelope, ['data']) ?? envelope ?? {};
    const serverTime = normalizeBackendTimestamp(
      (payload as Record<string, unknown>).server_time ?? envelope?.server_time ?? nowIso(),
    );

    return {
      threadId: request.threadId,
      unreadCount: 0,
      serverTime,
    };
  },

  async createDirectThread(
    request: CreateDirectThreadRequest,
  ): Promise<CreateDirectThreadResponse> {
    const threadsResponse = await backendMessagesTransport.listThreads({
      viewerMemberId: request.viewerMemberId,
    });
    const existingThread = findExistingDirectThreadSummary(
      threadsResponse.threads,
      request.participantMemberId,
    );

    if (existingThread) {
      const threadResponse = await backendMessagesTransport.getThread({
        viewerMemberId: request.viewerMemberId,
        threadId: existingThread.id,
      });

      return {
        thread: threadResponse.thread,
        serverTime: threadResponse.serverTime,
      };
    }

    return buildDirectDraftThread(request);
  },

  async createGroupThread(request: CreateGroupThreadRequest): Promise<CreateGroupThreadResponse> {
    return placeholderMessagesTransport.createGroupThread(request);
  },
};
