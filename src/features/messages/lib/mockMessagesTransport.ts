import { getAlumnusByMemberId } from '@/data/site-data';
import { defaultMockAccounts } from '@/features/authentication/constants/mockAccounts';
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
import {
  describeAttachmentForPreview,
  formatBytes,
  sortMessageThreads,
} from '../api/adapters/messages.adapter';
import {
  getRegisteredMessageRecipient,
  resetRegisteredMessageRecipients,
} from './messageRecipientRegistry';
import { resetMessageAttachmentPreviews } from './messageAttachmentPreviewRegistry';
import type {
  MessageAttachment,
  MessageDeliveryStatus,
  MessageParticipant,
  MessagePresence,
  MessageThreadCategory,
  MessageThreadDetail,
  MessageThreadSummary,
  MessageThreadType,
} from '../types/messages.types';

const STORAGE_KEY = 'openalumns.messages.mockServer.v1';

type MockMessageRecord = {
  id: string;
  threadId: string;
  senderMemberId: string;
  body: string;
  createdAt: string;
  status: MessageDeliveryStatus;
  attachments: MessageAttachment[];
};

type MockThreadRecord = {
  id: string;
  type: MessageThreadType;
  category: MessageThreadCategory;
  title?: string;
  description?: string;
  topic: string;
  participantIds: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  pinnedBy: string[];
  attachmentsEnabled: boolean;
  audioEnabled: boolean;
  lastReadAtByMemberId: Record<string, string>;
  messages: MockMessageRecord[];
};

type MockMessagesServerState = {
  threads: MockThreadRecord[];
  nextThreadId: number;
  nextMessageId: number;
  nextAttachmentId: number;
  syncVersion: number;
  lastSimulationAt: string;
};

function canUseStorage() {
  return typeof window !== 'undefined';
}

