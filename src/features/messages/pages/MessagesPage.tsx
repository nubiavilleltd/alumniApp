import { Icon } from '@iconify/react';
import {
  Fragment,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { SEO } from '@/shared/common/SEO';
import { Breadcrumbs } from '@/shared/components/ui/Breadcrumbs';
import EmptyState from '@/shared/components/ui/EmptyState';
import { toast } from '@/shared/components/ui/Toast';
import {
  buildFileAttachmentUploadRequest,
  buildSendMessageRequest,
  buildVoiceNoteUploadRequest,
  describeAttachmentForPreview,
  filterMessageThreads,
} from '../api/adapters/messages.adapter';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import {
  useCreateDirectMessageThread,
  useMarkMessageThreadRead,
  useMessageThread,
  useMessagesInbox,
  useSendMessage,
  useUploadMessageAttachment,
} from '../hooks/useMessages';
import type {
  MessageAttachment,
  MessageDeliveryStatus,
  MessageThreadDetail,
  MessageThreadFilter,
  MessageThreadSummary,
} from '../types/messages.types';

const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Messages' }];

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
}: {
  attachments: MessageAttachment[];
  isOwn: boolean;
}) {
  return (
    <div className="mt-3 space-y-2">
      {attachments.map((attachment) => (
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
        </div>
      ))}
    </div>
  );
}

export function MessagesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentUser = useAuthStore((state) => state.user);
  const viewerMemberId = currentUser?.memberId ?? '';
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [filter, setFilter] = useState<MessageThreadFilter>('all');
  const [query, setQuery] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const [draftAttachments, setDraftAttachments] = useState<MessageAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagePaneRef = useRef<HTMLDivElement | null>(null);
  const pendingDirectThreadIntentRef = useRef<string | null>(null);
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
  const threadShell = activeThread ?? resolvedThreadSummary;
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

  const pullToRefresh = usePullToRefresh({
    onRefresh: refreshAll,
    disabled: !viewerMemberId,
  });

  useEffect(() => {
    if (!requestedThreadId) return;

    setSelectedThreadId((current) => (current === requestedThreadId ? current : requestedThreadId));
  }, [requestedThreadId]);

  useEffect(() => {
    if (!viewerMemberId || !requestedRecipientId) return;

    if (requestedRecipientId === viewerMemberId) {
      replaceMessagesSearch();
      toast.info('Your inbox is ready whenever you want to follow up.');
      return;
    }

    const intentKey = `${requestedRecipientId}:${requestedTopic ?? ''}`;
    if (pendingDirectThreadIntentRef.current === intentKey) return;

    pendingDirectThreadIntentRef.current = intentKey;

    void createDirectThread
      .mutateAsync({
        viewerMemberId,
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
  }, [createDirectThread, requestedRecipientId, requestedTopic, viewerMemberId]);

  useEffect(() => {
    // Each thread keeps its own draft so attachments and text do not leak across chats.
    setDraftMessage('');
    setDraftAttachments([]);
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
    if (!container || !activeThread?.messages.length) return;

    const lastMessage = activeThread.messages[activeThread.messages.length - 1];
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
  }, [activeThread?.id, activeThread?.messages]);

  async function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (!viewerMemberId || !activeThread || files.length === 0) return;

    const nextAttachments: MessageAttachment[] = [];

    for (const file of files) {
      const attachment = await uploadAttachment.mutateAsync(
        buildFileAttachmentUploadRequest(file, viewerMemberId),
      );
      nextAttachments.push(attachment);
    }

    setDraftAttachments((previous) => [...previous, ...nextAttachments]);
  }

  async function handleAddVoiceNote() {
    if (!viewerMemberId || !activeThread) return;

    const attachment = await uploadAttachment.mutateAsync(
      buildVoiceNoteUploadRequest(viewerMemberId),
    );
    setDraftAttachments((previous) => [...previous, attachment]);
  }

  async function handleSendMessage() {
    if (!viewerMemberId || !activeThread) return;

    const body = draftMessage.trim();
    if (!body && draftAttachments.length === 0) return;

    await sendMessage.mutateAsync(
      buildSendMessageRequest({
        viewerMemberId,
        threadId: activeThread.id,
        body,
        attachments: draftAttachments,
      }),
    );

    setDraftMessage('');
    setDraftAttachments([]);
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
  const composerDisabled = !activeThread || sendMessage.isPending;
  const attachmentsDisabled =
    composerDisabled || !activeThread?.attachmentsEnabled || uploadAttachment.isPending;
  const audioDisabled =
    composerDisabled || !activeThread?.audioEnabled || uploadAttachment.isPending;
  const canSend =
    !!activeThread &&
    !sendMessage.isPending &&
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
                    description="Refresh to try the simulated transport again."
                    actionLabel="Refresh"
                    onAction={() => void refreshAll()}
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
                        description="Refresh to reload the simulated thread."
                        actionLabel="Refresh"
                        onAction={() => void refreshAll()}
                      />
                    ) : activeThread ? (
                      <div className="space-y-4">
                        {activeThread.messages.map((message, index) => {
                          const previousMessage = activeThread.messages[index - 1];
                          const showDayDivider =
                            !previousMessage ||
                            new Date(previousMessage.createdAt).toDateString() !==
                              new Date(message.createdAt).toDateString();
                          const showSenderName =
                            activeThread.type === 'group' &&
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
                    {/* Staged uploads let us mimic the backend attachment flow before websockets arrive. */}
                    {draftAttachments.length > 0 ? (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {draftAttachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3 py-2 text-sm text-accent-700"
                          >
                            <Icon icon={getAttachmentIcon(attachment.kind)} className="h-4 w-4" />
                            <span className="max-w-[14rem] truncate">
                              {describeAttachmentForPreview(attachment)}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setDraftAttachments((previous) =>
                                  previous.filter((item) => item.id !== attachment.id),
                                )
                              }
                              className="text-accent-400 transition-colors hover:text-accent-700"
                              aria-label={`Remove ${attachment.fileName}`}
                            >
                              <Icon icon="mdi:close-circle" className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileSelection}
                    />

                    <div className="rounded-[1.75rem] border border-accent-200 bg-accent-50 p-4">
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
                            onClick={() => void handleAddVoiceNote()}
                            disabled={audioDisabled}
                            className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-white px-3 py-2 text-sm font-medium text-accent-700 transition-colors hover:border-primary-200 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Icon
                              icon={
                                uploadAttachment.isPending
                                  ? 'mdi:loading'
                                  : 'mdi:microphone-outline'
                              }
                              className={`h-4 w-4 ${uploadAttachment.isPending ? 'animate-spin' : ''}`}
                            />
                            Audio
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
    </>
  );
}
