import { Icon } from '@iconify/react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Fragment,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import EmptyState from '@/shared/components/ui/EmptyState';
import { toast } from '@/shared/components/ui/Toast';
import {
  MESSAGE_ATTACHMENT_FILE_INPUT_ACCEPT,
  buildFileAttachmentUploadRequest,
  buildRecordedVoiceNoteUploadRequest,
  buildSendMessageRequest,
  buildVoiceNoteUploadRequest,
  describeAttachmentForPreview,
  filterMessageThreads,
  formatBytes,
  isGraduationYearGroupThread,
} from '../api/adapters/messages.adapter';
import type { UploadMessageAttachmentRequest } from '../api/messages.contract';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import {
  messageKeys,
  useCreateDirectMessageThread,
  useDeleteMessage,
  useMarkMessageThreadRead,
  useMessageThread,
  useMessagesInbox,
  useSendMessage,
  useUploadMessageAttachment,
} from '../hooks/useMessages';
import { useStartDirectConversation } from '../hooks/useStartDirectConversation';
import {
  getMessageAttachmentPreviewUrl,
  registerMessageAttachmentPreview,
  revokeMessageAttachmentPreview,
} from '../lib/messageAttachmentPreviewRegistry';
import {
  recordMarketplaceDraftPrefill,
  shouldPrefillMarketplaceDraft,
} from '../lib/marketplaceDraftPrefillStorage';
import type {
  MessageAttachment,
  MessageDeliveryStatus,
  MessageItem,
  MessageParticipant,
  MessageReplyPreview,
  MessageThreadDetail,
  MessageThreadFilter,
  MessageThreadSummary,
} from '../types/messages.types';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';

const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Messages' }];
const MIN_VOICE_NOTE_DURATION_MS = 600;
const RECORDING_TIMER_INTERVAL_MS = 200;

interface DraftComposerAttachment {
  id: string;
  kind: MessageAttachment['kind'];
  fileName: string;
  mimeType: string;
  sizeInBytes: number;
  sizeLabel: string;
  durationSeconds?: number;
  previewUrl?: string;
  uploadRequest: UploadMessageAttachmentRequest;
  uploadedAttachment?: MessageAttachment;
}

interface OpenMessageActionsMenu {
  messageId: string;
  style: CSSProperties;
}

interface ReplaceMessagesSearchOptions {
  initialMessage?: string;
  draftMessage?: string;
  marketplaceBusinessId?: string;
}

function getParticipantRolePriority(role: MessageParticipant['roleInThread']) {
  if (role === 'admin') return 0;
  if (role === 'moderator') return 1;
  return 2;
}