function nowIso() {
  return new Date().toISOString();
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function randomDelay() {
  return 180 + Math.floor(Math.random() * 220);
}

function createMockApiError(status: number, message: string) {
  return {
    message,
    response: {
      status,
      data: { message },
    },
  };
}

function getMemberIdBySlug(slug: string) {
  const account = defaultMockAccounts.find((item) => item.slug === slug);
  if (!account) {
    throw new Error(`Missing mock member for slug "${slug}"`);
  }
  return account.memberId;
}

const PRIMARY_MEMBER_IDS = {
  adaeze: getMemberIdBySlug('adaeze-okonkwo'),
  ngozi: getMemberIdBySlug('ngozi-ibrahim'),
  chidinma: getMemberIdBySlug('chidinma-eze'),
  precious: getMemberIdBySlug('precious-ojeka'),
} as const;

const PRESENCE_BY_MEMBER_ID: Record<string, MessagePresence> = {
  [PRIMARY_MEMBER_IDS.adaeze]: 'online',
  [PRIMARY_MEMBER_IDS.ngozi]: 'away',
  [PRIMARY_MEMBER_IDS.chidinma]: 'online',
  [PRIMARY_MEMBER_IDS.precious]: 'offline',
};

const AUTO_REPLY_LIBRARY: Record<MessageThreadCategory, string[]> = {
  Mentorship: [
    'That sounds good to me. Send two time options and I will confirm one.',
    'Perfect. I can make space for that conversation this week.',
    'I like that direction. Let us keep the first session practical and focused.',
  ],
  Events: [
    'Thanks for the update. I reviewed the note and I am comfortable with that plan.',
    'That works. I will share feedback from the planning side shortly.',
    'I am aligned. Let me know if you want me to loop in one more alumna on this.',
  ],
  Marketplace: [
    'Looks strong. Send the brief and I can help move the introduction forward.',
    'Yes, that should work. I can review it properly once the file comes through.',
    'Great. I can help make the handoff feel smooth from my side.',
  ],
  Community: [
    'This is helpful. I will share it with the rest of the group as well.',
    'I am happy with that. Let us keep the tone warm and straightforward.',
    'That makes sense. I think the wider community will respond well to it.',
  ],
};

function getInitials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function buildWaveform(durationSeconds = 24) {
  const base = [18, 28, 46, 34, 54, 23, 39, 58, 31, 43, 27, 48];
  return base.map((value, index) => ((value + durationSeconds + index * 3) % 60) + 12);
}

function createAttachment(params: {
  id: string;
  kind: MessageAttachment['kind'];
  fileName: string;
  mimeType: string;
  sizeInBytes: number;
  durationSeconds?: number;
}): MessageAttachment {
  return {
    id: params.id,
    kind: params.kind,
    fileName: params.fileName,
    mimeType: params.mimeType,
    sizeInBytes: params.sizeInBytes,
    sizeLabel: formatBytes(params.sizeInBytes),
    durationSeconds: params.durationSeconds,
    uploadState: 'uploaded',
    waveform: params.kind === 'audio' ? buildWaveform(params.durationSeconds) : undefined,
  };
}

function createMessageRecord(params: {
  id: string;
  threadId: string;
  senderMemberId: string;
  body: string;
  createdAt: string;
  status?: MessageDeliveryStatus;
  attachments?: MessageAttachment[];
}): MockMessageRecord {
  return {
    id: params.id,
    threadId: params.threadId,
    senderMemberId: params.senderMemberId,
    body: params.body,
    createdAt: params.createdAt,
    status: params.status ?? 'seen',
    attachments: params.attachments ?? [],
  };
}

function createDefaultState(): MockMessagesServerState {
  const mentorAudio = createAttachment({
    id: 'attachment-1',
    kind: 'audio',
    fileName: 'mentor-check-in.m4a',
    mimeType: 'audio/mp4',
    sizeInBytes: 420_000,
    durationSeconds: 27,
  });

  const workshopBrief = createAttachment({
    id: 'attachment-2',
    kind: 'file',
    fileName: 'workshop-outline.pdf',
    mimeType: 'application/pdf',
    sizeInBytes: 248_000,
  });

  const reunionNotes = createAttachment({
    id: 'attachment-3',
    kind: 'file',
    fileName: 'speaker-shortlist.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    sizeInBytes: 184_000,
  });

  return {
    nextThreadId: 5,
    nextMessageId: 15,
    nextAttachmentId: 4,
    syncVersion: 1,
    lastSimulationAt: '2026-03-31T08:00:00.000Z',
    threads: [
      {
        id: 'thread-1',
        type: 'direct',
        category: 'Mentorship',
        topic: 'Mentorship circle launch',
        participantIds: [PRIMARY_MEMBER_IDS.adaeze, PRIMARY_MEMBER_IDS.ngozi],
        createdBy: PRIMARY_MEMBER_IDS.adaeze,
        createdAt: '2026-03-29T07:00:00.000Z',
        updatedAt: '2026-03-31T08:12:00.000Z',
        pinnedBy: [PRIMARY_MEMBER_IDS.adaeze, PRIMARY_MEMBER_IDS.ngozi],
        attachmentsEnabled: true,
        audioEnabled: true,
        lastReadAtByMemberId: {
          [PRIMARY_MEMBER_IDS.adaeze]: '2026-03-31T08:12:00.000Z',
          [PRIMARY_MEMBER_IDS.ngozi]: '2026-03-31T07:56:00.000Z',
        },
        messages: [
          createMessageRecord({
            id: 'message-1',
            threadId: 'thread-1',
            senderMemberId: PRIMARY_MEMBER_IDS.adaeze,
            body: 'Hi Ngozi, I enjoyed meeting you at the alumni mixer. I would love to stay in touch and support your next career move.',
            createdAt: '2026-03-29T07:12:00.000Z',
          }),
          createMessageRecord({
            id: 'message-2',
            threadId: 'thread-1',
            senderMemberId: PRIMARY_MEMBER_IDS.ngozi,
            body: 'Thank you. I would really value a short mentoring rhythm around leadership and career clarity.',
            createdAt: '2026-03-29T07:23:00.000Z',
          }),
          createMessageRecord({
            id: 'message-3',
            threadId: 'thread-1',
            senderMemberId: PRIMARY_MEMBER_IDS.adaeze,
            body: 'Absolutely. I recorded a quick note here with the structure I normally use.',
            createdAt: '2026-03-31T08:12:00.000Z',
            status: 'delivered',
            attachments: [mentorAudio],
          }),
        ],
      },
      {
        id: 'thread-2',
        type: 'direct',
        category: 'Marketplace',
        topic: 'Tech talent introduction',
        participantIds: [PRIMARY_MEMBER_IDS.adaeze, PRIMARY_MEMBER_IDS.chidinma],
        createdBy: PRIMARY_MEMBER_IDS.chidinma,
        createdAt: '2026-03-27T10:00:00.000Z',
        updatedAt: '2026-03-31T07:56:00.000Z',
        pinnedBy: [PRIMARY_MEMBER_IDS.chidinma],
        attachmentsEnabled: true,
        audioEnabled: true,
        lastReadAtByMemberId: {
          [PRIMARY_MEMBER_IDS.adaeze]: '2026-03-31T07:56:00.000Z',
          [PRIMARY_MEMBER_IDS.chidinma]: '2026-03-31T07:56:00.000Z',
        },
        messages: [
          createMessageRecord({
            id: 'message-4',
            threadId: 'thread-2',
            senderMemberId: PRIMARY_MEMBER_IDS.chidinma,
            body: 'A fellow alumna needs help refreshing her organisation website and asked if I know anyone reliable.',
            createdAt: '2026-03-30T09:09:00.000Z',
          }),
          createMessageRecord({
            id: 'message-5',
            threadId: 'thread-2',
            senderMemberId: PRIMARY_MEMBER_IDS.adaeze,
            body: 'You can connect us. I have added the draft workshop outline here too.',
            createdAt: '2026-03-31T07:56:00.000Z',
            status: 'sent',
            attachments: [workshopBrief],
          }),
        ],
      },
      {
        id: 'thread-3',
        type: 'group',
        category: 'Community',
        title: 'Lagos Chapter Mentors',
        description:
          'A warm planning space for alumnae leading mentoring, volunteer onboarding, and community follow-up.',
        topic: 'Volunteer onboarding flow',
        participantIds: [
          PRIMARY_MEMBER_IDS.adaeze,
          PRIMARY_MEMBER_IDS.ngozi,
          PRIMARY_MEMBER_IDS.chidinma,
        ],
        createdBy: PRIMARY_MEMBER_IDS.adaeze,
        createdAt: '2026-03-26T08:00:00.000Z',
        updatedAt: '2026-03-30T11:14:00.000Z',
        pinnedBy: [PRIMARY_MEMBER_IDS.adaeze],
        attachmentsEnabled: true,
        audioEnabled: true,
        lastReadAtByMemberId: {
          [PRIMARY_MEMBER_IDS.adaeze]: '2026-03-30T11:14:00.000Z',
          [PRIMARY_MEMBER_IDS.ngozi]: '2026-03-29T14:00:00.000Z',
          [PRIMARY_MEMBER_IDS.chidinma]: '2026-03-29T14:00:00.000Z',
        },
        messages: [
          createMessageRecord({
            id: 'message-6',
            threadId: 'thread-3',
            senderMemberId: PRIMARY_MEMBER_IDS.adaeze,
            body: 'Sharing the volunteer onboarding checklist here. I want us to tighten the first-week touchpoints.',
            createdAt: '2026-03-29T13:01:00.000Z',
          }),
          createMessageRecord({
            id: 'message-7',
            threadId: 'thread-3',
            senderMemberId: PRIMARY_MEMBER_IDS.chidinma,
            body: 'I like the warmth of it already. We could add one lighter personal touch on day three.',
            createdAt: '2026-03-29T13:17:00.000Z',
          }),
          createMessageRecord({
            id: 'message-8',
            threadId: 'thread-3',
            senderMemberId: PRIMARY_MEMBER_IDS.ngozi,
            body: 'That is exactly the part I was worried about. I can draft a gentler follow-up message today.',
            createdAt: '2026-03-30T11:14:00.000Z',
            status: 'delivered',
          }),
        ],
      },
      {
        id: 'thread-4',
        type: 'group',
        category: 'Events',
        title: 'Reunion Planning Circle',
        description:
          'Core planning room for the next annual reunion programme and speaker coordination.',
        topic: 'Reunion speaker shortlist',
        participantIds: [
          PRIMARY_MEMBER_IDS.adaeze,
          PRIMARY_MEMBER_IDS.ngozi,
          PRIMARY_MEMBER_IDS.chidinma,
          PRIMARY_MEMBER_IDS.precious,
        ],
        createdBy: PRIMARY_MEMBER_IDS.precious,
        createdAt: '2026-03-28T15:00:00.000Z',
        updatedAt: '2026-03-30T18:42:00.000Z',
        pinnedBy: [PRIMARY_MEMBER_IDS.ngozi, PRIMARY_MEMBER_IDS.precious],
        attachmentsEnabled: true,
        audioEnabled: true,
        lastReadAtByMemberId: {
          [PRIMARY_MEMBER_IDS.adaeze]: '2026-03-30T18:42:00.000Z',
          [PRIMARY_MEMBER_IDS.ngozi]: '2026-03-30T16:00:00.000Z',
          [PRIMARY_MEMBER_IDS.chidinma]: '2026-03-30T18:42:00.000Z',
          [PRIMARY_MEMBER_IDS.precious]: '2026-03-30T18:42:00.000Z',
        },
        messages: [
          createMessageRecord({
            id: 'message-9',
            threadId: 'thread-4',
            senderMemberId: PRIMARY_MEMBER_IDS.precious,
            body: 'Can everyone look over the updated reunion speaker shortlist before tomorrow afternoon?',
            createdAt: '2026-03-28T15:10:00.000Z',
          }),
          createMessageRecord({
            id: 'message-10',
            threadId: 'thread-4',
            senderMemberId: PRIMARY_MEMBER_IDS.ngozi,
            body: 'Absolutely. I will review it tonight and flag the names that feel strongest for a cross-set audience.',
            createdAt: '2026-03-28T15:28:00.000Z',
          }),
          createMessageRecord({
            id: 'message-11',
            threadId: 'thread-4',
            senderMemberId: PRIMARY_MEMBER_IDS.precious,
            body: 'Perfect. I added one more candidate who has done great work with youth leadership in Abuja.',
            createdAt: '2026-03-30T18:42:00.000Z',
            status: 'delivered',
            attachments: [reunionNotes],
          }),
        ],
      },
    ],
  };
}

function readState() {
  if (!canUseStorage()) return createDefaultState();

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initialState = createDefaultState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    return initialState;
  }

  try {
    const parsed = JSON.parse(raw) as MockMessagesServerState;
    if (!Array.isArray(parsed.threads)) throw new Error('Invalid messages state');
    return parsed;
  } catch {
    const initialState = createDefaultState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    return initialState;
  }
}

