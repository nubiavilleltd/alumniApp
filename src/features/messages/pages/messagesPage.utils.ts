import type { AppIcon } from '@/shared/utils/renderIcon';
import { AudioLines, FileText, Image } from 'lucide-react';
import {
  assertValidMessageAttachmentUploadRequest,
  buildFileAttachmentUploadRequest,
  describeAttachmentForPreview,
  formatBytes,
} from '../api/adapters/messages.adapter';
import type { UploadMessageAttachmentRequest } from '../api/messages.contract';
import type {
  MessageAttachment,
  MessageDeliveryStatus,
  MessageItem,
  MessageParticipant,
  MessageReplyPreview,
  MessageThreadDetail,
  MessageThreadSummary,
} from '../types/messages.types';
import type { DraftComposerAttachment } from './messagesPage.types';

export function getParticipantRolePriority(role: MessageParticipant['roleInThread']) {
  if (role === 'admin') return 0;
  if (role === 'moderator') return 1;
  return 2;
}

export function sortGroupParticipants(participants: MessageParticipant[]) {
  return [...participants].sort((left, right) => {
    const roleDifference =
      getParticipantRolePriority(left.roleInThread) -
      getParticipantRolePriority(right.roleInThread);

    if (roleDifference !== 0) {
      return roleDifference;
    }

    return left.fullName.localeCompare(right.fullName);
  });
}