function sortGroupParticipants(participants: MessageParticipant[]) {
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

// Only All and Unread filters, matching Figma design
const inboxFilters: { key: MessageThreadFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
];

function formatThreadTimestamp(value: string) {
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

function formatConversationDay(value: string) {
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

function formatMessageTime(value: string) {
  return new Date(value).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatAudioDuration(durationSeconds = 0) {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function formatRecordingDuration(durationMs: number) {
  return formatAudioDuration(Math.max(0, Math.floor(durationMs / 1000)));
}

function createDraftComposerAttachmentId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function createClientGeneratedMessageId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `client-${crypto.randomUUID()}`;
  }

  return `client-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function buildDraftComposerAttachment(file: File, viewerMemberId: string): DraftComposerAttachment {
  const uploadRequest = buildFileAttachmentUploadRequest(file, viewerMemberId);
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

function buildDraftComposerAttachmentFromUploadRequest(
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

function buildOptimisticMessage(params: {
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

function buildOptimisticAttachmentsFromDraftAttachments(
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

function mergeThreadMessagesWithOptimistic(
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

function buildCopyTextFromMessage(message: MessageItem) {
  if (message.deletedAt) {
    return '';
  }

  return message.body.trim();
}

function buildReplyPreviewFromMessage(message: MessageItem): MessageReplyPreview {
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

function presenceClasses(value?: MessageThreadSummary['presence']) {
  if (value === 'online') return 'bg-emerald-500';
  if (value === 'away') return 'bg-amber-400';
  return 'bg-gray-300';
}

function presenceLabel(value?: MessageThreadSummary['presence']) {
  if (value === 'online') return 'Online now';
  if (value === 'away') return 'Away right now';
  return '';
}

function formatThreadHeaderSubtitle(thread: MessageThreadSummary | MessageThreadDetail) {
  if (thread.type === 'group') {
    return `${thread.memberCount} members`;
  }
  const label = presenceLabel(thread.presence);
  if (label) return label;
  // Show last seen style subtitle from topic or fallback
  return thread.topic || '';
}

function getThreadPreview(thread: MessageThreadSummary) {
  if (thread.type === 'group' && thread.lastMessageSenderName) {
    return `${thread.lastMessageSenderName}: ${thread.lastMessagePreview}`;
  }

  return thread.lastMessagePreview;
}

function getAttachmentIcon(kind: MessageAttachment['kind']) {
  if (kind === 'audio') return 'mdi:waveform';
  if (kind === 'image') return 'mdi:image-outline';
  return 'mdi:file-document-outline';
}

function deliveryLabel(status: MessageDeliveryStatus) {
  if (status === 'seen') return 'Seen';
  if (status === 'delivered') return 'Delivered';
  if (status === 'failed') return 'Failed';
  if (status === 'sending') return 'Sending';
  return 'Sent';
}

function getPreferredRecorderMimeType() {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return '';
  }

  return (
    ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'].find(
      (mimeType) => MediaRecorder.isTypeSupported(mimeType),
    ) ?? ''
  );
}

function ParticipantAvatar({
  participant,
  size = 'md',
}: {
  participant: MessageParticipant;
  size?: 'sm' | 'md';
}) {
  const [hasImageError, setHasImageError] = useState(false);
  const sizeClasses =
    size === 'sm' ? 'h-9 w-9 rounded-full text-xs' : 'h-11 w-11 rounded-full text-sm';

  useEffect(() => {
    setHasImageError(false);
  }, [participant.avatar]);

  return participant.avatar && !hasImageError ? (
    <img
      src={participant.avatar}
      alt={participant.fullName}
      className={`${sizeClasses} object-cover`}
      onError={() => setHasImageError(true)}
    />
  ) : (
    <div
      className={`flex ${sizeClasses} items-center justify-center bg-blue-100 font-semibold text-blue-700`}
    >
      {participant.initials}
    </div>
  );
}

function GroupParticipantsModal({
  isOpen,
  onClose,
  threadTitle,
  participants,
  viewerMemberId,
}: {
  isOpen: boolean;
  onClose: () => void;
  threadTitle: string;
  participants: MessageParticipant[];
  viewerMemberId?: string;
}) {
  const navigate = useNavigate();
  const { startDirectConversation, isPending: isStartingConversation } =
    useStartDirectConversation();
  const [pendingConversationMemberId, setPendingConversationMemberId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleOpenProfile(participant: MessageParticipant) {
    const profileHref = participant.profileHref || `/alumni/profiles/${participant.memberId}`;
    onClose();
    navigate(profileHref);
  }

  async function handleStartConversation(participant: MessageParticipant) {
    if (!participant.memberId || participant.memberId === viewerMemberId) {
      return;
    }

    setPendingConversationMemberId(participant.memberId);
    onClose();

    try {
      await startDirectConversation({
        participantMemberId: participant.memberId,
        recipientProfile: {
          fullName: participant.fullName,
          avatar: participant.avatar,
          headline: participant.headline,
          location: participant.location,
          graduationYear: participant.graduationYear || undefined,
          slug: participant.slug,
          profileHref: participant.profileHref,
        },
      });
    } finally {
      setPendingConversationMemberId((current) =>
        current === participant.memberId ? null : current,
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${threadTitle} members`}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Group Members
            </p>
            <h3 className="mt-1.5 truncate text-xl font-semibold text-gray-900">{threadTitle}</h3>
            <p className="mt-0.5 text-sm text-gray-500">{participants.length} participants</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close members list"
          >
            <Icon icon="mdi:close" className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
          <div className="space-y-2">
            {participants.map((participant) => {
              const isViewer = participant.memberId === viewerMemberId;

              return (
                <div
                  key={participant.memberId}
                  className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 sm:flex-row sm:items-center"
                >
                  <button
                    type="button"
                    onClick={() => handleOpenProfile(participant)}
                    className="flex items-center gap-3 rounded-xl text-left transition-colors hover:bg-white/70 sm:flex-1 sm:px-2 sm:py-1.5"
                  >
                    <ParticipantAvatar participant={participant} />

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {participant.fullName}
                        </p>
                        {isViewer ? (
                          <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-gray-500">
                            You
                          </span>
                        ) : null}
                        {participant.roleInThread === 'admin' ? (
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600">
                            Admin
                          </span>
                        ) : participant.roleInThread === 'moderator' ? (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                            Moderator
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-0.5 truncate text-sm text-gray-500">
                        {participant.headline}
                      </p>
                      <p className="mt-1.5 text-xs font-medium text-blue-600">View profile</p>
                    </div>
                  </button>

                  {!isViewer ? (
                    <button
                      type="button"
                      onClick={() => void handleStartConversation(participant)}
                      disabled={isStartingConversation}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-200 sm:w-auto"
                    >
                      <Icon
                        icon={
                          isStartingConversation &&
                          pendingConversationMemberId === participant.memberId
                            ? 'mdi:loading'
                            : 'mdi:message-outline'
                        }
                        className={`h-4 w-4 ${
                          isStartingConversation &&
                          pendingConversationMemberId === participant.memberId
                            ? 'animate-spin'
                            : ''
                        }`}
                      />
                      {isStartingConversation &&
                      pendingConversationMemberId === participant.memberId
                        ? 'Opening...'
                        : 'Message'}
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ThreadAvatar({
  thread,
  size = 'md',
}: {
  thread: MessageThreadSummary | MessageThreadDetail;
  size?: 'sm' | 'md';
}) {
  const [hasImageError, setHasImageError] = useState(false);
  // Figma: avatars are circles
  const sizeClasses = size === 'sm' ? 'h-11 w-11 rounded-full' : 'h-12 w-12 rounded-full';

  useEffect(() => {
    setHasImageError(false);
  }, [thread.avatar]);

  if (thread.type === 'group') {
    return (
      <div
        className={`flex ${sizeClasses} flex-shrink-0 items-center justify-center bg-blue-100 text-blue-600`}
      >
        <Icon icon="mdi:account-group-outline" className="h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="relative flex-shrink-0">
      {thread.avatar && !hasImageError ? (
        <img
          src={thread.avatar}
          alt={thread.title}
          className={`${sizeClasses} object-cover`}
          onError={() => setHasImageError(true)}
        />
      ) : (
        <div
          className={`flex ${sizeClasses} items-center justify-center bg-blue-100 text-sm font-semibold text-blue-700`}
        >
          {thread.initials}
        </div>
      )}
      {thread.presence ? (
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${presenceClasses(
            thread.presence,
          )}`}
        />
      ) : null}
    </div>
  );
}

function ReplyPreviewCard({
  replyTo,
  variant,
  onClear,
  onOpenOriginal,
}: {
  replyTo: MessageReplyPreview;
  variant: 'composer' | 'bubble';
  onClear?: () => void;
  onOpenOriginal?: (messageId: string) => void;
}) {
  const isComposer = variant === 'composer';
  const attachmentSummary =
    replyTo.attachments.length > 0
      ? replyTo.attachments.length === 1
        ? describeAttachmentForPreview({
            id: replyTo.messageId,
            kind: replyTo.attachments[0].kind,
            fileName: replyTo.attachments[0].fileName,
            mimeType: '',
            sizeInBytes: 0,
            sizeLabel: '',
            uploadState: 'uploaded',
          })
        : `${replyTo.attachments.length} attachments`
      : null;

  return (
    <div
      className={`mb-3 rounded-xl border-l-4 px-3 py-2.5 ${
        isComposer
          ? 'border-blue-500 bg-blue-50 text-gray-800'
          : 'border-blue-300 bg-black/10 text-inherit'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {onOpenOriginal ? (
          <button
            type="button"
            onClick={() => onOpenOriginal(replyTo.messageId)}
            className="min-w-0 flex-1 text-left"
          >
            <p
              className={`truncate text-xs font-semibold ${
                isComposer ? 'text-blue-700' : 'text-current/80'
              }`}
            >
              {replyTo.senderDisplayName}
            </p>
            <p
              className={`mt-0.5 line-clamp-2 text-sm ${
                isComposer ? 'text-gray-600' : 'text-current/85'
              }`}
            >
              {replyTo.bodyPreview}
            </p>
            {attachmentSummary ? (
              <p className={`mt-0.5 text-xs ${isComposer ? 'text-gray-500' : 'text-current/70'}`}>
                {attachmentSummary}
              </p>
            ) : null}
          </button>
        ) : (
          <div className="min-w-0">
            <p
              className={`truncate text-xs font-semibold ${
                isComposer ? 'text-blue-700' : 'text-current/80'
              }`}
            >
              {replyTo.senderDisplayName}
            </p>
            <p
              className={`mt-0.5 line-clamp-2 text-sm ${
                isComposer ? 'text-gray-600' : 'text-current/85'
              }`}
            >
              {replyTo.bodyPreview}
            </p>
            {attachmentSummary ? (
              <p className={`mt-0.5 text-xs ${isComposer ? 'text-gray-500' : 'text-current/70'}`}>
                {attachmentSummary}
              </p>
            ) : null}
          </div>
        )}

        {onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Clear reply target"
          >
            <Icon icon="mdi:close" className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function MessageAttachments({
  attachments,
  isOwn,
  onOpenImage,
}: {
  attachments: MessageAttachment[];
  isOwn: boolean;
  onOpenImage: (attachment: MessageAttachment) => void;
}) {
  return (
    <div className="mt-2.5 space-y-2">
      {attachments.map((attachment) => {
        const previewUrl = attachment.url ?? getMessageAttachmentPreviewUrl(attachment.id);

        if (attachment.kind === 'image' && previewUrl) {
          return (
            <button
              key={attachment.id}
              type="button"
              onClick={() => onOpenImage(attachment)}
              className="group block w-full overflow-hidden rounded-xl text-left transition-transform hover:scale-[1.01]"
            >
              <div className="relative">
                <img
                  src={previewUrl}
                  alt={attachment.fileName}
                  className="max-h-72 w-full rounded-xl object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 rounded-b-xl bg-gradient-to-t from-black/70 via-black/20 to-transparent px-3 pb-3 pt-8 text-white">
                  <div className="flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{attachment.fileName}</p>
                      <p className="text-xs text-white/70">{attachment.sizeLabel}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white">
                      <Icon icon="mdi:arrow-expand-all" className="h-3 w-3" />
                      Open
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        }

        return (
          <div
            key={attachment.id}
            className={`rounded-xl border px-3 py-2.5 ${
              isOwn
                ? 'border-blue-200/60 bg-white/20 text-gray-900'
                : 'border-gray-200 bg-white text-gray-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  isOwn ? 'bg-white/30' : 'bg-blue-50 text-blue-600'
                }`}
              >
                <Icon icon={getAttachmentIcon(attachment.kind)} className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{attachment.fileName}</p>
                <p className={`text-xs ${isOwn ? 'text-gray-600' : 'text-gray-500'}`}>
                  {attachment.kind === 'audio' && attachment.durationSeconds
                    ? `${formatAudioDuration(attachment.durationSeconds)} • ${attachment.sizeLabel}`
                    : attachment.sizeLabel}
                </p>
              </div>
            </div>

            {attachment.kind === 'audio' && attachment.waveform ? (
              <div className="mt-2.5 flex h-8 items-end gap-0.5">
                {attachment.waveform.map((barHeight, index) => (
                  <span
                    key={`${attachment.id}-${index}`}
                    className={`block w-1 rounded-full ${isOwn ? 'bg-blue-400' : 'bg-blue-200'}`}
                    style={{ height: `${Math.max(8, Math.round(barHeight * 0.4))}px` }}
                  />
                ))}
              </div>
            ) : null}

            {attachment.kind === 'audio' ? (
              previewUrl ? (
                <audio controls preload="metadata" src={previewUrl} className="mt-2.5 w-full" />
              ) : (
                <p className={`mt-2.5 text-xs ${isOwn ? 'text-gray-500' : 'text-gray-400'}`}>
                  Audio playback is unavailable for this message right now.
                </p>
              )
            ) : null}

            {attachment.kind === 'file' && previewUrl ? (
              <div className="mt-2.5">
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    isOwn
                      ? 'bg-white/20 text-gray-700 hover:bg-white/30'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  <Icon icon="mdi:open-in-new" className="h-3.5 w-3.5" />
                  Open file
                </a>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function DraftComposerAttachments({
  attachments,
  onRemove,
}: {
  attachments: DraftComposerAttachment[];
  onRemove: (attachmentId: string) => void;
}) {
  if (attachments.length === 0) return null;

  return (
    <div className="mb-3 space-y-2">
      <div className={`grid gap-2.5 ${attachments.length > 1 ? 'sm:grid-cols-2' : ''}`}>
        {attachments.map((attachment) => {
          if (attachment.kind === 'image' && attachment.previewUrl) {
            return (
              <div
                key={attachment.id}
                className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-900 shadow-sm"
              >
                <img
                  src={attachment.previewUrl}
                  alt={attachment.fileName}
                  className="h-56 w-full object-cover sm:h-64"
                />
                <button
                  type="button"
                  onClick={() => onRemove(attachment.id)}
                  className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                  aria-label={`Remove ${attachment.fileName}`}
                >
                  <Icon icon="mdi:close" className="h-4 w-4" />
                </button>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-3 pb-3 pt-8 text-white">
                  <p className="truncate text-sm font-medium">{attachment.fileName}</p>
                  <p className="text-xs text-white/60">{attachment.sizeLabel}</p>
                </div>
              </div>
            );
          }

          if (attachment.kind === 'audio') {
            return (
              <div
                key={attachment.id}
                className="relative rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-gray-800 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => onRemove(attachment.id)}
                  className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  aria-label={`Remove ${attachment.fileName}`}
                >
                  <Icon icon="mdi:close" className="h-3.5 w-3.5" />
                </button>

                <div className="flex items-center gap-3 pr-10">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon icon="mdi:waveform" className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{attachment.fileName}</p>
                    <p className="text-xs text-gray-500">
                      {attachment.durationSeconds
                        ? `${formatAudioDuration(attachment.durationSeconds)} • ${attachment.sizeLabel}`
                        : attachment.sizeLabel}
                    </p>
                  </div>
                </div>

                {attachment.previewUrl ? (
                  <audio
                    controls
                    preload="metadata"
                    src={attachment.previewUrl}
                    className="mt-3 w-full"
                  />
                ) : (
                  <p className="mt-3 text-xs text-gray-500">
                    Playback preview is unavailable for this recording in the current browser.
                  </p>
                )}
              </div>
            );
          }

          return (
            <div
              key={attachment.id}
              className="relative flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-gray-800 shadow-sm"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon icon={getAttachmentIcon(attachment.kind)} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{attachment.fileName}</p>
                <p className="text-xs text-gray-500">{attachment.sizeLabel}</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(attachment.id)}
                className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label={`Remove ${attachment.fileName}`}
              >
                <Icon icon="mdi:close" className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ImageAttachmentLightbox({
  attachment,
  onClose,
}: {
  attachment: MessageAttachment | null;
  onClose: () => void;
}) {
  const previewUrl = attachment
    ? (attachment.url ?? getMessageAttachmentPreviewUrl(attachment.id))
    : undefined;

  useEffect(() => {
    if (!attachment) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [attachment, onClose]);

  if (!attachment || !previewUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={attachment.fileName}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Close image preview"
      >
        <Icon icon="mdi:close" className="h-5 w-5" />
      </button>

      <div
        className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-gray-900/90 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 text-white">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{attachment.fileName}</p>
            <p className="text-xs text-white/60">{attachment.sizeLabel}</p>
          </div>

          <button
            type="button"
            onClick={() => window.open(previewUrl, '_blank', 'noopener,noreferrer')}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:border-white/30 hover:text-white"
          >
            <Icon icon="mdi:open-in-new" className="h-3.5 w-3.5" />
            Open
          </button>
        </div>

        <div className="flex max-h-[80vh] items-center justify-center bg-black/50 p-4 sm:p-6">
          <img
            src={previewUrl}
            alt={attachment.fileName}
            className="max-h-[72vh] w-auto max-w-full rounded-xl object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export function MessagesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const currentUser = useIdentityStore((state) => state.user);
  const viewerMemberId = currentUser?.memberId ?? '';
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [filter, setFilter] = useState<MessageThreadFilter>('all');
  const [query, setQuery] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const [draftAttachments, setDraftAttachments] = useState<DraftComposerAttachment[]>([]);
  const [replyTarget, setReplyTarget] = useState<MessageReplyPreview | null>(null);
  const [openMessageActions, setOpenMessageActions] = useState<OpenMessageActionsMenu | null>(null);
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const [activeImageAttachment, setActiveImageAttachment] = useState<MessageAttachment | null>(
    null,
  );
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [voiceRecordingState, setVoiceRecordingState] = useState<
    'idle' | 'starting' | 'recording' | 'finishing'
  >('idle');
  const [voiceRecordingDurationMs, setVoiceRecordingDurationMs] = useState(0);
  const [optimisticMessagesByThreadId, setOptimisticMessagesByThreadId] = useState<
    Record<string, MessageItem[]>
  >({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const voiceRecordButtonRef = useRef<HTMLButtonElement | null>(null);
  const messagePaneRef = useRef<HTMLDivElement | null>(null);
  const lastOpenedThreadIdRef = useRef<string | null>(null);
  const pendingDirectThreadIntentRef = useRef<string | null>(null);
  const pendingInitialMessageIntentRef = useRef<string | null>(null);
  const activeVoicePointerIdRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const recordingContextRef = useRef<{ viewerMemberId: string; threadId: string } | null>(null);
  const recordingStartedAtRef = useRef<number | null>(null);
  const stopVoiceRecordingAfterStartRef = useRef(false);
  const hasShownRecordingFallbackToastRef = useRef(false);
  const voiceRecordingModeRef = useRef<'live' | 'simulated' | null>(null);
  const sendInFlightRef = useRef(false);
  const deferredQuery = useDeferredValue(query);
  const requestedThreadId = searchParams.get('threadId');
  const requestedRecipientId = searchParams.get('recipient');
  const requestedTopic = searchParams.get('topic') ?? undefined;
  const requestedInitialMessage = searchParams.get('initialMessage')?.trim() ?? undefined;
  const requestedDraftMessage = searchParams.get('draftMessage')?.trim() ?? undefined;
  const requestedMarketplaceBusinessId =
    searchParams.get('marketplaceBusinessId')?.trim() ?? undefined;

  const inboxQuery = useMessagesInbox();
  const createDirectThread = useCreateDirectMessageThread();
  const deleteMessage = useDeleteMessage();
  const sendMessage = useSendMessage();
  const uploadAttachment = useUploadMessageAttachment();
  const markThreadRead = useMarkMessageThreadRead();
  const inboxThreads = inboxQuery.data?.threads ?? [];

  const visibleThreads = useMemo(
    () => filterMessageThreads(inboxThreads, filter, deferredQuery, selectedThreadId),
    [deferredQuery, filter, inboxThreads, selectedThreadId],
  );

  useEffect(() => {
    if (requestedThreadId) {
      setSelectedThreadId((current) =>
        current === requestedThreadId ? current : requestedThreadId,
      );
      return;
    }

    if (!inboxThreads.length) {
      setSelectedThreadId(null);
      return;
    }

    if (selectedThreadId && !inboxThreads.some((thread) => thread.id === selectedThreadId)) {
      setSelectedThreadId(null);
    }
  }, [inboxThreads, requestedThreadId, selectedThreadId]);

  const activeThreadSummary = selectedThreadId
    ? (inboxThreads.find((thread) => thread.id === selectedThreadId) ?? null)
    : null;
  const resolvedThreadSummary = activeThreadSummary;
  const activeThreadId = requestedThreadId ?? selectedThreadId ?? null;
  const threadQuery = useMessageThread(activeThreadId);
  const activeThread = threadQuery.data ?? null;
  const activeOptimisticMessages = activeThreadId
    ? (optimisticMessagesByThreadId[activeThreadId] ?? [])
    : [];
  const activeThreadWithOptimisticMessages =
    activeThread && activeOptimisticMessages.length > 0
      ? {
          ...activeThread,
          messages: mergeThreadMessagesWithOptimistic(
            activeThread.messages,
            activeOptimisticMessages,
          ),
        }
      : activeThread;
  const threadShell = activeThreadWithOptimisticMessages ?? resolvedThreadSummary;
  const unreadMessageCount = inboxQuery.data?.unreadCount ?? 0;
  const groupParticipants = useMemo(
    () =>
      threadShell?.type === 'group' ? sortGroupParticipants(threadShell.participants ?? []) : [],
    [threadShell],
  );
  const previewGroupParticipants = groupParticipants.slice(0, 3);
  const groupAdminParticipant =
    groupParticipants.find((participant) => participant.roleInThread === 'admin') ?? null;
  const openMessageActionsMessage = useMemo(
    () =>
      openMessageActions
        ? (activeThreadWithOptimisticMessages?.messages.find(
            (message) => message.id === openMessageActions.messageId,
          ) ?? null)
        : null,
    [activeThreadWithOptimisticMessages?.messages, openMessageActions],
  );
  const canCopyOpenMessage =
    !!openMessageActionsMessage && !openMessageActionsMessage.deletedAt
      ? openMessageActionsMessage.body.trim().length > 0
      : false;

  function replaceMessagesSearch(nextThreadId?: string, options?: ReplaceMessagesSearchOptions) {
    const nextSearch = new URLSearchParams();

    if (nextThreadId) {
      nextSearch.set('threadId', nextThreadId);
    }

    if (options?.initialMessage?.trim()) {
      nextSearch.set('initialMessage', options.initialMessage.trim());
    }

    if (options?.draftMessage?.trim()) {
      nextSearch.set('draftMessage', options.draftMessage.trim());
    }

    if (options?.marketplaceBusinessId?.trim()) {
      nextSearch.set('marketplaceBusinessId', options.marketplaceBusinessId.trim());
    }

    navigate(
      {
        pathname: '/messages',
        search: nextSearch.toString() ? `?${nextSearch.toString()}` : '',
      },
      { replace: true },
    );
  }

  async function refreshAll() {
    await Promise.all([
      inboxQuery.refetch(),
      activeThreadId ? threadQuery.refetch() : Promise.resolve(),
    ]);
  }

  function releaseDraftAttachmentResources(
    attachment: DraftComposerAttachment,
    options?: {
      preservePreviewUrls?: Set<string>;
      preserveUploadedAttachmentIds?: Set<string>;
    },
  ) {
    const shouldPreservePreviewUrl =
      !!attachment.previewUrl && options?.preservePreviewUrls?.has(attachment.previewUrl);
    const uploadedAttachmentId = attachment.uploadedAttachment?.id;
    const shouldPreserveUploadedAttachment =
      !!uploadedAttachmentId && options?.preserveUploadedAttachmentIds?.has(uploadedAttachmentId);

    if (uploadedAttachmentId && !shouldPreserveUploadedAttachment) {
      revokeMessageAttachmentPreview(uploadedAttachmentId);
    }

    if (attachment.previewUrl && !shouldPreservePreviewUrl) {
      URL.revokeObjectURL(attachment.previewUrl);
    }
  }

  function discardDraftComposer(options?: {
    preservePreviewUrls?: Set<string>;
    preserveUploadedAttachmentIds?: Set<string>;
  }) {
    setDraftMessage('');
    setReplyTarget(null);
    setDraftAttachments((previous) => {
      previous.forEach((attachment) => {
        releaseDraftAttachmentResources(attachment, options);
      });

      return [];
    });
  }

  function addOptimisticMessage(threadId: string, message: MessageItem) {
    setOptimisticMessagesByThreadId((previous) => ({
      ...previous,
      [threadId]: [...(previous[threadId] ?? []), message],
    }));
  }

  function removeOptimisticMessage(threadId: string, messageId: string) {
    setOptimisticMessagesByThreadId((previous) => {
      const existingMessages = previous[threadId] ?? [];
      const nextMessages = existingMessages.filter((message) => message.id !== messageId);

      if (nextMessages.length === existingMessages.length) {
        return previous;
      }

      if (nextMessages.length === 0) {
        const { [threadId]: _removed, ...rest } = previous;
        return rest;
      }

      return {
        ...previous,
        [threadId]: nextMessages,
      };
    });
  }

  function removeDraftAttachment(attachmentId: string) {
    setDraftAttachments((previous) => {
      const attachmentToRemove = previous.find((attachment) => attachment.id === attachmentId);
      if (attachmentToRemove) {
        releaseDraftAttachmentResources(attachmentToRemove);
      }

      return previous.filter((attachment) => attachment.id !== attachmentId);
    });
  }

  function handleJumpToMessage(messageId: string) {
    const messageElement = messagePaneRef.current?.querySelector<HTMLElement>(
      `[data-message-id="${CSS.escape(messageId)}"]`,
    );

    if (!messageElement) {
      toast.info('We could not find that original message in this view yet.');
      return;
    }

    messageElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    setHighlightedMessageId(messageId);
  }

  function resetVoiceRecordingSession(shouldResetTimer = true) {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.onstop = null;
    }

    mediaRecorderRef.current = null;
    mediaStreamRef.current = null;
    recordingChunksRef.current = [];
    recordingContextRef.current = null;
    recordingStartedAtRef.current = null;
    stopVoiceRecordingAfterStartRef.current = false;
    voiceRecordingModeRef.current = null;
    activeVoicePointerIdRef.current = null;
    if (shouldResetTimer) {
      setVoiceRecordingDurationMs(0);
    }
  }

  function stageDraftVoiceNote(
    attachmentRequest: UploadMessageAttachmentRequest,
    previewUrl?: string,
  ) {
    setDraftAttachments((previous) => [
      ...previous,
      buildDraftComposerAttachmentFromUploadRequest(attachmentRequest, {
        previewUrl,
      }),
    ]);
  }

  async function finalizeSimulatedVoiceRecording() {
    const context = recordingContextRef.current;
    const startedAt = recordingStartedAtRef.current;
    const durationMs = startedAt ? Date.now() - startedAt : 0;

    if (!context) {
      resetVoiceRecordingSession();
      setVoiceRecordingState('idle');
      return;
    }

    if (durationMs < MIN_VOICE_NOTE_DURATION_MS) {
      resetVoiceRecordingSession();
      setVoiceRecordingState('idle');
      toast.info('Hold a little longer before releasing to send a voice note.');
      return;
    }

    setVoiceRecordingState('finishing');

    try {
      const attachmentRequest = buildVoiceNoteUploadRequest(
        context.viewerMemberId,
        Math.max(1, Math.round(durationMs / 1000)),
      );
      const previewUrl = attachmentRequest.binary
        ? URL.createObjectURL(attachmentRequest.binary)
        : undefined;

      stageDraftVoiceNote(attachmentRequest, previewUrl);
    } finally {
      resetVoiceRecordingSession();
      setVoiceRecordingState('idle');
    }
  }

  async function finalizeLiveVoiceRecording() {
    const context = recordingContextRef.current;
    const startedAt = recordingStartedAtRef.current;
    const durationMs = startedAt ? Date.now() - startedAt : 0;
    const mimeType =
      mediaRecorderRef.current?.mimeType || recordingChunksRef.current[0]?.type || 'audio/webm';
    const blob = new Blob(recordingChunksRef.current, { type: mimeType });

    if (!context) {
      resetVoiceRecordingSession();
      setVoiceRecordingState('idle');
      return;
    }

    if (durationMs < MIN_VOICE_NOTE_DURATION_MS || blob.size === 0) {
      resetVoiceRecordingSession();
      setVoiceRecordingState('idle');
      toast.info('Hold a little longer before releasing to send a voice note.');
      return;
    }

    try {
      const attachmentRequest = await buildRecordedVoiceNoteUploadRequest({
        viewerMemberId: context.viewerMemberId,
        blob,
        durationSeconds: Math.max(1, Math.round(durationMs / 1000)),
      });

      stageDraftVoiceNote(attachmentRequest, URL.createObjectURL(blob));
    } finally {
      resetVoiceRecordingSession();
      setVoiceRecordingState('idle');
    }
  }

  async function startVoiceRecording() {
    if (!viewerMemberId || !activeThread || voiceRecordingState !== 'idle') return;

    recordingContextRef.current = {
      viewerMemberId,
      threadId: activeThread.id,
    };
    recordingChunksRef.current = [];
    stopVoiceRecordingAfterStartRef.current = false;
    setVoiceRecordingDurationMs(0);

    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === 'undefined'
    ) {
      voiceRecordingModeRef.current = 'simulated';
      recordingStartedAtRef.current = Date.now();
      setVoiceRecordingState('recording');

      if (!hasShownRecordingFallbackToastRef.current) {
        toast.info(
          'Live microphone capture is unavailable here, so a placeholder voice note will be generated from your hold duration.',
        );
        hasShownRecordingFallbackToastRef.current = true;
      }

      return;
    }

    setVoiceRecordingState('starting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (stopVoiceRecordingAfterStartRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        resetVoiceRecordingSession();
        setVoiceRecordingState('idle');
        return;
      }

      const mimeType = getPreferredRecorderMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      recordingStartedAtRef.current = Date.now();
      voiceRecordingModeRef.current = 'live';

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        void finalizeLiveVoiceRecording();
      };

      recorder.start();
      setVoiceRecordingState('recording');
    } catch {
      resetVoiceRecordingSession();
      setVoiceRecordingState('idle');
      toast.error('Microphone access is required to record voice notes.');
    }
  }

  function stopVoiceRecording() {
    if (voiceRecordingState === 'starting') {
      stopVoiceRecordingAfterStartRef.current = true;
      return;
    }

    if (voiceRecordingState !== 'recording') return;

    if (voiceRecordingModeRef.current === 'simulated') {
      void finalizeSimulatedVoiceRecording();
      return;
    }

    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      void finalizeLiveVoiceRecording();
      return;
    }

    setVoiceRecordingState('finishing');
    recorder.stop();
  }

  function handleVoiceRecordPointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    if (voiceRecordingState !== 'idle') return;

    activeVoicePointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    void startVoiceRecording();
  }

  function handleVoiceRecordPointerUp(event: ReactPointerEvent<HTMLButtonElement>) {
    if (
      activeVoicePointerIdRef.current !== null &&
      event.pointerId !== activeVoicePointerIdRef.current
    ) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    activeVoicePointerIdRef.current = null;
    stopVoiceRecording();
  }

  function handleVoiceRecordKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if ((event.key !== ' ' && event.key !== 'Enter') || event.repeat) return;

    event.preventDefault();
    void startVoiceRecording();
  }

  function handleVoiceRecordKeyUp(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== ' ' && event.key !== 'Enter') return;

    event.preventDefault();
    stopVoiceRecording();
  }

  const pullToRefresh = usePullToRefresh({
    onRefresh: refreshAll,
    disabled: !viewerMemberId,
  });

  useEffect(() => {
    if (voiceRecordingState !== 'recording') {
      if (voiceRecordingState === 'idle') {
        setVoiceRecordingDurationMs(0);
      }
      return undefined;
    }

    const timer = window.setInterval(() => {
      if (!recordingStartedAtRef.current) return;
      setVoiceRecordingDurationMs(Date.now() - recordingStartedAtRef.current);
    }, RECORDING_TIMER_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [voiceRecordingState]);

  useEffect(() => {
    return () => {
      resetVoiceRecordingSession(false);
    };
  }, []);

  useEffect(() => {
    if (!highlightedMessageId) return undefined;

    const timer = window.setTimeout(() => {
      setHighlightedMessageId((current) => (current === highlightedMessageId ? null : current));
    }, 1800);

    return () => {
      window.clearTimeout(timer);
    };
  }, [highlightedMessageId]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest('[data-message-actions-root="true"]')) return;
      setOpenMessageActions(null);
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  useEffect(() => {
    if (!openMessageActions) {
      return undefined;
    }

    function handleCloseActionsMenu() {
      setOpenMessageActions(null);
    }

    const messagePane = messagePaneRef.current;
    window.addEventListener('resize', handleCloseActionsMenu);
    messagePane?.addEventListener('scroll', handleCloseActionsMenu);

    return () => {
      window.removeEventListener('resize', handleCloseActionsMenu);
      messagePane?.removeEventListener('scroll', handleCloseActionsMenu);
    };
  }, [openMessageActions]);

  useEffect(() => {
    setOpenMessageActions(null);
  }, [activeThreadId]);

  useEffect(() => {
    setParticipantsModalOpen(false);
  }, [activeThreadId]);

  useEffect(() => {
    if (!requestedThreadId) return;

    setSelectedThreadId((current) => (current === requestedThreadId ? current : requestedThreadId));
  }, [requestedThreadId]);

  useEffect(() => {
    if (!requestedRecipientId) {
      pendingDirectThreadIntentRef.current = null;
    }
  }, [requestedRecipientId]);

  useEffect(() => {
    if (!requestedInitialMessage) {
      pendingInitialMessageIntentRef.current = null;
    }
  }, [requestedInitialMessage]);

  useEffect(() => {
    if (!currentUser?.memberId || !requestedRecipientId) return;

    if (requestedRecipientId === currentUser.memberId) {
      replaceMessagesSearch();
      toast.info('Your inbox is ready whenever you want to follow up.');
      return;
    }

    const intentKey = `${requestedRecipientId}:${requestedTopic ?? ''}:${requestedInitialMessage ?? ''}:${requestedDraftMessage ?? ''}:${requestedMarketplaceBusinessId ?? ''}`;
    if (pendingDirectThreadIntentRef.current === intentKey) return;

    pendingDirectThreadIntentRef.current = intentKey;

    void createDirectThread
      .mutateAsync({
        viewerMemberId: currentUser.memberId,
        participantMemberId: requestedRecipientId,
        topic: requestedTopic,
      })
      .then((response) => {
        setSelectedThreadId(response.thread.id);
        replaceMessagesSearch(response.thread.id, {
          initialMessage: requestedInitialMessage,
          draftMessage: requestedDraftMessage,
          marketplaceBusinessId: requestedMarketplaceBusinessId,
        });
      })
      .catch(() => {
        pendingDirectThreadIntentRef.current = null;
      });
  }, [
    createDirectThread,
    currentUser,
    requestedDraftMessage,
    requestedInitialMessage,
    requestedMarketplaceBusinessId,
    requestedRecipientId,
    requestedTopic,
  ]);

  useEffect(() => {
    if (!viewerMemberId || !activeThread || !requestedInitialMessage || sendMessage.isPending) {
      return;
    }

    const initialMessage = requestedInitialMessage.trim();
    if (!initialMessage) {
      replaceMessagesSearch(activeThread.id);
      return;
    }

    const intentKey = `${activeThread.id}:${initialMessage}`;
    if (pendingInitialMessageIntentRef.current === intentKey) {
      return;
    }

    pendingInitialMessageIntentRef.current = intentKey;

    if (activeThread.messages.length > 0) {
      replaceMessagesSearch(activeThread.id);
      return;
    }

    sendInFlightRef.current = true;

    void sendMessage
      .mutateAsync(
        buildSendMessageRequest({
          viewerMemberId,
          threadId: activeThread.id,
          body: initialMessage,
          attachments: [],
        }),
      )
      .then((response) => {
        queryClient.setQueryData(
          messageKeys.thread(viewerMemberId, response.thread.id),
          response.thread,
        );
        setSelectedThreadId(response.thread.id);
        replaceMessagesSearch(response.thread.id);
      })
      .catch(() => {
        pendingInitialMessageIntentRef.current = null;
        setDraftMessage(initialMessage);
        replaceMessagesSearch(activeThread.id);
      })
      .finally(() => {
        sendInFlightRef.current = false;
      });
  }, [activeThread, queryClient, requestedInitialMessage, sendMessage, viewerMemberId]);

  useEffect(() => {
    discardDraftComposer();
  }, [activeThreadId]);

  useEffect(() => {
    if (
      !viewerMemberId ||
      !activeThread ||
      !requestedDraftMessage ||
      !requestedMarketplaceBusinessId
    ) {
      return;
    }

    if (draftMessage.trim().length > 0 || draftAttachments.length > 0) {
      replaceMessagesSearch(activeThread.id);
      return;
    }

    if (
      !shouldPrefillMarketplaceDraft({
        buyerMemberId: viewerMemberId,
        businessId: requestedMarketplaceBusinessId,
      })
    ) {
      replaceMessagesSearch(activeThread.id);
      return;
    }

    setDraftMessage(requestedDraftMessage);
    recordMarketplaceDraftPrefill({
      buyerMemberId: viewerMemberId,
      businessId: requestedMarketplaceBusinessId,
    });
    replaceMessagesSearch(activeThread.id);
  }, [
    activeThread,
    draftAttachments.length,
    draftMessage,
    requestedDraftMessage,
    requestedMarketplaceBusinessId,
    viewerMemberId,
  ]);

  useEffect(() => {
    if (
      !viewerMemberId ||
      !activeThread ||
      activeThread.unreadCount === 0 ||
      markThreadRead.isPending
    ) {
      return;
    }

    markThreadRead.mutate({
      viewerMemberId,
      threadId: activeThread.id,
    });
  }, [activeThread, markThreadRead, viewerMemberId]);

  useEffect(() => {
    if (!activeThreadWithOptimisticMessages?.id) {
      lastOpenedThreadIdRef.current = null;
      return;
    }

    const container = messagePaneRef.current;
    if (!container || lastOpenedThreadIdRef.current === activeThreadWithOptimisticMessages.id) {
      return;
    }

    lastOpenedThreadIdRef.current = activeThreadWithOptimisticMessages.id;

    window.requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'auto',
      });
    });
  }, [activeThreadWithOptimisticMessages?.id, activeThreadWithOptimisticMessages?.messages.length]);

  useEffect(() => {
    const container = messagePaneRef.current;
    if (!container || !activeThreadWithOptimisticMessages?.messages.length) return;

    const lastMessage =
      activeThreadWithOptimisticMessages.messages[
        activeThreadWithOptimisticMessages.messages.length - 1
      ];
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    if (lastMessage.isOwn || distanceFromBottom < 160) {
      window.requestAnimationFrame(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      });
    }
  }, [activeThreadWithOptimisticMessages?.id, activeThreadWithOptimisticMessages?.messages]);

  async function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (!viewerMemberId || !activeThread || files.length === 0) return;

    const nextAttachments = files.map((file) => buildDraftComposerAttachment(file, viewerMemberId));

    setDraftAttachments((previous) => [...previous, ...nextAttachments]);
  }

  async function handleCopyMessage(message: MessageItem) {
    const textToCopy = buildCopyTextFromMessage(message);

    if (!textToCopy) {
      toast.info('There is nothing to copy from this message.');
      setOpenMessageActions(null);
      return;
    }

    if (!navigator.clipboard?.writeText) {
      toast.error('Copy is not supported in this browser.');
      setOpenMessageActions(null);
      return;
    }

    await navigator.clipboard.writeText(textToCopy);
    toast.success('Message copied.');
    setOpenMessageActions(null);
  }

  function handleReplyToMessage() {
    if (!openMessageActionsMessage) {
      return;
    }

    setReplyTarget(buildReplyPreviewFromMessage(openMessageActionsMessage));
    setOpenMessageActions(null);
  }

  async function handleDeleteMessage() {
    if (!viewerMemberId || !activeThread || !openMessageActionsMessage) {
      setOpenMessageActions(null);
      return;
    }

    if (!openMessageActionsMessage.isOwn || openMessageActionsMessage.deletedAt) {
      setOpenMessageActions(null);
      return;
    }

    const shouldDelete = window.confirm('Delete this message?');
    if (!shouldDelete) {
      setOpenMessageActions(null);
      return;
    }

    setOpenMessageActions(null);

    await deleteMessage.mutateAsync({
      viewerMemberId,
      threadId: activeThread.id,
      messageId: openMessageActionsMessage.id,
    });

    if (replyTarget?.messageId === openMessageActionsMessage.id) {
      setReplyTarget(null);
    }
  }

  function handleToggleMessageActions(message: MessageItem, trigger: HTMLButtonElement) {
    if (openMessageActions?.messageId === message.id) {
      setOpenMessageActions(null);
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const viewportPadding = 16;
    const menuWidth = 160;
    const menuStyle: CSSProperties = {
      position: 'fixed',
      bottom: `${Math.max(viewportPadding, window.innerHeight - rect.top + 8)}px`,
    };

    if (message.isOwn) {
      menuStyle.left = `${Math.min(
        Math.max(viewportPadding, rect.left),
        window.innerWidth - menuWidth - viewportPadding,
      )}px`;
    } else {
      menuStyle.right = `${Math.max(viewportPadding, window.innerWidth - rect.right)}px`;
    }

    setOpenMessageActions({
      messageId: message.id,
      style: menuStyle,
    });
  }

  async function handleSendMessage() {
    if (sendInFlightRef.current || !viewerMemberId || !activeThread) return;

    const currentThreadId = activeThread.id;
    const originalDraftMessage = draftMessage;
    const originalDraftAttachments = draftAttachments;
    const originalReplyTarget = replyTarget;
    const body = originalDraftMessage.trim();
    if (!body && originalDraftAttachments.length === 0) return;

    sendInFlightRef.current = true;

    const uploadedByDraftId = new Map<string, MessageAttachment>();
    const preservePreviewUrls = new Set(
      originalDraftAttachments
        .map((attachment) => attachment.previewUrl)
        .filter((value): value is string => typeof value === 'string' && value.length > 0),
    );
    const preserveUploadedAttachmentIds = new Set(
      originalDraftAttachments
        .map((attachment) => attachment.uploadedAttachment?.id)
        .filter((value): value is string => typeof value === 'string' && value.length > 0),
    );
    const clientGeneratedId = createClientGeneratedMessageId();
    const currentViewerParticipant =
      activeThread.participants.find((participant) => participant.memberId === viewerMemberId) ??
      null;
    const optimisticAttachments =
      buildOptimisticAttachmentsFromDraftAttachments(originalDraftAttachments);
    const optimisticMessage = buildOptimisticMessage({
      viewerMemberId,
      threadId: currentThreadId,
      body,
      attachments: optimisticAttachments,
      clientGeneratedId,
      currentUserName: currentViewerParticipant?.fullName,
      currentUserAvatar: currentViewerParticipant?.avatar,
      replyTo: originalReplyTarget,
    });

    discardDraftComposer({
      preservePreviewUrls,
      preserveUploadedAttachmentIds,
    });
    addOptimisticMessage(currentThreadId, optimisticMessage);

    try {
      const resolvedAttachments: MessageAttachment[] = [];

      for (const draftAttachment of originalDraftAttachments) {
        const uploadedAttachment =
          draftAttachment.uploadedAttachment ??
          (await uploadAttachment.mutateAsync({
            ...draftAttachment.uploadRequest,
            threadId: currentThreadId,
          }));

        uploadedByDraftId.set(draftAttachment.id, uploadedAttachment);
        resolvedAttachments.push(uploadedAttachment);

        if (draftAttachment.previewUrl) {
          registerMessageAttachmentPreview(uploadedAttachment.id, draftAttachment.previewUrl);
          preservePreviewUrls.add(draftAttachment.previewUrl);
          preserveUploadedAttachmentIds.add(uploadedAttachment.id);
        }
      }

      const request = buildSendMessageRequest({
        viewerMemberId,
        threadId: currentThreadId,
        body,
        attachments: resolvedAttachments,
        replyToMessageId: originalReplyTarget?.messageId,
        clientGeneratedId,
      });
      const response = await sendMessage.mutateAsync(request);

      removeOptimisticMessage(currentThreadId, optimisticMessage.id);
      queryClient.setQueryData(
        messageKeys.thread(viewerMemberId, response.thread.id),
        response.thread,
      );

      if (response.thread.id !== currentThreadId) {
        queryClient.removeQueries({
          queryKey: messageKeys.thread(viewerMemberId, currentThreadId),
          exact: true,
        });
        setSelectedThreadId(response.thread.id);
        replaceMessagesSearch(response.thread.id);
      }
    } catch (error) {
      removeOptimisticMessage(currentThreadId, optimisticMessage.id);
      setDraftMessage(originalDraftMessage);
      setReplyTarget(originalReplyTarget);
      setDraftAttachments(
        originalDraftAttachments.map((attachment) => ({
          ...attachment,
          uploadedAttachment: uploadedByDraftId.get(attachment.id) ?? attachment.uploadedAttachment,
        })),
      );
    } finally {
      sendInFlightRef.current = false;
    }
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Enter' || event.shiftKey) return;

    event.preventDefault();
    void handleSendMessage();
  }

  const refreshIndicatorVisible = pullToRefresh.pullDistance > 0 || pullToRefresh.isRefreshing;
  const refreshLabel = pullToRefresh.isRefreshing
    ? 'Refreshing conversations'
    : pullToRefresh.isArmed
      ? 'Release to refresh'
      : 'Pull to refresh';
  const voiceRecordingActive = voiceRecordingState === 'recording';
  const voiceRecordingBusy = voiceRecordingState !== 'idle';
  const voiceRecordingLabel =
    voiceRecordingState === 'starting'
      ? 'Preparing microphone'
      : voiceRecordingState === 'finishing'
        ? 'Preparing voice note preview'
        : 'Recording voice note';
  const voiceRecordingHint =
    voiceRecordingState === 'starting'
      ? 'Grant microphone access to begin.'
      : voiceRecordingState === 'finishing'
        ? 'Release complete. Building the preview.'
        : 'Keep holding the mic button. Release to preview.';
  const composerDisabled = !activeThread || sendMessage.isPending || voiceRecordingBusy;
  const attachmentsDisabled =
    composerDisabled || !activeThread?.attachmentsEnabled || uploadAttachment.isPending;
  const audioDisabled =
    !activeThread ||
    !activeThread.audioEnabled ||
    uploadAttachment.isPending ||
    sendMessage.isPending ||
    voiceRecordingState === 'finishing';
  const voiceRecordTooltip = !activeThread
    ? 'Select a conversation first.'
    : !activeThread.audioEnabled
      ? 'Voice notes are not available in this conversation.'
      : voiceRecordingBusy
        ? 'Release to finish recording.'
        : 'Hold to record a voice note.';
  const canSend =
    !!activeThread &&
    !sendMessage.isPending &&
    !voiceRecordingBusy &&
    (draftMessage.trim().length > 0 || draftAttachments.length > 0);

  return (
    <>
      <SEO
        title="Messages"
        description="Stay in touch with alumnae conversations and follow-ups."
      />
      <div className="lg:hidden">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Page background matching Figma off-white */}
      <section
        {...pullToRefresh.bind}
        className="section relative bg-[#f0ede8] lg:h-[calc(100dvh-4.75rem)] lg:overflow-hidden lg:py-4"
      >
        <div className="container-custom space-y-4 lg:flex lg:h-full lg:min-h-0 lg:max-w-[1560px] lg:flex-col lg:space-y-0">
          {/* Pull-to-refresh indicator */}
          <div className="flex justify-center lg:pointer-events-none lg:absolute lg:left-1/2 lg:top-2 lg:z-20 lg:w-fit lg:-translate-x-1/2">
            <div
              className={`flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-600 shadow-sm transition-all duration-200 ${
                refreshIndicatorVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              style={{ transform: `translateY(${Math.min(pullToRefresh.pullDistance, 18)}px)` }}
            >
              <Icon
                icon={pullToRefresh.isRefreshing ? 'mdi:loading' : 'mdi:refresh'}
                className={`h-4 w-4 ${pullToRefresh.isRefreshing ? 'animate-spin' : ''}`}
              />
              <span>{refreshLabel}</span>
            </div>
          </div>

          {/* Page title */}
          <div className="shrink-0 space-y-1 pt-1 lg:pb-3">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-950 sm:text-4xl lg:text-[2.5rem] xl:text-[2.75rem]">
              Message Centre
            </h1>
          </div>

          {/* Two-column layout */}
          <section className="grid gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(20rem,26rem)_minmax(0,1fr)] lg:gap-4 xl:grid-cols-[24rem_minmax(0,1fr)] 2xl:grid-cols-[26rem_minmax(0,1fr)]">
            {/* ─── Inbox pane ─── */}
            <aside className="flex min-h-[42rem] flex-col overflow-hidden rounded-2xl bg-white shadow-sm lg:h-full lg:min-h-0">
              {/* Search + filters */}
              <div className="px-4 pb-3 pt-4">
                <label className="relative block">
                  <Icon
                    icon="mdi:magnify"
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search chats"
                    className="w-full rounded-full border-0 bg-gray-100 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                {/* Filters — only All + Unread per Figma */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {inboxFilters.map((item) => {
                    const active = filter === item.key;
                    const label =
                      item.key === 'unread' ? `${item.label} (${unreadMessageCount})` : item.label;

                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setFilter(item.key)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                          active
                            ? 'bg-blue-100 text-blue-700'
                            : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Thread list */}
              <div className="flex-1 overflow-y-auto">
                {inboxQuery.isLoading && !inboxQuery.data ? (
                  <div className="space-y-px px-2 py-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="animate-pulse rounded-xl px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 flex-shrink-0 rounded-full bg-gray-100" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3.5 w-1/2 rounded-full bg-gray-100" />
                            <div className="h-3 w-3/4 rounded-full bg-gray-50" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : inboxQuery.error && !inboxQuery.data ? (
                  <EmptyState
                    icon="mdi:chat-alert-outline"
                    title="Could not load inbox"
                    description="Pull down to retry."
                    actionLabel="Refresh"
                    onAction={() => void refreshAll()}
                  />
                ) : inboxThreads.length === 0 ? (
                  <EmptyState
                    icon="mdi:message-outline"
                    title="No messages yet"
                    description="Your conversations will appear here."
                  />
                ) : visibleThreads.length === 0 ? (
                  <EmptyState
                    icon="mdi:message-text-outline"
                    title="No results"
                    description="Try a different filter or search term."
                  />
                ) : (
                  <div className="py-1">
                    {visibleThreads.map((thread) => {
                      const isActive = activeThreadId === thread.id;

                      return (
                        <button
                          key={thread.id}
                          type="button"
                          onClick={() => {
                            setSelectedThreadId(thread.id);
                            replaceMessagesSearch(thread.id);
                          }}
                          className={`relative w-full px-4 py-3 text-left transition-colors ${
                            isActive ? 'bg-gray-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          {/* Active indicator: blue left border like Figma */}
                          {isActive ? (
                            <span className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-blue-600" />
                          ) : null}

                          <div className="flex items-center gap-3">
                            <ThreadAvatar thread={thread} size="sm" />

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className="truncate text-sm font-semibold text-gray-900">
                                  {thread.title}
                                </p>
                                <span className="flex-shrink-0 text-xs text-gray-400">
                                  {formatThreadTimestamp(thread.lastActivityAt)}
                                </span>
                              </div>

                              <div className="mt-0.5 flex items-center justify-between gap-2">
                                <p className="line-clamp-1 text-sm text-gray-500">
                                  {getThreadPreview(thread)}
                                </p>
                                {thread.unreadCount > 0 ? (
                                  <span className="flex-shrink-0 inline-flex min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                                    {thread.unreadCount}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </aside>

            {/* ─── Active thread pane ─── */}
            <article className="flex min-h-[42rem] flex-col overflow-hidden rounded-2xl bg-white shadow-sm lg:h-full lg:min-h-0">
              {threadShell || (activeThreadId && threadQuery.isLoading) ? (
                <>
                  {/* Thread header */}
                  {threadShell ? (
                    <header className="flex items-center gap-4 border-b border-gray-100 px-5 py-4">
                      <ThreadAvatar thread={threadShell} />

                      <div className="min-w-0 flex-1">
                        <h2 className="truncate text-base font-semibold text-gray-900">
                          {threadShell.title}
                        </h2>
                        <p className="mt-0.5 truncate text-sm text-gray-500">
                          {threadShell.subtitle || formatThreadHeaderSubtitle(threadShell)}
                        </p>

                        {/* Group participants button */}
                        {threadShell.type === 'group' && groupParticipants.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => setParticipantsModalOpen(true)}
                            className="mt-2 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-left text-xs font-medium text-gray-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <div className="flex -space-x-1.5">
                              {previewGroupParticipants.map((participant) => (
                                <div
                                  key={participant.memberId}
                                  className="rounded-full border border-white"
                                >
                                  <ParticipantAvatar participant={participant} size="sm" />
                                </div>
                              ))}
                              {groupParticipants.length > previewGroupParticipants.length ? (
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white bg-gray-200 text-[10px] font-semibold text-gray-600">
                                  +{groupParticipants.length - previewGroupParticipants.length}
                                </span>
                              ) : null}
                            </div>
                            <span>
                              {groupAdminParticipant
                                ? `${groupAdminParticipant.fullName} is admin`
                                : `${groupParticipants.length} members`}
                            </span>
                            <Icon icon="mdi:chevron-right" className="h-3.5 w-3.5 text-gray-400" />
                          </button>
                        ) : null}
                      </div>

                      {/* Header action icons matching Figma (phone + video) */}
                      <div className="flex items-center gap-1">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100">
                          <Icon icon="mdi:phone-outline" className="h-5 w-5" />
                        </span>
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100">
                          <Icon icon="mdi:video-outline" className="h-5 w-5" />
                        </span>
                      </div>
                    </header>
                  ) : (
                    <header className="border-b border-gray-100 px-5 py-4">
                      <div className="flex animate-pulse items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gray-100" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-36 rounded-full bg-gray-100" />
                          <div className="h-3 w-48 rounded-full bg-gray-50" />
                        </div>
                      </div>
                    </header>
                  )}

                  {/* Message pane */}
                  <div ref={messagePaneRef} className="flex-1 overflow-y-auto bg-white px-5 py-5">
                    {threadQuery.isLoading && !activeThread ? (
                      <div className="space-y-5">
                        {Array.from({ length: 3 }).map((_, index) => (
                          <div
                            key={index}
                            className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                          >
                            <div className="w-64 animate-pulse rounded-2xl bg-gray-100 px-4 py-5" />
                          </div>
                        ))}
                      </div>
                    ) : threadQuery.error ? (
                      <EmptyState
                        icon="mdi:chat-remove-outline"
                        title="Conversation unavailable"
                        description="Refresh to reload."
                        actionLabel="Refresh"
                        onAction={() => void refreshAll()}
                      />
                    ) : activeThreadWithOptimisticMessages ? (
                      <div className="space-y-1">
                        {activeThreadWithOptimisticMessages.messages.map((message, index) => {
                          const previousMessage =
                            activeThreadWithOptimisticMessages.messages[index - 1];
                          const showDayDivider =
                            !previousMessage ||
                            new Date(previousMessage.createdAt).toDateString() !==
                              new Date(message.createdAt).toDateString();
                          const showSenderName =
                            activeThreadWithOptimisticMessages.type === 'group' &&
                            !message.isOwn &&
                            (!previousMessage ||
                              previousMessage.senderMemberId !== message.senderMemberId ||
                              showDayDivider);

                          // Group messages by sender: show timestamp label above first in a cluster
                          const isFirstInCluster =
                            !previousMessage ||
                            previousMessage.senderMemberId !== message.senderMemberId ||
                            showDayDivider ||
                            new Date(message.createdAt).getTime() -
                              new Date(previousMessage.createdAt).getTime() >
                              5 * 60 * 1000;

                          return (
                            <Fragment key={message.id}>
                              {/* Day divider — simple centered text like Figma */}
                              {showDayDivider ? (
                                <div className="py-4 text-center">
                                  <span className="text-xs text-gray-400">
                                    {formatConversationDay(message.createdAt)}
                                  </span>
                                </div>
                              ) : null}

                              {/* Timestamp above cluster — aligned by sender side */}
                              {isFirstInCluster && !showDayDivider ? (
                                <div
                                  className={`pt-3 pb-1 text-xs text-gray-400 ${
                                    message.isOwn ? 'text-right' : 'text-left'
                                  }`}
                                >
                                  {formatConversationDay(message.createdAt)}{' '}
                                  {formatMessageTime(message.createdAt)}
                                </div>
                              ) : null}

                              <div
                                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  data-message-id={message.id}
                                  className={`group relative w-fit max-w-[75%] sm:max-w-[60%] transition-all duration-300 ${
                                    highlightedMessageId === message.id
                                      ? 'ring-2 ring-blue-300 ring-offset-2 rounded-2xl'
                                      : ''
                                  }`}
                                >
                                  {showSenderName ? (
                                    <p className="mb-1 px-1 text-xs font-semibold text-gray-500">
                                      {message.senderDisplayName}
                                    </p>
                                  ) : null}

                                  {/* Actions button */}
                                  {message.status !== 'sending' && !message.deletedAt ? (
                                    <div
                                      data-message-actions-root="true"
                                      className={`absolute top-2 z-10 ${
                                        message.isOwn ? 'left-2' : 'right-2'
                                      }`}
                                    >
                                      <button
                                        type="button"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          handleToggleMessageActions(message, event.currentTarget);
                                        }}
                                        className={`inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-all ${
                                          openMessageActions?.messageId === message.id
                                            ? 'text-gray-700 opacity-100'
                                            : 'text-gray-400 opacity-0 group-hover:opacity-100'
                                        }`}
                                        aria-label="Message actions"
                                      >
                                        <Icon icon="mdi:dots-horizontal" className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  ) : null}

                                  {/* Bubble — Figma: received = white/light gray, sent = light blue */}
                                  <div
                                    className={`rounded-2xl px-4 py-2.5 ${
                                      message.isOwn
                                        ? 'bg-[#dbeafe] text-gray-900'
                                        : 'bg-[#f3f4f6] text-gray-900'
                                    }`}
                                  >
                                    {message.replyTo && !message.deletedAt ? (
                                      <ReplyPreviewCard
                                        replyTo={message.replyTo}
                                        variant="bubble"
                                        onOpenOriginal={handleJumpToMessage}
                                      />
                                    ) : null}

                                    {message.body ? (
                                      <p className="whitespace-pre-wrap text-[14.5px] leading-6">
                                        {message.body}
                                      </p>
                                    ) : null}

                                    {message.attachments.length > 0 ? (
                                      <MessageAttachments
                                        attachments={message.attachments}
                                        isOwn={message.isOwn}
                                        onOpenImage={setActiveImageAttachment}
                                      />
                                    ) : null}
                                  </div>

                                  {/* Delivery status — only for own messages, below bubble */}
                                  {message.isOwn ? (
                                    <div className="mt-1 flex items-center justify-end gap-1 px-1 text-[11px] text-gray-400">
                                      <Icon
                                        icon={
                                          message.status === 'seen' ? 'mdi:check-all' : 'mdi:check'
                                        }
                                        className="h-3 w-3"
                                      />
                                      <span>{deliveryLabel(message.status)}</span>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </Fragment>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex h-full min-h-[28rem] items-center justify-center">
                        <div className="rounded-full bg-blue-50 px-6 py-3 text-sm font-medium text-blue-600">
                          Select a chat to start messaging
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Composer footer */}
                  <footer className="border-t border-gray-100 px-4 py-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept={MESSAGE_ATTACHMENT_FILE_INPUT_ACCEPT}
                      className="hidden"
                      onChange={handleFileSelection}
                    />

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
                      {replyTarget ? (
                        <ReplyPreviewCard
                          replyTo={replyTarget}
                          variant="composer"
                          onClear={() => setReplyTarget(null)}
                        />
                      ) : null}

                      <DraftComposerAttachments
                        attachments={draftAttachments}
                        onRemove={removeDraftAttachment}
                      />

                      {voiceRecordingBusy ? (
                        <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-rose-900">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span
                              className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                                voiceRecordingActive ? 'animate-pulse bg-rose-500' : 'bg-rose-400'
                              }`}
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold">{voiceRecordingLabel}</p>
                              <p className="text-xs text-rose-700">{voiceRecordingHint}</p>
                            </div>
                          </div>

                          <span className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-rose-700 shadow-sm">
                            {formatRecordingDuration(voiceRecordingDurationMs)}
                          </span>
                        </div>
                      ) : null}

                      <textarea
                        value={draftMessage}
                        onChange={(event) => setDraftMessage(event.target.value)}
                        onKeyDown={handleComposerKeyDown}
                        disabled={composerDisabled}
                        rows={2}
                        placeholder={
                          activeThread
                            ? 'Write a message...'
                            : 'Select a conversation to start typing'
                        }
                        className="w-full resize-none border-0 bg-transparent text-[14.5px] text-gray-900 outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
                      />

                      <div className="mt-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                          {/* Attach file */}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={attachmentsDisabled}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Attach file"
                          >
                            <Icon icon="mdi:paperclip" className="h-4.5 w-4.5" />
                          </button>

                          {/* Voice note */}
                          <div className="group relative">
                            <button
                              type="button"
                              ref={voiceRecordButtonRef}
                              onPointerDown={handleVoiceRecordPointerDown}
                              onPointerUp={handleVoiceRecordPointerUp}
                              onPointerCancel={handleVoiceRecordPointerUp}
                              onKeyDown={handleVoiceRecordKeyDown}
                              onKeyUp={handleVoiceRecordKeyUp}
                              disabled={audioDisabled}
                              title={voiceRecordTooltip}
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                                voiceRecordingBusy
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'text-gray-400 hover:bg-gray-200 hover:text-gray-600'
                              }`}
                              aria-label="Hold to record a voice note"
                            >
                              <Icon
                                icon={
                                  voiceRecordingState === 'starting' ||
                                  voiceRecordingState === 'finishing'
                                    ? 'mdi:loading'
                                    : voiceRecordingActive
                                      ? 'mdi:microphone'
                                      : 'mdi:microphone-outline'
                                }
                                className={`h-4.5 w-4.5 ${
                                  voiceRecordingState === 'starting' ||
                                  voiceRecordingState === 'finishing'
                                    ? 'animate-spin'
                                    : ''
                                }`}
                              />
                            </button>

                            <span className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-800 px-2.5 py-1.5 text-xs text-white shadow-sm group-hover:inline-flex">
                              {voiceRecordTooltip}
                            </span>
                          </div>
                        </div>

                        {/* Send button */}
                        <button
                          type="button"
                          onClick={() => void handleSendMessage()}
                          disabled={!canSend}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-200"
                          aria-label="Send message"
                        >
                          <Icon
                            icon={sendMessage.isPending ? 'mdi:loading' : 'mdi:send'}
                            className={`h-4 w-4 ${sendMessage.isPending ? 'animate-spin' : ''}`}
                          />
                        </button>
                      </div>
                    </div>
                  </footer>
                </>
              ) : (
                <div className="flex h-full min-h-[42rem] items-center justify-center">
                  <div className="rounded-full bg-blue-50 px-6 py-3 text-sm font-medium text-blue-600 shadow-sm">
                    Select a chat to start messaging
                  </div>
                </div>
              )}
            </article>

            {/* Message actions context menu */}
            {openMessageActions && openMessageActionsMessage ? (
              <div
                data-message-actions-root="true"
                style={openMessageActions.style}
                className="z-50 w-40 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl"
              >
                <button
                  type="button"
                  onClick={() => void handleReplyToMessage()}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Icon icon="mdi:reply-outline" className="h-4 w-4" />
                  Reply
                </button>
                {canCopyOpenMessage ? (
                  <button
                    type="button"
                    onClick={() => void handleCopyMessage(openMessageActionsMessage)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Icon icon="mdi:content-copy" className="h-4 w-4" />
                    Copy
                  </button>
                ) : null}
                {openMessageActionsMessage.isOwn ? (
                  <button
                    type="button"
                    onClick={() => void handleDeleteMessage()}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <Icon icon="mdi:delete-outline" className="h-4 w-4" />
                    Delete
                  </button>
                ) : null}
              </div>
            ) : null}
          </section>
        </div>
      </section>

      <ImageAttachmentLightbox
        attachment={activeImageAttachment}
        onClose={() => setActiveImageAttachment(null)}
      />
      <GroupParticipantsModal
        isOpen={participantsModalOpen}
        onClose={() => setParticipantsModalOpen(false)}
        threadTitle={threadShell?.title ?? 'Group members'}
        participants={groupParticipants}
        viewerMemberId={viewerMemberId}
      />
    </>
  );
}