function writeState(state: MockMessagesServerState) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetMockMessagesServerState() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(STORAGE_KEY);
  resetRegisteredMessageRecipients();
  resetMessageAttachmentPreviews();
}

function resolveParticipant(memberId: string): MessageParticipant {
  const alumnus = getAlumnusByMemberId(memberId);
  const account = defaultMockAccounts.find((item) => item.memberId === memberId);
  const registeredRecipient = getRegisteredMessageRecipient(memberId);

  const fullName =
    alumnus?.name ||
    [account?.otherNames, account?.surname].filter(Boolean).join(' ') ||
    registeredRecipient?.fullName ||
    'Member';
  const headline =
    alumnus?.position && alumnus.company
      ? `${alumnus.position} at ${alumnus.company}`
      : registeredRecipient?.headline
        ? registeredRecipient.headline
        : account?.occupations?.[0]
          ? account.occupations[0]
          : 'FGGC alumna';
  const location =
    alumnus?.location ||
    [account?.city, 'Nigeria'].filter(Boolean).join(', ') ||
    registeredRecipient?.location ||
    'Nigeria';

  return {
    memberId,
    slug: alumnus?.slug ?? account?.slug ?? registeredRecipient?.slug ?? memberId,
    fullName,
    firstName: fullName.split(/\s+/)[0] ?? fullName,
    headline,
    location,
    graduationYear:
      alumnus?.year ??
      account?.graduationYear ??
      registeredRecipient?.graduationYear ??
      new Date().getFullYear(),
    avatar: alumnus?.photo ?? account?.photo ?? registeredRecipient?.avatar,
    initials: getInitials(fullName),
    profileHref:
      registeredRecipient?.profileHref ??
      (alumnus?.slug ? `/alumni/profiles/${alumnus.slug}` : '/alumni/profiles'),
    presence: PRESENCE_BY_MEMBER_ID[memberId] ?? 'offline',
    roleInThread: account?.role === 'admin' ? 'admin' : 'member',
  };
}

