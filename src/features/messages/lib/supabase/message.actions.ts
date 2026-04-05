import type { AuthSessionUser } from '@/features/authentication/types/auth.types';
import type { SendMessageRequest, SendMessageResponse } from '../../api/messages.contract';
import { getMessagesSupabaseClient, isMessagesSupabaseConfigured } from '.';
import { ensureSupabaseThreadForThreadDetail } from './thread.actions';
import type { MessageInsert, MessageRow } from './types';

const MESSAGE_LOG_PREFIX = '[messages/supabase] messageMirror';

function buildMessageType(request: SendMessageRequest) {
  if (request.attachments?.length) {
    return request.body?.trim() ? 'mixed' : (request.attachments[0]?.kind ?? 'attachment');
  }

  return 'text';
}

function buildLastMessagePreview(request: SendMessageRequest) {
  const trimmedBody = request.body?.trim();
  if (trimmedBody) {
    return trimmedBody;
  }

  if (request.attachments?.length) {
    const firstAttachment = request.attachments[0];

    if (firstAttachment?.kind === 'audio') return 'Voice note';
    if (firstAttachment?.kind === 'image') return 'Image';
    return 'Attachment';
  }

  return '';
}

async function findExistingMirroredMessage(threadId: string, clientGeneratedId: string) {
  const supabase = getMessagesSupabaseClient();
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('thread_id', threadId)
    .eq('client_generated_id', clientGeneratedId)
    .order('created_at', { ascending: true })
    .limit(1);

  if (error) {
    console.error(`${MESSAGE_LOG_PREFIX}: failed while checking for an existing mirrored message`, {
      threadId,
      clientGeneratedId,
      error,
    });
    throw error;
  }

  return data?.[0] ?? null;
}

async function createMirroredMessage(payload: MessageInsert) {
  const supabase = getMessagesSupabaseClient();
  const { data, error } = await supabase.from('messages').insert(payload).select('*').single();

  if (error) {
    console.error(`${MESSAGE_LOG_PREFIX}: failed while creating mirrored message`, {
      payload,
      error,
    });
    throw error;
  }

  return data;
}

async function updateThreadAfterMessage(params: {
  threadId: string;
  message: MessageRow;
  senderDisplayName: string;
  preview: string;
}) {
  const supabase = getMessagesSupabaseClient();
  const payload = {
    updated_at: params.message.updated_at ?? params.message.created_at,
    last_message_id: params.message.id,
    last_message_at: params.message.created_at,
    last_message_preview: params.preview || null,
    last_message_sender_name: params.senderDisplayName,
  };

  const { data, error } = await supabase
    .from('message_threads')
    .update(payload)
    .eq('id', params.threadId)
    .select(
      'id, created_at, type, title, created_by, updated_at, last_message_id, last_message_at, category, direct_key, last_message_preview, last_message_sender_name, attachment_enabled, audio_enabled',
    )
    .single();

  if (error) {
    console.error(`${MESSAGE_LOG_PREFIX}: failed while updating thread after message create`, {
      threadId: params.threadId,
      payload,
      error,
    });
    throw error;
  }

  return data;
}

export async function mirrorMessageToSupabase(params: {
  currentUser: AuthSessionUser;
  request: SendMessageRequest;
  response: SendMessageResponse;
}) {
  if (!isMessagesSupabaseConfigured()) {
    console.warn(`${MESSAGE_LOG_PREFIX}: skipped because Supabase is not configured`);
    return null;
  }

  const mirroredThread = await ensureSupabaseThreadForThreadDetail({
    currentUser: params.currentUser,
    thread: params.response.thread,
  });

  if (!mirroredThread) {
    console.warn(`${MESSAGE_LOG_PREFIX}: skipped because no Supabase thread could be ensured`);
    return null;
  }

  const existingMessage = await findExistingMirroredMessage(
    mirroredThread.id,
    params.request.clientGeneratedId,
  );

  if (existingMessage) {
    console.log(`${MESSAGE_LOG_PREFIX}: message already mirrored, skipping insert`, {
      threadId: mirroredThread.id,
      messageId: existingMessage.id,
      clientGeneratedId: params.request.clientGeneratedId,
    });
    return existingMessage;
  }

  if (params.request.attachments?.length) {
    console.warn(`${MESSAGE_LOG_PREFIX}: attachments were present but are not mirrored yet`, {
      threadId: mirroredThread.id,
      attachmentCount: params.request.attachments.length,
    });
  }

  const payload: MessageInsert = {
    thread_id: mirroredThread.id,
    sender_member_id: params.currentUser.memberId,
    body: params.request.body?.trim() || null,
    updated_at: new Date().toISOString(),
    message_type: buildMessageType(params.request),
    deleted_at: null,
    client_generated_id: params.request.clientGeneratedId,
  };

  const createdMessage = await createMirroredMessage(payload);
  const updatedThread = await updateThreadAfterMessage({
    threadId: mirroredThread.id,
    message: createdMessage,
    senderDisplayName: params.currentUser.fullName,
    preview: buildLastMessagePreview(params.request),
  });

  console.log(`${MESSAGE_LOG_PREFIX}: message mirrored to Supabase`, {
    threadId: mirroredThread.id,
    messageId: createdMessage.id,
    clientGeneratedId: params.request.clientGeneratedId,
    threadSnapshot: updatedThread,
  });

  return createdMessage;
}
