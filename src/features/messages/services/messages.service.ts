import { withApiErrorHandling } from '@/lib/errors/apiErrorHandler';
import type {
  CreateDirectThreadRequest,
  CreateGroupThreadRequest,
  DeleteMessageRequest,
  GetMessageThreadRequest,
  ListMessageThreadsRequest,
  MarkMessageThreadReadRequest,
  SendMessageRequest,
  UploadMessageAttachmentRequest,
} from '../api/messages.contract';
import { backendMessagesTransport } from '../lib/backendMessagesTransport';

const activeMessagesTransport = backendMessagesTransport;

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

  deleteMessage(request: DeleteMessageRequest) {
    return withApiErrorHandling(
      () => activeMessagesTransport.deleteMessage(request),
      'Unable to delete this message.',
      'messagesService.deleteMessage',
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