function getLastMessage(thread: MockThreadRecord) {
  return thread.messages[thread.messages.length - 1] ?? null;
}

function createPreviewText(message: MockMessageRecord | null) {
  if (!message) return 'No messages yet.';
  if (message.body) {
    if (message.attachments.length === 0) return message.body;
    return `${message.body} • ${message.attachments.map(describeAttachmentForPreview).join(', ')}`;
  }
  if (message.attachments.length > 0) {
    return message.attachments.map(describeAttachmentForPreview).join(', ');
  }
  return 'Sent a message';
}

function computeUnreadCount(thread: MockThreadRecord, viewerMemberId: string) {
  const lastReadAt = thread.lastReadAtByMemberId[viewerMemberId] ?? '';

  return thread.messages.filter(
    (message) => message.senderMemberId !== viewerMemberId && message.createdAt > lastReadAt,
  ).length;
}

function toThreadSummary(thread: MockThreadRecord, viewerMemberId: string): MessageThreadSummary {
  const participants = thread.participantIds.map(resolveParticipant);
  const lastMessage = getLastMessage(thread);
  const unreadCount = computeUnreadCount(thread, viewerMemberId);

  if (thread.type === 'direct') {
    const otherParticipant =
      participants.find((participant) => participant.memberId !== viewerMemberId) ??
      participants[0];

    return {
      id: thread.id,
      type: thread.type,
      category: thread.category,
      title: otherParticipant.fullName,
      subtitle: otherParticipant.headline,
      topic: thread.topic,
      avatar: otherParticipant.avatar,
      initials: otherParticipant.initials,
      unreadCount,
      isPinned: thread.pinnedBy.includes(viewerMemberId),
      lastActivityAt: thread.updatedAt,
      lastMessagePreview: createPreviewText(lastMessage),
      lastMessageSenderName: lastMessage
        ? resolveParticipant(lastMessage.senderMemberId).firstName
        : undefined,
      presence: otherParticipant.presence,
      memberCount: participants.length,
      participants,
    };
  }

  return {
    id: thread.id,
    type: thread.type,
    category: thread.category,
    title: thread.title ?? 'Group conversation',
    subtitle: `${participants.length} members`,
    topic: thread.topic,
    initials: getInitials(thread.title ?? 'Group conversation'),
    unreadCount,
    isPinned: thread.pinnedBy.includes(viewerMemberId),
    lastActivityAt: thread.updatedAt,
    lastMessagePreview: createPreviewText(lastMessage),
    lastMessageSenderName: lastMessage
      ? resolveParticipant(lastMessage.senderMemberId).firstName
      : undefined,
    memberCount: participants.length,
    participants,
  };
}

