export type MessagePresence = 'online' | 'away' | 'offline';

export type MessageThreadType = 'direct' | 'group';

export type MessageThreadCategory = 'Mentorship' | 'Events' | 'Marketplace' | 'Community';

export type MessageThreadFilter = 'all' | 'unread' | 'pinned';

export type MessageAttachmentKind = 'file' | 'image' | 'audio';

export type MessageDeliveryStatus = 'sending' | 'sent' | 'delivered' | 'seen' | 'failed';

export type MessageParticipantRoleInThread = 'member' | 'moderator' | 'admin';

export interface MessageParticipant {
  memberId: string;
  slug: string;
  fullName: string;
  firstName: string;
  headline: string;
  location: string;
  graduationYear: number;
  avatar?: string;
  initials: string;
  profileHref: string;
  presence: MessagePresence;
  roleInThread: MessageParticipantRoleInThread;
  lastReadMessageId?: string;
  lastDeliveredMessageId?: string;
}

export interface MessageAttachment {
  id: string;
  kind: MessageAttachmentKind;
  fileName: string;
  mimeType: string;
  sizeInBytes: number;
  sizeLabel: string;
  durationSeconds?: number;
  uploadState: 'uploaded' | 'processing';
  url?: string;
  waveform?: number[];
}

export interface MessageReplyPreview {
  messageId: string;
  senderMemberId: string;
  senderDisplayName: string;
  bodyPreview: string;
  attachments: Pick<MessageAttachment, 'kind' | 'fileName'>[];
  isOwn: boolean;
  isDeleted: boolean;
}

export interface MessageItem {
  id: string;
  clientGeneratedId?: string;
  threadId: string;
  senderMemberId: string;
  senderDisplayName: string;
  senderAvatar?: string;
  body: string;
  createdAt: string;
  status: MessageDeliveryStatus;
  attachments: MessageAttachment[];
  isOwn: boolean;
  replyTo?: MessageReplyPreview;
  deletedAt?: string;
}

export interface MessageThreadSummary {
  id: string;
  type: MessageThreadType;
  category: MessageThreadCategory;
  title: string;
  subtitle: string;
  topic: string;
  avatar?: string;
  initials: string;
  unreadCount: number;
  isPinned: boolean;
  lastActivityAt: string;
  lastMessagePreview: string;
  lastMessageSenderName?: string;
  presence?: MessagePresence;
  memberCount: number;
  participants: MessageParticipant[];
}

export interface MessageThreadDetail extends MessageThreadSummary {
  description?: string;
  attachmentsEnabled: boolean;
  audioEnabled: boolean;
  messages: MessageItem[];
  syncToken: string;
  pollingIntervalMs: number;
}

export interface MessageInboxData {
  threads: MessageThreadSummary[];
  unreadCount: number;
  syncToken: string;
  pollingIntervalMs: number;
}
