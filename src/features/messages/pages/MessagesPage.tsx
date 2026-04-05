import { Icon } from '@iconify/react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Fragment,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
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
  filterMessageThreads,
  formatBytes,
} from '../api/adapters/messages.adapter';
import type { UploadMessageAttachmentRequest } from '../api/messages.contract';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import {
  messageKeys,
  useCreateDirectMessageThread,
  useMarkMessageThreadRead,
  useMessageThread,
  useMessagesInbox,
  useSendMessage,
  useUploadMessageAttachment,
} from '../hooks/useMessages';
import {
  getMessageAttachmentPreviewUrl,
  registerMessageAttachmentPreview,
  revokeMessageAttachmentPreview,
} from '../lib/messageAttachmentPreviewRegistry';
import type {
  MessageAttachment,
  MessageDeliveryStatus,
  MessageItem,
  MessageThreadDetail,
  MessageThreadFilter,
  MessageThreadSummary,
} from '../types/messages.types';

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

const inboxFilters: { key: MessageThreadFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'pinned', label: 'Pinned' },
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
}): MessageItem {
  return {
    id: params.clientGeneratedId,
    threadId: params.threadId,
    senderMemberId: params.viewerMemberId,
    senderDisplayName: params.currentUserName ?? 'You',
    senderAvatar: params.currentUserAvatar,
    body: params.body?.trim() ?? '',
    createdAt: new Date().toISOString(),
    status: 'sending',
    attachments: params.attachments,
    isOwn: true,
  };
}

function presenceClasses(value?: MessageThreadSummary['presence']) {
  if (value === 'online') return 'bg-emerald-500';
  if (value === 'away') return 'bg-amber-400';
  return 'bg-accent-300';
}

function presenceLabel(value?: MessageThreadSummary['presence']) {
  if (value === 'online') return 'Online now';
  if (value === 'away') return 'Away right now';
  return 'Offline';
}