function toThreadDetail(
  thread: MockThreadRecord,
  viewerMemberId: string,
  syncVersion: number,
): MessageThreadDetail {
  const summary = toThreadSummary(thread, viewerMemberId);

  return {
    ...summary,
    description: thread.description,
    attachmentsEnabled: thread.attachmentsEnabled,
    audioEnabled: thread.audioEnabled,
    messages: thread.messages.map((message) => {
      const sender = resolveParticipant(message.senderMemberId);

      return {
        id: message.id,
        threadId: thread.id,
        senderMemberId: message.senderMemberId,
        senderDisplayName: sender.fullName,
        senderAvatar: sender.avatar,
        body: message.body,
        createdAt: message.createdAt,
        status: message.status,
        attachments: message.attachments,
        isOwn: message.senderMemberId === viewerMemberId,
      };
    }),
    syncToken: `messages-${syncVersion}`,
    pollingIntervalMs: MESSAGE_POLLING_INTERVAL_MS,
  };
}

function appendMessageToThread(
  state: MockMessagesServerState,
  thread: MockThreadRecord,
  params: {
    senderMemberId: string;
    body: string;
    attachments?: MessageAttachment[];
    status?: MessageDeliveryStatus;
    createdAt?: string;
  },
) {
  const createdAt = params.createdAt ?? nowIso();

  thread.messages.push({
    id: `message-${state.nextMessageId++}`,
    threadId: thread.id,
    senderMemberId: params.senderMemberId,
    body: params.body,
    createdAt,
    status: params.status ?? 'sent',
    attachments: params.attachments ?? [],
  });

  thread.updatedAt = createdAt;
  thread.lastReadAtByMemberId[params.senderMemberId] = createdAt;
}

