import type { SendMessageRequest, UploadMessageAttachmentRequest } from '../messages.contract';
import type {
  MessageAttachment,
  MessageThreadFilter,
  MessageThreadSummary,
} from '../../types/messages.types';

export function formatBytes(sizeInBytes: number) {
  if (sizeInBytes < 1024) return `${sizeInBytes} B`;
  if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function resolveAttachmentKindFromMime(mimeType: string): MessageAttachment['kind'] {
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.startsWith('image/')) return 'image';
  return 'file';
}

export function buildFileAttachmentUploadRequest(
  file: File,
  viewerMemberId: string,
): UploadMessageAttachmentRequest {
  return {
    viewerMemberId,
    fileName: file.name,
    mimeType: file.type || 'application/octet-stream',
    sizeInBytes: file.size,
    kind: resolveAttachmentKindFromMime(file.type || 'application/octet-stream'),
    source: 'device',
  };
}

export function buildVoiceNoteUploadRequest(
  viewerMemberId: string,
): UploadMessageAttachmentRequest {
  const durationSeconds = 18 + Math.floor(Math.random() * 45);

  return {
    viewerMemberId,
    fileName: `voice-note-${Date.now()}.m4a`,
    mimeType: 'audio/mp4',
    sizeInBytes: durationSeconds * 18_000,
    kind: 'audio',
    durationSeconds,
    source: 'microphone',
  };
}

export function buildSendMessageRequest(params: {
  viewerMemberId: string;
  threadId: string;
  body?: string;
  attachments?: MessageAttachment[];
}): SendMessageRequest {
  return {
    viewerMemberId: params.viewerMemberId,
    threadId: params.threadId,
    body: params.body?.trim() || undefined,
    attachments: params.attachments ?? [],
    clientGeneratedId: `client-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
}

export function sortMessageThreads(threads: MessageThreadSummary[]) {
  return [...threads].sort(
    (left, right) =>
      new Date(right.lastActivityAt).getTime() - new Date(left.lastActivityAt).getTime(),
  );
}

export function filterMessageThreads(
  threads: MessageThreadSummary[],
  filter: MessageThreadFilter,
  query: string,
  selectedThreadId: string | null,
) {
  const normalizedQuery = query.trim().toLowerCase();

  return sortMessageThreads(threads).filter((thread) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && (thread.unreadCount > 0 || thread.id === selectedThreadId)) ||
      (filter === 'pinned' && thread.isPinned);

    if (!matchesFilter) return false;
    if (!normalizedQuery) return true;

    const searchTarget = [
      thread.title,
      thread.subtitle,
      thread.topic,
      thread.lastMessagePreview,
      thread.category,
      thread.participants.map((participant) => participant.fullName).join(' '),
    ]
      .join(' ')
      .toLowerCase();

    return searchTarget.includes(normalizedQuery);
  });
}

export function describeAttachmentForPreview(attachment: MessageAttachment) {
  if (attachment.kind === 'audio') return `Audio · ${attachment.fileName}`;
  if (attachment.kind === 'image') return `Image · ${attachment.fileName}`;
  return `File · ${attachment.fileName}`;
}
