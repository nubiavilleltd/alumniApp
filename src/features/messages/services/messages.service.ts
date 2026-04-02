import { withApiErrorHandling } from '@/lib/errors/apiErrorHandler';
import type {
  CreateDirectThreadRequest,
  CreateGroupThreadRequest,
  GetMessageThreadRequest,
  ListMessageThreadsRequest,
  MarkMessageThreadReadRequest,
  SendMessageRequest,
  UploadMessageAttachmentRequest,
} from '../api/messages.contract';
import { mockMessagesTransport } from '../lib/mockMessagesTransport';

// The page talks to this service instead of the mock directly. When the backend
// arrives, swap the transport implementation and keep the rest of the feature.
const activeMessagesTransport = mockMessagesTransport;

export const messagesService = {
  getInbox(request: ListMessageThreadsRequest) {
    return withApiErrorHandling(
      () => activeMessagesTransport.listThreads(request),
      'Unable to load your messages inbox.',
      'messagesService.getInbox',
    );
  },

  getThread(request: GetMessageThreadRequest) {
    return withApiErrorHandling(
      () => activeMessagesTransport.getThread(request),
      'Unable to load this conversation.',
      'messagesService.getThread',
    );
  },

  uploadAttachment(request: UploadMessageAttachmentRequest) {
    return withApiErrorHandling(
      () => activeMessagesTransport.uploadAttachment(request),
      'Unable to prepare this attachment.',
      'messagesService.uploadAttachment',
    );
  },

  sendMessage(request: SendMessageRequest) {
    return withApiErrorHandling(
      () => activeMessagesTransport.sendMessage(request),
      'Unable to send your message.',
      'messagesService.sendMessage',
    );
  },

  markThreadRead(request: MarkMessageThreadReadRequest) {
    return withApiErrorHandling(
      () => activeMessagesTransport.markThreadRead(request),
      'Unable to mark this conversation as read.',
      'messagesService.markThreadRead',
    );
  },

  createDirectThread(request: CreateDirectThreadRequest) {
    return withApiErrorHandling(
      () => activeMessagesTransport.createDirectThread(request),
      'Unable to start a direct conversation.',
      'messagesService.createDirectThread',
    );
  },

  createGroupThread(request: CreateGroupThreadRequest) {
    return withApiErrorHandling(
      () => activeMessagesTransport.createGroupThread(request),
      'Unable to create this group conversation.',
      'messagesService.createGroupThread',
    );
  },
};
