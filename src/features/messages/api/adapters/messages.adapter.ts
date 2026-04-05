import type { SendMessageRequest, UploadMessageAttachmentRequest } from '../messages.contract';
import type {
  MessageAttachment,
  MessageThreadFilter,
  MessageThreadSummary,
} from '../../types/messages.types';

export const MESSAGE_ATTACHMENT_MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;
export const MESSAGE_MAX_ATTACHMENTS_PER_MESSAGE = 6;
export const MESSAGE_MAX_BODY_LENGTH = 4_000;
export const MESSAGE_ATTACHMENT_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv',
  'audio/mp4',
  'audio/mpeg',
  'audio/ogg',
  'audio/ogg;codecs=opus',
  'audio/wav',
  'audio/webm',
  'audio/webm;codecs=opus',
] as const;
export const MESSAGE_ATTACHMENT_FILE_INPUT_ACCEPT = MESSAGE_ATTACHMENT_ALLOWED_MIME_TYPES.join(',');

const allowedMessageAttachmentMimeTypes = new Set<string>(MESSAGE_ATTACHMENT_ALLOWED_MIME_TYPES);

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

function resolveAudioFileExtension(mimeType: string) {
  if (mimeType.includes('mp4')) return 'm4a';
  if (mimeType.includes('ogg')) return 'ogg';
  if (mimeType.includes('wav')) return 'wav';
  return 'webm';
}

export function isAllowedMessageAttachmentMimeType(mimeType: string) {
  return allowedMessageAttachmentMimeTypes.has(mimeType.trim().toLowerCase());
}

export function assertValidMessageBody(body?: string) {
  if (!body) return;

  const trimmedBody = body.trim();
  if (!trimmedBody) return;

  if (trimmedBody.length > MESSAGE_MAX_BODY_LENGTH) {
    throw new Error(
      `Messages must stay under ${MESSAGE_MAX_BODY_LENGTH.toLocaleString()} characters.`,
    );
  }
}

export function assertValidMessageAttachments(attachments?: MessageAttachment[]) {
  const safeAttachments = attachments ?? [];

  if (safeAttachments.length > MESSAGE_MAX_ATTACHMENTS_PER_MESSAGE) {
    throw new Error(
      `You can attach up to ${MESSAGE_MAX_ATTACHMENTS_PER_MESSAGE} files per message.`,
    );
  }
}

export function assertValidMessageAttachmentUploadRequest(
  request: Pick<UploadMessageAttachmentRequest, 'fileName' | 'mimeType' | 'sizeInBytes' | 'kind'>,
) {
  const trimmedFileName = request.fileName.trim();
  const normalizedMimeType = request.mimeType.trim().toLowerCase();

  if (!trimmedFileName) {
    throw new Error('Attachments must have a valid file name.');
  }

  if (!normalizedMimeType || !isAllowedMessageAttachmentMimeType(normalizedMimeType)) {
    throw new Error('That file type is not supported in chat yet.');
  }

  if (!Number.isFinite(request.sizeInBytes) || request.sizeInBytes <= 0) {
    throw new Error('Attachments must include a valid file size.');
  }

  if (request.sizeInBytes > MESSAGE_ATTACHMENT_MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `Attachments must be ${formatBytes(MESSAGE_ATTACHMENT_MAX_FILE_SIZE_BYTES)} or smaller.`,
    );
  }

  const expectedKind = resolveAttachmentKindFromMime(normalizedMimeType);
  if (request.kind !== expectedKind) {
    throw new Error('Attachment type does not match the selected file.');
  }
}

function writeAsciiToDataView(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

function buildSimulatedVoiceNoteBlob(durationSeconds: number) {
  const safeDurationSeconds = Math.max(1, Math.round(durationSeconds));
  const sampleRate = 8_000;
  const bitsPerSample = 16;
  const channelCount = 1;
  const bytesPerSample = bitsPerSample / 8;
  const frameCount = safeDurationSeconds * sampleRate;
  const dataSize = frameCount * channelCount * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeAsciiToDataView(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeAsciiToDataView(view, 8, 'WAVE');
  writeAsciiToDataView(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channelCount, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * channelCount * bytesPerSample, true);
  view.setUint16(32, channelCount * bytesPerSample, true);
  view.setUint16(34, bitsPerSample, true);
  writeAsciiToDataView(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  return new Blob([buffer], { type: 'audio/wav' });
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
    binary: file,
    kind: resolveAttachmentKindFromMime(file.type || 'application/octet-stream'),
    source: 'device',
  };
}

export function buildVoiceNoteUploadRequest(
  viewerMemberId: string,
  durationSeconds = 18 + Math.floor(Math.random() * 45),
): UploadMessageAttachmentRequest {
  const binary = buildSimulatedVoiceNoteBlob(durationSeconds);

  return {
    viewerMemberId,
    fileName: `voice-note-${Date.now()}.wav`,
    mimeType: binary.type || 'audio/wav',
    sizeInBytes: binary.size,
    binary,
    kind: 'audio',
    durationSeconds,
    source: 'microphone',
  };
}

export function buildRecordedVoiceNoteUploadRequest(params: {
  viewerMemberId: string;
  blob: Blob;
  durationSeconds: number;
}): UploadMessageAttachmentRequest {
  const fileExtension = resolveAudioFileExtension(params.blob.type || 'audio/webm');

  return {
    viewerMemberId: params.viewerMemberId,
    fileName: `voice-note-${Date.now()}.${fileExtension}`,
    mimeType: params.blob.type || 'audio/webm',
    sizeInBytes: params.blob.size,
    binary: params.blob,
    kind: 'audio',
    durationSeconds: params.durationSeconds,
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