function progressDeliveryStatuses(thread: MockThreadRecord) {
  let changed = false;
  const now = Date.now();

  thread.messages.forEach((message) => {
    const age = now - Date.parse(message.createdAt);

    if (message.status === 'sent' && age > 3_000) {
      message.status = 'delivered';
      changed = true;
    }

    if (message.status === 'delivered' && age > 12_000) {
      message.status = 'seen';
      changed = true;
    }
  });

  return changed;
}

function maybeAppendAutoReply(
  state: MockMessagesServerState,
  thread: MockThreadRecord,
  viewerMemberId: string,
) {
  const lastMessage = getLastMessage(thread);
  if (!lastMessage) return false;
  if (lastMessage.senderMemberId !== viewerMemberId) return false;

  const repliedAlready = thread.messages.some(
    (message) =>
      message.senderMemberId !== viewerMemberId && message.createdAt > lastMessage.createdAt,
  );
  if (repliedAlready) return false;

  const age = Date.now() - Date.parse(lastMessage.createdAt);
  if (age < 7_000) return false;

  const responderIds = thread.participantIds.filter((memberId) => memberId !== viewerMemberId);
  const responderId = responderIds[thread.messages.length % responderIds.length] ?? responderIds[0];
  if (!responderId) return false;

  const library = AUTO_REPLY_LIBRARY[thread.category];
  const body = library[(thread.messages.length + state.syncVersion) % library.length];

  appendMessageToThread(state, thread, {
    senderMemberId: responderId,
    body,
    status: 'delivered',
  });

  return true;
}

function maybeAppendBackgroundActivity(state: MockMessagesServerState, viewerMemberId: string) {
  const elapsed = Date.now() - Date.parse(state.lastSimulationAt);
  if (elapsed < 45_000) return false;

  const targetThread = state.threads.find((thread) => {
    if (!thread.participantIds.includes(viewerMemberId)) return false;
    const lastMessage = getLastMessage(thread);
    return !!lastMessage && lastMessage.senderMemberId !== viewerMemberId;
  });

  if (!targetThread) return false;

  const responderIds = targetThread.participantIds.filter(
    (memberId) => memberId !== viewerMemberId,
  );
  const responderId = responderIds[0];
  if (!responderId) return false;

  const library = AUTO_REPLY_LIBRARY[targetThread.category];
  const body = library[(state.syncVersion + targetThread.messages.length) % library.length];

  appendMessageToThread(state, targetThread, {
    senderMemberId: responderId,
    body,
    status: 'delivered',
  });
  state.lastSimulationAt = nowIso();

  return true;
}

function ensureViewerCoverage(state: MockMessagesServerState, viewerMemberId: string) {
  const viewerHasThread = state.threads.some((thread) =>
    thread.participantIds.includes(viewerMemberId),
  );
  if (viewerHasThread) return false;

  const bridgeMemberId =
    viewerMemberId === PRIMARY_MEMBER_IDS.adaeze
      ? PRIMARY_MEMBER_IDS.ngozi
      : PRIMARY_MEMBER_IDS.adaeze;

  const directThreadId = `thread-${state.nextThreadId++}`;
  const groupThreadId = `thread-${state.nextThreadId++}`;
  const createdAt = nowIso();

  state.threads.push({
    id: directThreadId,
    type: 'direct',
    category: 'Community',
    topic: 'Getting connected',
    participantIds: [viewerMemberId, bridgeMemberId],
    createdBy: bridgeMemberId,
    createdAt,
    updatedAt: createdAt,
    pinnedBy: [viewerMemberId],
    attachmentsEnabled: true,
    audioEnabled: true,
    lastReadAtByMemberId: {
      [viewerMemberId]: createdAt,
      [bridgeMemberId]: createdAt,
    },
    messages: [
      createMessageRecord({
        id: `message-${state.nextMessageId++}`,
        threadId: directThreadId,
        senderMemberId: bridgeMemberId,
        body: 'Welcome in. I wanted to make sure you had at least one warm thread waiting here.',
        createdAt,
      }),
    ],
  });

  state.threads.push({
    id: groupThreadId,
    type: 'group',
    category: 'Community',
    title: 'Community Check-ins',
    description: 'Starter group for lightweight alumni check-ins and quick handoffs.',
    topic: 'Introductions and warm follow-up',
    participantIds: [viewerMemberId, bridgeMemberId, PRIMARY_MEMBER_IDS.ngozi],
    createdBy: bridgeMemberId,
    createdAt,
    updatedAt: createdAt,
    pinnedBy: [],
    attachmentsEnabled: true,
    audioEnabled: true,
    lastReadAtByMemberId: {
      [viewerMemberId]: createdAt,
      [bridgeMemberId]: createdAt,
      [PRIMARY_MEMBER_IDS.ngozi]: createdAt,
    },
    messages: [
      createMessageRecord({
        id: `message-${state.nextMessageId++}`,
        threadId: groupThreadId,
        senderMemberId: bridgeMemberId,
        body: 'Adding you here so the chapter team can keep conversations warm while the full messaging backend is still on the way.',
        createdAt,
      }),
    ],
  });

  return true;
}