export function formatThreadTimestamp(value: string) {
  const date = new Date(value);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();

  if (sameDay) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  const withinWeek = now.getTime() - date.getTime() < 6 * 24 * 60 * 60 * 1000;
  if (withinWeek) {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
    });
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function formatConversationDay(value: string) {
  const date = new Date(value);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (date.toDateString() === now.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatMessageTime(value: string) {
  return new Date(value).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatAudioDuration(durationSeconds = 0) {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function formatRecordingDuration(durationMs: number) {
  return formatAudioDuration(Math.max(0, Math.floor(durationMs / 1000)));
}

export function createDraftComposerAttachmentId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createClientGeneratedMessageId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `client-${crypto.randomUUID()}`;
  }

  return `client-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function buildDraftComposerAttachment(
  file: File,
  viewerMemberId: string,
): DraftComposerAttachment {
  const uploadRequest = buildFileAttachmentUploadRequest(file, viewerMemberId);
  assertValidMessageAttachmentUploadRequest(uploadRequest);
  const previewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;

  return {
    id: createDraftComposerAttachmentId(),
    kind: uploadRequest.kind,
    fileName: uploadRequest.fileName,
    mimeType: uploadRequest.mimeType,
    sizeInBytes: uploadRequest.sizeInBytes,
    sizeLabel: formatBytes(uploadRequest.sizeInBytes),
    previewUrl,
    uploadRequest,
  };
}

export function buildDraftComposerAttachmentFromUploadRequest(
  uploadRequest: UploadMessageAttachmentRequest,
  options?: {
    previewUrl?: string;
  },
): DraftComposerAttachment {
  return {
    id: createDraftComposerAttachmentId(),
    kind: uploadRequest.kind,
    fileName: uploadRequest.fileName,
    mimeType: uploadRequest.mimeType,
    sizeInBytes: uploadRequest.sizeInBytes,
    sizeLabel: formatBytes(uploadRequest.sizeInBytes),
    durationSeconds: uploadRequest.durationSeconds,
    previewUrl: options?.previewUrl,
    uploadRequest,
  };
}

export function buildOptimisticMessage(params: {
  viewerMemberId: string;
  threadId: string;
  body?: string;
  attachments: MessageAttachment[];
  clientGeneratedId: string;
  currentUserName?: string;
  currentUserAvatar?: string;
  replyTo?: MessageReplyPreview | null;
}): MessageItem {
  return {
    id: params.clientGeneratedId,
    clientGeneratedId: params.clientGeneratedId,
    threadId: params.threadId,
    senderMemberId: params.viewerMemberId,
    senderDisplayName: params.currentUserName ?? 'You',
    senderAvatar: params.currentUserAvatar,
    body: params.body?.trim() ?? '',
    createdAt: new Date().toISOString(),
    status: 'sending',
    attachments: params.attachments,
    isOwn: true,
    replyTo: params.replyTo ?? undefined,
  };
}

export function buildOptimisticAttachmentsFromDraftAttachments(
  draftAttachments: DraftComposerAttachment[],
): MessageAttachment[] {
  return draftAttachments.map((draftAttachment) => {
    if (draftAttachment.uploadedAttachment) {
      return draftAttachment.uploadedAttachment;
    }

    return {
      id: draftAttachment.id,
      kind: draftAttachment.kind,
      fileName: draftAttachment.fileName,
      mimeType: draftAttachment.mimeType,
      sizeInBytes: draftAttachment.sizeInBytes,
      sizeLabel: draftAttachment.sizeLabel,
      durationSeconds: draftAttachment.durationSeconds,
      uploadState: 'processing',
      url: draftAttachment.previewUrl,
    };
  });
}

export function mergeThreadMessagesWithOptimistic(
  persistedMessages: MessageItem[],
  optimisticMessages: MessageItem[],
) {
  if (optimisticMessages.length === 0) {
    return persistedMessages;
  }

  const persistedIds = new Set(persistedMessages.map((message) => message.id));
  const persistedClientGeneratedIds = new Set(
    persistedMessages
      .map((message) => message.clientGeneratedId)
      .filter((value): value is string => typeof value === 'string' && value.length > 0),
  );

  const remainingOptimisticMessages = optimisticMessages.filter(
    (message) =>
      !persistedIds.has(message.id) &&
      !persistedClientGeneratedIds.has(message.clientGeneratedId ?? message.id),
  );

  return [...persistedMessages, ...remainingOptimisticMessages];
}

export function buildCopyTextFromMessage(message: MessageItem) {
  if (message.deletedAt) {
    return '';
  }

  return message.body.trim();
}

export function buildReplyPreviewFromMessage(message: MessageItem): MessageReplyPreview {
  return {
    messageId: message.id,
    senderMemberId: message.senderMemberId,
    senderDisplayName: message.senderDisplayName,
    bodyPreview: message.deletedAt
      ? 'Message removed'
      : message.body.trim() ||
        message.attachments
          .map((attachment) => describeAttachmentForPreview(attachment))
          .join(', ') ||
        'Message',
    attachments: message.attachments.map((attachment) => ({
      kind: attachment.kind,
      fileName: attachment.fileName,
    })),
    isOwn: message.isOwn,
    isDeleted: !!message.deletedAt,
  };
}

export function presenceClasses(value?: MessageThreadSummary['presence']) {
  if (value === 'online') return 'bg-emerald-500';
  if (value === 'away') return 'bg-amber-400';
  return 'bg-gray-300';
}

export function presenceLabel(value?: MessageThreadSummary['presence']) {
  if (value === 'online') return 'Online now';
  if (value === 'away') return 'Away right now';
  return '';
}

export function formatThreadHeaderSubtitle(thread: MessageThreadSummary | MessageThreadDetail) {
  if (thread.type === 'group') {
    return formatMemberCount(thread.memberCount);
  }

  const label = presenceLabel(thread.presence);
  if (label) return label;

  return thread.topic || '';
}

export function formatMemberCount(count: number) {
  return `${count} ${count === 1 ? 'member' : 'members'}`;
}

export function getThreadPreview(thread: MessageThreadSummary) {
  if (thread.type === 'group' && thread.lastMessageSenderName) {
    return `${thread.lastMessageSenderName}: ${thread.lastMessagePreview}`;
  }

  return thread.lastMessagePreview;
}

export function getThreadPreviewParts(thread: MessageThreadSummary) {
  return {
    senderPrefix:
      thread.type === 'group' && thread.lastMessageSenderName
        ? `${thread.lastMessageSenderName}: `
        : '',
    text: thread.lastMessagePreview,
    attachmentKind: thread.lastMessagePreviewAttachmentKind,
  };
}

export function getAttachmentIcon(kind: MessageAttachment['kind']): AppIcon {
  if (kind === 'audio') return AudioLines;
  if (kind === 'image') return Image;
  return FileText;
}

export function deliveryLabel(status: MessageDeliveryStatus) {
  if (status === 'seen') return 'Seen';
  if (status === 'delivered') return 'Delivered';
  if (status === 'failed') return 'Failed';
  if (status === 'sending') return 'Sending';
  return 'Sent';
}

export function getPreferredRecorderMimeType() {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return '';
  }

  return (
    ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'].find(
      (mimeType) => MediaRecorder.isTypeSupported(mimeType),
    ) ?? ''
  );
}
