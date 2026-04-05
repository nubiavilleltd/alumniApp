import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type {
  MessageAttachment,
  MessageInboxData,
  MessageThreadCategory,
  MessageThreadDetail,
} from '../types/messages.types';

export const MESSAGE_POLLING_INTERVAL_MS = 6_000;

// This is the backend-facing contract for chat. The mock transport already
// follows it, so the future API can replace the mock without changing the page.
export const MESSAGES_API_CONTRACT = {
  LIST_THREADS: {
    method: 'GET',
    path: API_ENDPOINTS.MESSAGES.THREADS,
  },
  GET_THREAD: {
    method: 'GET',
    path: API_ENDPOINTS.MESSAGES.THREAD_DETAIL(':threadId'),
  },
  CREATE_DIRECT_THREAD: {
    method: 'POST',
    path: API_ENDPOINTS.MESSAGES.DIRECT_THREAD,
  },
  CREATE_GROUP_THREAD: {
    method: 'POST',
    path: API_ENDPOINTS.MESSAGES.GROUP_THREAD,
  },
  UPLOAD_ATTACHMENT: {
    method: 'POST',
    path: API_ENDPOINTS.MESSAGES.ATTACHMENTS,
  },
  SEND_MESSAGE: {
    method: 'POST',
    path: API_ENDPOINTS.MESSAGES.SEND_MESSAGE,
  },
  MARK_THREAD_READ: {
    method: 'POST',
    path: API_ENDPOINTS.MESSAGES.MARK_READ(':threadId'),
  },
  POLL_THREADS: {
    method: 'GET',
    path: API_ENDPOINTS.MESSAGES.POLL,
  },
} as const;

export interface ListMessageThreadsRequest {
  viewerMemberId: string;
  syncToken?: string;
  limit?: number;
}

export interface ListMessageThreadsResponse extends MessageInboxData {
  serverTime: string;
}

export interface GetMessageThreadRequest {
  viewerMemberId: string;
  threadId: string;
  limit?: number;
  beforeMessageId?: string;
}

export interface GetMessageThreadResponse {
  thread: MessageThreadDetail;
  serverTime: string;
  syncToken: string;
}

export interface UploadMessageAttachmentRequest {
  viewerMemberId: string;
  fileName: string;
  mimeType: string;
  sizeInBytes: number;
  binary?: Blob;
  kind: MessageAttachment['kind'];
  durationSeconds?: number;
  source: 'device' | 'microphone';
}

export interface UploadMessageAttachmentResponse {
  attachment: MessageAttachment;
  serverTime: string;
}

export interface SendMessageRequest {
  viewerMemberId: string;
  threadId: string;
  body?: string;
  attachments?: MessageAttachment[];
  clientGeneratedId: string;
}

export interface SendMessageResponse {
  thread: MessageThreadDetail;
  messageId: string;
  serverTime: string;
}

export interface MarkMessageThreadReadRequest {
  viewerMemberId: string;
  threadId: string;
}

export interface MarkMessageThreadReadResponse {
  threadId: string;
  unreadCount: number;
  serverTime: string;
}

export interface CreateDirectThreadRequest {
  viewerMemberId: string;
  participantMemberId: string;
  topic?: string;
}

export interface CreateDirectThreadResponse {
  thread: MessageThreadDetail;
  serverTime: string;
}

export interface CreateGroupThreadRequest {
  viewerMemberId: string;
  title: string;
  memberIds: string[];
  description?: string;
  topic?: string;
  category?: MessageThreadCategory;
}

export interface CreateGroupThreadResponse {
  thread: MessageThreadDetail;
  serverTime: string;
}

export interface MessagesTransport {
  listThreads(request: ListMessageThreadsRequest): Promise<ListMessageThreadsResponse>;
  getThread(request: GetMessageThreadRequest): Promise<GetMessageThreadResponse>;
  uploadAttachment(
    request: UploadMessageAttachmentRequest,
  ): Promise<UploadMessageAttachmentResponse>;
  sendMessage(request: SendMessageRequest): Promise<SendMessageResponse>;
  markThreadRead(request: MarkMessageThreadReadRequest): Promise<MarkMessageThreadReadResponse>;
  createDirectThread(request: CreateDirectThreadRequest): Promise<CreateDirectThreadResponse>;
  createGroupThread(request: CreateGroupThreadRequest): Promise<CreateGroupThreadResponse>;
}