function withViewerState(viewerMemberId: string) {
  const state = readState();
  let changed = ensureViewerCoverage(state, viewerMemberId);

  state.threads.forEach((thread) => {
    if (!thread.participantIds.includes(viewerMemberId)) return;
    if (progressDeliveryStatuses(thread)) changed = true;
    if (maybeAppendAutoReply(state, thread, viewerMemberId)) {
      changed = true;
      state.lastSimulationAt = nowIso();
    }
  });

  if (maybeAppendBackgroundActivity(state, viewerMemberId)) {
    changed = true;
  }

  if (changed) {
    state.syncVersion += 1;
    writeState(state);
  }

  return state;
}

function ensureThreadAccess(
  state: MockMessagesServerState,
  threadId: string,
  viewerMemberId: string,
) {
  const thread = state.threads.find((item) => item.id === threadId);
  if (!thread) {
    throw createMockApiError(404, 'Conversation not found');
  }
  if (!thread.participantIds.includes(viewerMemberId)) {
    throw createMockApiError(403, 'You do not have access to this conversation');
  }
  return thread;
}

export const mockMessagesTransport: MessagesTransport = {
  async listThreads(request: ListMessageThreadsRequest): Promise<ListMessageThreadsResponse> {
    await sleep(randomDelay());

    if (!request.viewerMemberId) {
      throw createMockApiError(401, 'You must be logged in to view messages');
    }

    const state = withViewerState(request.viewerMemberId);
    const threads = sortMessageThreads(
      state.threads
        .filter((thread) => thread.participantIds.includes(request.viewerMemberId))
        .map((thread) => toThreadSummary(thread, request.viewerMemberId)),
    );

    const unreadCount = threads.reduce((total, thread) => total + thread.unreadCount, 0);

    return {
      threads: request.limit ? threads.slice(0, request.limit) : threads,
      unreadCount,
      syncToken: `messages-${state.syncVersion}`,
      pollingIntervalMs: MESSAGE_POLLING_INTERVAL_MS,
      serverTime: nowIso(),
    };
  },

  async getThread(request: GetMessageThreadRequest): Promise<GetMessageThreadResponse> {
    await sleep(randomDelay());

    if (!request.viewerMemberId) {
      throw createMockApiError(401, 'You must be logged in to view messages');
    }

    const state = withViewerState(request.viewerMemberId);
    const thread = ensureThreadAccess(state, request.threadId, request.viewerMemberId);

    return {
      thread: toThreadDetail(thread, request.viewerMemberId, state.syncVersion),
      syncToken: `messages-${state.syncVersion}`,
      serverTime: nowIso(),
    };
  },

  async uploadAttachment(
    request: UploadMessageAttachmentRequest,
  ): Promise<UploadMessageAttachmentResponse> {
    await sleep(randomDelay());

    const state = readState();
    const attachment = createAttachment({
      id: `attachment-${state.nextAttachmentId++}`,
      kind: request.kind,
      fileName: request.fileName,
      mimeType: request.mimeType,
      sizeInBytes: request.sizeInBytes,
      durationSeconds: request.durationSeconds,
    });

    state.syncVersion += 1;
    writeState(state);

    return {
      attachment,
      serverTime: nowIso(),
    };
  },

  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    await sleep(randomDelay());

    if (!request.viewerMemberId) {
      throw createMockApiError(401, 'You must be logged in to send messages');
    }

    if (!request.body && (!request.attachments || request.attachments.length === 0)) {
      throw createMockApiError(422, 'Write a message or attach a file before sending');
    }

    const state = readState();
    const thread = ensureThreadAccess(state, request.threadId, request.viewerMemberId);

    appendMessageToThread(state, thread, {
      senderMemberId: request.viewerMemberId,
      body: request.body ?? '',
      attachments: request.attachments ?? [],
      status: 'sent',
    });

    state.syncVersion += 1;
    writeState(state);

    const latestMessage = getLastMessage(thread);

    return {
      thread: toThreadDetail(thread, request.viewerMemberId, state.syncVersion),
      messageId: latestMessage?.id ?? request.clientGeneratedId,
      serverTime: nowIso(),
    };
  },

  async markThreadRead(
    request: MarkMessageThreadReadRequest,
  ): Promise<MarkMessageThreadReadResponse> {
    await sleep(randomDelay());

    const state = readState();
    const thread = ensureThreadAccess(state, request.threadId, request.viewerMemberId);
    const lastMessage = getLastMessage(thread);

    thread.lastReadAtByMemberId[request.viewerMemberId] = lastMessage?.createdAt ?? nowIso();
    state.syncVersion += 1;
    writeState(state);

    return {
      threadId: request.threadId,
      unreadCount: 0,
      serverTime: nowIso(),
    };
  },

  async createDirectThread(
    request: CreateDirectThreadRequest,
  ): Promise<CreateDirectThreadResponse> {
    await sleep(randomDelay());

    const state = readState();
    const existing = state.threads.find(
      (thread) =>
        thread.type === 'direct' &&
        thread.participantIds.length === 2 &&
        thread.participantIds.includes(request.viewerMemberId) &&
        thread.participantIds.includes(request.participantMemberId),
    );

    if (existing) {
      return {
        thread: toThreadDetail(existing, request.viewerMemberId, state.syncVersion),
        serverTime: nowIso(),
      };
    }

    const threadId = `thread-${state.nextThreadId++}`;
    const createdAt = nowIso();

    const nextThread: MockThreadRecord = {
      id: threadId,
      type: 'direct',
      category: 'Community',
      topic: request.topic ?? 'New direct conversation',
      participantIds: [request.viewerMemberId, request.participantMemberId],
      createdBy: request.viewerMemberId,
      createdAt,
      updatedAt: createdAt,
      pinnedBy: [],
      attachmentsEnabled: true,
      audioEnabled: true,
      lastReadAtByMemberId: {
        [request.viewerMemberId]: createdAt,
        [request.participantMemberId]: createdAt,
      },
      messages: [],
    };

    state.threads.push(nextThread);
    state.syncVersion += 1;
    writeState(state);

    return {
      thread: toThreadDetail(nextThread, request.viewerMemberId, state.syncVersion),
      serverTime: nowIso(),
    };
  },

  async createGroupThread(request: CreateGroupThreadRequest): Promise<CreateGroupThreadResponse> {
    await sleep(randomDelay());

    const state = readState();
    const threadId = `thread-${state.nextThreadId++}`;
    const createdAt = nowIso();
    const participantIds = Array.from(new Set([request.viewerMemberId, ...request.memberIds]));

    const nextThread: MockThreadRecord = {
      id: threadId,
      type: 'group',
      category: request.category ?? 'Community',
      title: request.title,
      description: request.description,
      topic: request.topic ?? 'New group conversation',
      participantIds,
      createdBy: request.viewerMemberId,
      createdAt,
      updatedAt: createdAt,
      pinnedBy: [],
      attachmentsEnabled: true,
      audioEnabled: true,
      lastReadAtByMemberId: participantIds.reduce<Record<string, string>>(
        (accumulator, memberId) => {
          accumulator[memberId] = createdAt;
          return accumulator;
        },
        {},
      ),
      messages: [],
    };

    state.threads.push(nextThread);
    state.syncVersion += 1;
    writeState(state);

    return {
      thread: toThreadDetail(nextThread, request.viewerMemberId, state.syncVersion),
      serverTime: nowIso(),
    };
  },
};