function formatThreadMeta(thread: MessageThreadSummary | MessageThreadDetail) {
  if (thread.type === 'group') {
    return `${thread.memberCount} members • ${thread.topic}`;
  }

  return `${presenceLabel(thread.presence)} • ${thread.topic}`;
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

function ThreadAvatar({
  thread,
  size = 'md',
}: {
  thread: MessageThreadSummary | MessageThreadDetail;
  size?: 'sm' | 'md';
}) {
  const sizeClasses =
    size === 'sm'
      ? 'h-12 w-12 rounded-2xl'
      : 'h-14 w-14 rounded-[1.25rem] sm:h-16 sm:w-16 sm:rounded-[1.5rem]';

  if (thread.type === 'group') {
    return (
      <div
        className={`flex ${sizeClasses} items-center justify-center bg-primary-50 text-primary-600`}
      >
        <Icon icon="mdi:account-group-outline" className="h-7 w-7" />
      </div>
    );
  }

  return (
    <div className="relative flex-shrink-0">
      {thread.avatar ? (
        <img src={thread.avatar} alt={thread.title} className={`${sizeClasses} object-cover`} />
      ) : (
        <div
          className={`flex ${sizeClasses} items-center justify-center bg-primary-100 text-base font-semibold text-primary-700`}
        >
          {thread.initials}
        </div>
      )}
      <span
        className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${presenceClasses(
          thread.presence,
        )}`}
      />
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
    <div className="mt-3 space-y-2">
      {attachments.map((attachment) => {
        const previewUrl = attachment.url ?? getMessageAttachmentPreviewUrl(attachment.id);

        if (attachment.kind === 'image' && previewUrl) {
          return (
            <button
              key={attachment.id}
              type="button"
              onClick={() => onOpenImage(attachment)}
              className={`group block w-full overflow-hidden rounded-[1.5rem] border text-left transition-transform hover:scale-[1.01] ${
                isOwn
                  ? 'border-primary-300/40 bg-white/10 text-white'
                  : 'border-accent-200 bg-white text-accent-800'
              }`}
            >
              <div className="relative">
                <img
                  src={previewUrl}
                  alt={attachment.fileName}
                  className="max-h-80 w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pb-4 pt-10 text-white">
                  <div className="flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{attachment.fileName}</p>
                      <p className="text-xs text-white/75">{attachment.sizeLabel}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90">
                      <Icon icon="mdi:arrow-expand-all" className="h-3.5 w-3.5" />
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
            className={`rounded-2xl border px-4 py-3 ${
              isOwn
                ? 'border-primary-300/40 bg-white/10 text-white'
                : 'border-accent-200 bg-white text-accent-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                  isOwn ? 'bg-white/15' : 'bg-primary-50 text-primary-600'
                }`}
              >
                <Icon icon={getAttachmentIcon(attachment.kind)} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{attachment.fileName}</p>
                <p className={`text-xs ${isOwn ? 'text-white/70' : 'text-accent-500'}`}>
                  {attachment.kind === 'audio' && attachment.durationSeconds
                    ? `${formatAudioDuration(attachment.durationSeconds)} • ${attachment.sizeLabel}`
                    : attachment.sizeLabel}
                </p>
              </div>
            </div>

            {attachment.kind === 'audio' && attachment.waveform ? (
              <div className="mt-3 flex h-9 items-end gap-1">
                {attachment.waveform.map((barHeight, index) => (
                  <span
                    key={`${attachment.id}-${index}`}
                    className={`block w-1 rounded-full ${isOwn ? 'bg-white/75' : 'bg-primary-200'}`}
                    style={{ height: `${Math.max(10, Math.round(barHeight * 0.45))}px` }}
                  />
                ))}
              </div>
            ) : null}

            {attachment.kind === 'audio' ? (
              previewUrl ? (
                <audio controls preload="metadata" src={previewUrl} className="mt-3 w-full" />
              ) : (
                <p className={`mt-3 text-xs ${isOwn ? 'text-white/70' : 'text-accent-500'}`}>
                  Audio playback is unavailable for this message right now.
                </p>
              )
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
    <div className="mb-4 space-y-3">
      <div className={`grid gap-3 ${attachments.length > 1 ? 'sm:grid-cols-2' : ''}`}>
        {attachments.map((attachment) => {
          if (attachment.kind === 'image' && attachment.previewUrl) {
            return (
              <div
                key={attachment.id}
                className="relative overflow-hidden rounded-[1.5rem] border border-accent-200 bg-slate-900 shadow-sm"
              >
                <img
                  src={attachment.previewUrl}
                  alt={attachment.fileName}
                  className="h-64 w-full object-cover sm:h-72"
                />
                <button
                  type="button"
                  onClick={() => onRemove(attachment.id)}
                  className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/75 text-white transition-colors hover:bg-slate-950"
                  aria-label={`Remove ${attachment.fileName}`}
                >
                  <Icon icon="mdi:close" className="h-5 w-5" />
                </button>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent px-4 pb-4 pt-10 text-white">
                  <p className="truncate text-sm font-semibold">{attachment.fileName}</p>
                  <p className="text-xs text-white/70">{attachment.sizeLabel}</p>
                </div>
              </div>
            );
          }

          if (attachment.kind === 'audio') {
            return (
              <div
                key={attachment.id}
                className="relative rounded-[1.5rem] border border-accent-200 bg-white px-4 py-4 text-accent-800 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => onRemove(attachment.id)}
                  className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-accent-400 transition-colors hover:bg-accent-100 hover:text-accent-700"
                  aria-label={`Remove ${attachment.fileName}`}
                >
                  <Icon icon="mdi:close" className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-3 pr-12">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                    <Icon icon="mdi:waveform" className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{attachment.fileName}</p>
                    <p className="text-xs text-accent-500">
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
                    className="mt-4 w-full"
                  />
                ) : (
                  <p className="mt-4 text-xs text-accent-500">
                    Playback preview is unavailable for this recording in the current browser.
                  </p>
                )}
              </div>
            );
          }

          return (
            <div
              key={attachment.id}
              className="relative flex items-center gap-3 rounded-[1.5rem] border border-accent-200 bg-white px-4 py-4 text-accent-800 shadow-sm"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <Icon icon={getAttachmentIcon(attachment.kind)} className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{attachment.fileName}</p>
                <p className="text-xs text-accent-500">
                  {attachment.kind === 'audio' && attachment.durationSeconds
                    ? `${formatAudioDuration(attachment.durationSeconds)} • ${attachment.sizeLabel}`
                    : attachment.sizeLabel}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(attachment.id)}
                className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-accent-400 transition-colors hover:bg-accent-100 hover:text-accent-700"
                aria-label={`Remove ${attachment.fileName}`}
              >
                <Icon icon="mdi:close" className="h-4 w-4" />
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={attachment.fileName}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Close image preview"
      >
        <Icon icon="mdi:close" className="h-5 w-5" />
      </button>

      <div
        className="w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 text-white sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold sm:text-base">{attachment.fileName}</p>
            <p className="text-xs text-white/60 sm:text-sm">{attachment.sizeLabel}</p>
          </div>

          <button
            type="button"
            onClick={() => window.open(previewUrl, '_blank', 'noopener,noreferrer')}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 transition-colors hover:border-white/30 hover:text-white"
          >
            <Icon icon="mdi:open-in-new" className="h-4 w-4" />
            Open separately
          </button>
        </div>

        <div className="flex max-h-[80vh] items-center justify-center bg-slate-950/70 p-4 sm:p-6">
          <img
            src={previewUrl}
            alt={attachment.fileName}
            className="max-h-[72vh] w-auto max-w-full rounded-[1.5rem] object-contain"
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
  const currentUser = useAuthStore((state) => state.user);
  const viewerMemberId = currentUser?.memberId ?? '';
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [filter, setFilter] = useState<MessageThreadFilter>('all');
  const [query, setQuery] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const [draftAttachments, setDraftAttachments] = useState<DraftComposerAttachment[]>([]);
  const [activeImageAttachment, setActiveImageAttachment] = useState<MessageAttachment | null>(
    null,
  );
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
  const pendingDirectThreadIntentRef = useRef<string | null>(null);
  const activeVoicePointerIdRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const recordingContextRef = useRef<{ viewerMemberId: string; threadId: string } | null>(null);
  const recordingStartedAtRef = useRef<number | null>(null);
  const stopVoiceRecordingAfterStartRef = useRef(false);
  const hasShownRecordingFallbackToastRef = useRef(false);
  const voiceRecordingModeRef = useRef<'live' | 'simulated' | null>(null);
  const deferredQuery = useDeferredValue(query);
  const requestedThreadId = searchParams.get('threadId');
  const requestedRecipientId = searchParams.get('recipient');
  const requestedTopic = searchParams.get('topic') ?? undefined;

  const inboxQuery = useMessagesInbox();
  const createDirectThread = useCreateDirectMessageThread();
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

    if (!selectedThreadId || !inboxThreads.some((thread) => thread.id === selectedThreadId)) {
      setSelectedThreadId(visibleThreads[0]?.id ?? inboxThreads[0]?.id ?? null);
    }
  }, [inboxThreads, requestedThreadId, selectedThreadId, visibleThreads]);

  const activeThreadSummary = selectedThreadId
    ? (inboxThreads.find((thread) => thread.id === selectedThreadId) ?? null)
    : null;
  const fallbackThreadSummary =
    !requestedThreadId && !selectedThreadId ? (visibleThreads[0] ?? inboxThreads[0] ?? null) : null;
  const resolvedThreadSummary = activeThreadSummary ?? fallbackThreadSummary;
  const activeThreadId = requestedThreadId ?? selectedThreadId ?? resolvedThreadSummary?.id ?? null;
  const threadQuery = useMessageThread(activeThreadId);
  const activeThread = threadQuery.data ?? null;
  const activeOptimisticMessages = activeThreadId
    ? (optimisticMessagesByThreadId[activeThreadId] ?? [])
    : [];
  const activeThreadWithOptimisticMessages =
    activeThread && activeOptimisticMessages.length > 0
      ? {
          ...activeThread,
          messages: [...activeThread.messages, ...activeOptimisticMessages],
        }
      : activeThread;
  const threadShell = activeThreadWithOptimisticMessages ?? resolvedThreadSummary;
  const unreadMessageCount = inboxQuery.data?.unreadCount ?? 0;

  function replaceMessagesSearch(nextThreadId?: string) {
    const nextSearch = new URLSearchParams();

    if (nextThreadId) {
      nextSearch.set('threadId', nextThreadId);
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
      const attachmentRequest = buildRecordedVoiceNoteUploadRequest({
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
    if (!requestedThreadId) return;

    setSelectedThreadId((current) => (current === requestedThreadId ? current : requestedThreadId));
  }, [requestedThreadId]);

  useEffect(() => {
    if (!currentUser?.memberId || !requestedRecipientId) return;

    if (requestedRecipientId === currentUser.memberId) {
      replaceMessagesSearch();
      toast.info('Your inbox is ready whenever you want to follow up.');
      return;
    }

    const intentKey = `${requestedRecipientId}:${requestedTopic ?? ''}`;
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
        replaceMessagesSearch(response.thread.id);
      })
      .catch(() => {
        pendingDirectThreadIntentRef.current = null;
      });
  }, [createDirectThread, currentUser, requestedRecipientId, requestedTopic]);

  useEffect(() => {
    // Each thread keeps its own draft so attachments and text do not leak across chats.
    discardDraftComposer();
  }, [activeThreadId]);

  useEffect(() => {
    if (
      !viewerMemberId ||
      !activeThread ||
      activeThread.unreadCount === 0 ||
      markThreadRead.isPending
    ) {
      return;
    }

    // Marking the active thread as read keeps the polling inbox state aligned with the open pane.
    markThreadRead.mutate({
      viewerMemberId,
      threadId: activeThread.id,
    });
  }, [activeThread, markThreadRead, viewerMemberId]);

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

  async function handleSendMessage() {
    if (!viewerMemberId || !activeThread) return;

    const currentThreadId = activeThread.id;
    const originalDraftMessage = draftMessage;
    const originalDraftAttachments = draftAttachments;
    const body = originalDraftMessage.trim();
    if (!body && originalDraftAttachments.length === 0) return;

    const uploadedByDraftId = new Map<string, MessageAttachment>();
    const preservePreviewUrls = new Set<string>();
    const preserveUploadedAttachmentIds = new Set<string>();
    const resolvedAttachments: MessageAttachment[] = [];

    for (const draftAttachment of originalDraftAttachments) {
      const uploadedAttachment =
        draftAttachment.uploadedAttachment ??
        (await uploadAttachment.mutateAsync(draftAttachment.uploadRequest));

      uploadedByDraftId.set(draftAttachment.id, uploadedAttachment);
      resolvedAttachments.push(uploadedAttachment);

      if (draftAttachment.kind === 'image' && draftAttachment.previewUrl) {
        registerMessageAttachmentPreview(uploadedAttachment.id, draftAttachment.previewUrl);
        preservePreviewUrls.add(draftAttachment.previewUrl);
        preserveUploadedAttachmentIds.add(uploadedAttachment.id);
      }
    }

    if (uploadedByDraftId.size > 0) {
      setDraftAttachments((previous) =>
        previous.map((attachment) => ({
          ...attachment,
          uploadedAttachment: uploadedByDraftId.get(attachment.id) ?? attachment.uploadedAttachment,
        })),
      );
    }

    const request = buildSendMessageRequest({
      viewerMemberId,
      threadId: currentThreadId,
      body,
      attachments: resolvedAttachments,
    });
    const optimisticMessage = buildOptimisticMessage({
      viewerMemberId,
      threadId: currentThreadId,
      body,
      attachments: resolvedAttachments,
      clientGeneratedId: request.clientGeneratedId,
      currentUserName: currentUser?.fullName,
      currentUserAvatar: currentUser?.photo,
    });

    discardDraftComposer({
      preservePreviewUrls,
      preserveUploadedAttachmentIds,
    });
    addOptimisticMessage(currentThreadId, optimisticMessage);

    try {
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
      setDraftAttachments(originalDraftAttachments);
      return;
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
      <Breadcrumbs items={breadcrumbItems} />

      <section
        {...pullToRefresh.bind}
        className="section bg-[radial-gradient(circle_at_top_left,_rgba(0,119,204,0.12),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_24%),linear-gradient(180deg,_#f8fbff,_#ffffff)]"
      >
        <div className="container-custom space-y-4">
          <div className="flex justify-center">
            <div
              className={`flex items-center gap-2 rounded-full border border-primary-100 bg-white/90 px-4 py-2 text-xs font-medium text-primary-700 shadow-sm transition-all duration-200 ${
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

          {/* The page stays intentionally simple: inbox on the left, active chat on the right. */}
          <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            {/* Inbox pane */}
            <aside className="flex min-h-[42rem] flex-col overflow-hidden rounded-[1.75rem] border border-accent-200 bg-white shadow-sm">
              <div className="border-b border-accent-100 px-5 py-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-500">
                      Inbox
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-accent-900">Messages</h2>
                    <p className="mt-1 text-sm text-accent-500">
                      {unreadMessageCount} unread across your active conversations
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void refreshAll()}
                      disabled={inboxQuery.isRefetching || threadQuery.isRefetching}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-accent-200 text-accent-600 transition-colors hover:border-primary-200 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label="Refresh messages"
                    >
                      <Icon
                        icon="mdi:refresh"
                        className={`h-5 w-5 ${
                          inboxQuery.isRefetching || threadQuery.isRefetching ? 'animate-spin' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <label className="relative mt-5 block">
                  <Icon
                    icon="mdi:magnify"
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-accent-400"
                  />
                  <input
                    // Browsers add their own search decoration to search inputs, so we use text here.
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search names, topics, or notes"
                    className="w-full rounded-xl border border-accent-200 bg-white py-3 pl-12 pr-4 text-accent-900 transition-all duration-200 placeholder:text-accent-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </label>

                <div className="mt-4 flex flex-wrap gap-2">
                  {inboxFilters.map((item) => {
                    const active = filter === item.key;

                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setFilter(item.key)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                          active
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'bg-accent-100 text-accent-700 hover:bg-accent-200'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-3">
                {inboxQuery.isLoading && !inboxQuery.data ? (
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className="animate-pulse rounded-[1.35rem] border border-accent-100 bg-accent-50 px-4 py-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 rounded-2xl bg-accent-200" />
                          <div className="flex-1 space-y-3">
                            <div className="h-4 w-2/3 rounded-full bg-accent-200" />
                            <div className="h-3 w-5/6 rounded-full bg-accent-100" />
                            <div className="h-3 w-1/2 rounded-full bg-accent-100" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : inboxQuery.error && !inboxQuery.data ? (
                  <EmptyState
                    icon="mdi:chat-alert-outline"
                    title="We could not load your inbox"
                    description="Refresh to try loading your conversations again."
                    actionLabel="Refresh"
                    onAction={() => void refreshAll()}
                  />
                ) : inboxThreads.length === 0 ? (
                  <EmptyState
                    icon="mdi:message-outline"
                    title="No messages yet"
                    description="Once conversations begin, they will appear here."
                  />
                ) : visibleThreads.length === 0 ? (
                  <EmptyState
                    icon="mdi:message-text-outline"
                    title="No conversations match that view"
                    description="Try a different filter or search term."
                  />
                ) : (
                  <div className="space-y-2">
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
                          className={`w-full rounded-[1.35rem] border px-4 py-4 text-left transition-all ${
                            isActive
                              ? 'border-primary-300 bg-primary-50 shadow-sm'
                              : 'border-transparent bg-white hover:border-accent-200 hover:bg-accent-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <ThreadAvatar thread={thread} size="sm" />

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <p className="truncate text-base font-semibold text-accent-900">
                                    {thread.title}
                                  </p>
                                  <p className="mt-0.5 truncate text-sm text-accent-500">
                                    {thread.subtitle}
                                  </p>
                                </div>

                                <div className="flex flex-shrink-0 flex-col items-end gap-2">
                                  <span className="text-xs font-medium text-accent-400">
                                    {formatThreadTimestamp(thread.lastActivityAt)}
                                  </span>

                                  {thread.unreadCount > 0 ? (
                                    <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-primary-600 px-2 py-0.5 text-xs font-semibold text-white">
                                      {thread.unreadCount}
                                    </span>
                                  ) : thread.isPinned ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-500">
                                      <Icon icon="mdi:pin" className="h-3.5 w-3.5" />
                                      Pinned
                                    </span>
                                  ) : null}
                                </div>
                              </div>

                              <p className="mt-3 line-clamp-2 text-sm leading-6 text-accent-600">
                                {getThreadPreview(thread)}
                              </p>

                              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-accent-500">
                                <span className="rounded-full bg-accent-100 px-2.5 py-1 font-medium text-accent-600">
                                  {thread.category}
                                </span>
                                <span className="truncate">{formatThreadMeta(thread)}</span>
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

            {/* Active thread pane */}
            <article className="flex min-h-[42rem] flex-col overflow-hidden rounded-[1.75rem] border border-accent-200 bg-white shadow-sm">
              {threadShell || (activeThreadId && threadQuery.isLoading) ? (
                <>
                  {threadShell ? (
                    <header className="border-b border-accent-100 px-5 py-5 sm:px-7">
                      <div className="flex items-center gap-4">
                        <ThreadAvatar thread={threadShell} />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="truncate text-2xl font-semibold text-accent-900 sm:text-3xl">
                              {threadShell.title}
                            </h2>
                            <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">
                              {threadShell.type === 'group' ? 'Group' : threadShell.category}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-sm text-accent-500 sm:text-base">
                            {threadShell.subtitle}
                          </p>
                          <p className="mt-2 text-sm text-accent-400">
                            {formatThreadMeta(threadShell)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => void refreshAll()}
                          disabled={inboxQuery.isRefetching || threadQuery.isRefetching}
                          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-accent-200 text-accent-600 transition-colors hover:border-primary-200 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                          aria-label="Refresh active conversation"
                        >
                          <Icon
                            icon="mdi:refresh"
                            className={`h-5 w-5 ${
                              inboxQuery.isRefetching || threadQuery.isRefetching
                                ? 'animate-spin'
                                : ''
                            }`}
                          />
                        </button>
                      </div>
                    </header>
                  ) : (
                    <header className="border-b border-accent-100 px-5 py-5 sm:px-7">
                      <div className="flex animate-pulse items-center gap-4">
                        <div className="h-14 w-14 rounded-[1.25rem] bg-accent-100 sm:h-16 sm:w-16 sm:rounded-[1.5rem]" />
                        <div className="min-w-0 flex-1 space-y-3">
                          <div className="h-6 w-40 rounded-full bg-accent-100" />
                          <div className="h-4 w-56 rounded-full bg-accent-50" />
                        </div>
                      </div>
                    </header>
                  )}

                  <div ref={messagePaneRef} className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
                    {threadQuery.isLoading && !activeThread ? (
                      <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                          <div
                            key={index}
                            className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                          >
                            <div className="w-full max-w-[32rem] animate-pulse rounded-[1.75rem] bg-accent-100 px-5 py-6" />
                          </div>
                        ))}
                      </div>
                    ) : threadQuery.error ? (
                      <EmptyState
                        icon="mdi:chat-remove-outline"
                        title="Conversation unavailable"
                        description="Refresh to reload this conversation."
                        actionLabel="Refresh"
                        onAction={() => void refreshAll()}
                      />
                    ) : activeThreadWithOptimisticMessages ? (
                      <div className="space-y-4">
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

                          return (
                            <Fragment key={message.id}>
                              {/* Day dividers make the polling timeline easier to scan. */}
                              {showDayDivider ? (
                                <div className="flex items-center gap-4 py-3">
                                  <div className="h-px flex-1 bg-accent-100" />
                                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-400">
                                    {formatConversationDay(message.createdAt)}
                                  </span>
                                  <div className="h-px flex-1 bg-accent-100" />
                                </div>
                              ) : null}

                              <div
                                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className="w-full max-w-[42rem]">
                                  {showSenderName ? (
                                    <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent-400">
                                      {message.senderDisplayName}
                                    </p>
                                  ) : null}

                                  <div
                                    className={`rounded-[1.75rem] px-5 py-4 shadow-sm ${
                                      message.isOwn
                                        ? 'bg-primary-600 text-white'
                                        : 'border border-accent-200 bg-white text-accent-800'
                                    }`}
                                  >
                                    {message.body ? (
                                      <p className="whitespace-pre-wrap text-[15px] leading-7">
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

                                  <div
                                    className={`mt-2 flex items-center gap-2 px-1 text-xs ${
                                      message.isOwn
                                        ? 'justify-end text-accent-400'
                                        : 'justify-start text-accent-400'
                                    }`}
                                  >
                                    <span>{formatMessageTime(message.createdAt)}</span>
                                    {message.isOwn ? (
                                      <span className="inline-flex items-center gap-1">
                                        <Icon
                                          icon={
                                            message.status === 'seen'
                                              ? 'mdi:check-all'
                                              : 'mdi:check'
                                          }
                                          className="h-3.5 w-3.5"
                                        />
                                        {deliveryLabel(message.status)}
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </Fragment>
                          );
                        })}
                      </div>
                    ) : (
                      <EmptyState
                        icon="mdi:message-text-fast-outline"
                        title="Select a conversation"
                        description="Choose a message from the inbox to open the thread."
                      />
                    )}
                  </div>

                  <footer className="border-t border-accent-100 px-5 py-5 sm:px-7">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept={MESSAGE_ATTACHMENT_FILE_INPUT_ACCEPT}
                      className="hidden"
                      onChange={handleFileSelection}
                    />

                    <div className="rounded-[1.75rem] border border-accent-200 bg-accent-50 p-4">
                      <DraftComposerAttachments
                        attachments={draftAttachments}
                        onRemove={removeDraftAttachment}
                      />

                      {voiceRecordingBusy ? (
                        <div className="mb-4 flex items-center justify-between gap-3 rounded-[1.5rem] border border-rose-200 bg-rose-50 px-4 py-3 text-rose-900">
                          <div className="flex min-w-0 items-center gap-3">
                            <span
                              className={`h-3 w-3 flex-shrink-0 rounded-full ${
                                voiceRecordingActive ? 'animate-pulse bg-rose-500' : 'bg-rose-400'
                              }`}
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold">{voiceRecordingLabel}</p>
                              <p className="text-xs text-rose-700">{voiceRecordingHint}</p>
                            </div>
                          </div>

                          <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-rose-700 shadow-sm">
                            {formatRecordingDuration(voiceRecordingDurationMs)}
                          </span>
                        </div>
                      ) : null}

                      <textarea
                        value={draftMessage}
                        onChange={(event) => setDraftMessage(event.target.value)}
                        onKeyDown={handleComposerKeyDown}
                        disabled={composerDisabled}
                        rows={3}
                        placeholder={
                          activeThread
                            ? `Message ${activeThread.title}...`
                            : 'Select a conversation to start typing'
                        }
                        className="w-full resize-none border-0 bg-transparent text-[15px] text-accent-900 outline-none placeholder:text-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
                      />

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={attachmentsDisabled}
                            className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-white px-3 py-2 text-sm font-medium text-accent-700 transition-colors hover:border-primary-200 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Icon icon="mdi:paperclip" className="h-4 w-4" />
                            File
                          </button>

                          <button
                            type="button"
                            ref={voiceRecordButtonRef}
                            onPointerDown={handleVoiceRecordPointerDown}
                            onPointerUp={handleVoiceRecordPointerUp}
                            onPointerCancel={handleVoiceRecordPointerUp}
                            onKeyDown={handleVoiceRecordKeyDown}
                            onKeyUp={handleVoiceRecordKeyUp}
                            disabled={audioDisabled}
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                              voiceRecordingBusy
                                ? 'border-rose-200 bg-rose-50 text-rose-700'
                                : 'border-accent-200 bg-white text-accent-700 hover:border-primary-200 hover:text-primary-600'
                            }`}
                            aria-label="Hold to record a voice note and release to send"
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
                              className={`h-4 w-4 ${
                                voiceRecordingState === 'starting' ||
                                voiceRecordingState === 'finishing'
                                  ? 'animate-spin'
                                  : ''
                              }`}
                            />
                            {voiceRecordingState === 'starting'
                              ? 'Starting...'
                              : voiceRecordingState === 'finishing'
                                ? 'Preparing...'
                                : voiceRecordingActive
                                  ? 'Release to preview'
                                  : 'Hold to talk'}
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => void handleSendMessage()}
                          disabled={!canSend}
                          className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-primary-200"
                        >
                          <Icon
                            icon={sendMessage.isPending ? 'mdi:loading' : 'mdi:send'}
                            className={`h-4 w-4 ${sendMessage.isPending ? 'animate-spin' : ''}`}
                          />
                          Send
                        </button>
                      </div>
                    </div>
                  </footer>
                </>
              ) : (
                <EmptyState
                  icon="mdi:message-badge-outline"
                  title="Your inbox is quiet"
                  description="Once conversations start, the active thread will appear here."
                />
              )}
            </article>
          </section>
        </div>
      </section>

      <ImageAttachmentLightbox
        attachment={activeImageAttachment}
        onClose={() => setActiveImageAttachment(null)}
      />
    </>
  );
}
