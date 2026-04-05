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

function nowIso() {
  return new Date().toISOString();
}

function createBackendNotReadyError(message: string) {
  return new Error(message);
}

export const placeholderMessagesTransport: MessagesTransport = {
  async listThreads(_: ListMessageThreadsRequest): Promise<ListMessageThreadsResponse> {
    const serverTime = nowIso();

    return {
      threads: [],
      unreadCount: 0,
      syncToken: `placeholder-${serverTime}`,
      pollingIntervalMs: MESSAGE_POLLING_INTERVAL_MS,
      serverTime,
    };
  },

  async getThread(_: GetMessageThreadRequest): Promise<GetMessageThreadResponse> {
    throw createBackendNotReadyError(
      'This conversation is not available until the messages backend is connected.',
    );
  },

  async uploadAttachment(
    _: UploadMessageAttachmentRequest,
  ): Promise<UploadMessageAttachmentResponse> {
    throw createBackendNotReadyError(
      'Attachment upload is not available until the messages backend is connected.',
    );
  },

  async sendMessage(_: SendMessageRequest): Promise<SendMessageResponse> {
    throw createBackendNotReadyError(
      'Message sending is not available until the messages backend is connected.',
    );
  },

  async markThreadRead(_: MarkMessageThreadReadRequest): Promise<MarkMessageThreadReadResponse> {
    throw createBackendNotReadyError(
      'Read state cannot be updated until the messages backend is connected.',
    );
  },

  async createDirectThread(_: CreateDirectThreadRequest): Promise<CreateDirectThreadResponse> {
    throw createBackendNotReadyError(
      'Direct messages are not available until the messages backend is connected.',
    );
  },

  async createGroupThread(_: CreateGroupThreadRequest): Promise<CreateGroupThreadResponse> {
    throw createBackendNotReadyError(
      'Group creation is not available until the messages backend is connected.',
    );
  },
};
