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
import { isMessagesSupabaseConfigured } from '../lib/supabase';
import { supabaseMessagesTransport } from '../lib/supabase/messagesSupabaseTransport';
import { mockMessagesTransport } from '../lib/mockMessagesTransport';

const activeMessagesTransport = isMessagesSupabaseConfigured()
  ? supabaseMessagesTransport
  : mockMessagesTransport;
const activeMessagesTransportMode = isMessagesSupabaseConfigured() ? 'supabase' : 'mock';

export function isMockMessagesTransportActive() {
  return activeMessagesTransportMode === 'mock';
}

export function isSupabaseMessagesTransportActive() {
  return activeMessagesTransportMode === 'supabase';
}

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
