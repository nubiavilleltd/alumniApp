import type { CSSProperties } from 'react';
import type { UploadMessageAttachmentRequest } from '../api/messages.contract';
import type { MessageAttachment } from '../types/messages.types';

export interface DraftComposerAttachment {
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

export interface OpenMessageActionsMenu {
  messageId: string;
  style: CSSProperties;
}

export interface ReplaceMessagesSearchOptions {
  initialMessage?: string;
  draftMessage?: string;
  marketplaceBusinessId?: string;
}
