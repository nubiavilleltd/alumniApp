import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/authentication/stores/useAuthStore';
import { toast } from '@/shared/components/ui/Toast';
import { MESSAGE_POLLING_INTERVAL_MS } from '../api/messages.contract';
import type {
  CreateDirectThreadRequest,
  CreateGroupThreadRequest,
  DeleteMessageRequest,
  MarkMessageThreadReadRequest,
  SendMessageRequest,
  UploadMessageAttachmentRequest,
} from '../api/messages.contract';
import { messagesService } from '../services/messages.service';

export const messageKeys = {
  all: ['messages'] as const,
  inbox: (viewerMemberId: string) => [...messageKeys.all, 'inbox', viewerMemberId] as const,
  thread: (viewerMemberId: string, threadId: string) =>
    [...messageKeys.all, 'thread', viewerMemberId, threadId] as const,
};

export function useMessagesInbox() {
  const currentUser = useAuthStore((state) => state.user);
  const viewerMemberId = currentUser?.memberId ?? '';

  return useQuery({
    queryKey: messageKeys.inbox(viewerMemberId),
    queryFn: () => messagesService.getInbox({ viewerMemberId }),
    enabled: !!viewerMemberId,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    refetchInterval: (query) => query.state.data?.pollingIntervalMs ?? MESSAGE_POLLING_INTERVAL_MS,
  });
}

export function useMessageThread(threadId: string | null) {
  const currentUser = useAuthStore((state) => state.user);
  const viewerMemberId = currentUser?.memberId ?? '';

  return useQuery({
    queryKey: messageKeys.thread(viewerMemberId, threadId ?? ''),
    queryFn: async () => {
      if (!threadId) return null;
      const response = await messagesService.getThread({ viewerMemberId, threadId });
      return response.thread;
    },
    enabled: !!viewerMemberId && !!threadId,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    refetchInterval: (query) => query.state.data?.pollingIntervalMs ?? MESSAGE_POLLING_INTERVAL_MS,
  });
}

export function useUploadMessageAttachment() {
  const currentUser = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (request: UploadMessageAttachmentRequest) => {
      if (!currentUser?.memberId) {
        throw new Error('You must be logged in to upload attachments.');
      }

      const response = await messagesService.uploadAttachment(request);
      return response.attachment;
    },
    onError: (error: any) => {
      toast.fromError(error);
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const viewerMemberId = currentUser?.memberId ?? '';

  return useMutation({
    mutationFn: async (request: SendMessageRequest) => {
      if (!viewerMemberId) {
        throw new Error('You must be logged in to send messages.');
      }

      return messagesService.sendMessage(request);
    },
    onSuccess: (_, request) => {
      queryClient.invalidateQueries({ queryKey: messageKeys.inbox(viewerMemberId) });
    },
    onError: (error: any) => {
      toast.fromError(error);
    },
  });
}

export function useMarkMessageThreadRead() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const viewerMemberId = currentUser?.memberId ?? '';

  return useMutation({
    mutationFn: async (request: MarkMessageThreadReadRequest) => {
      if (!viewerMemberId) {
        throw new Error('You must be logged in to update message state.');
      }

      return messagesService.markThreadRead(request);
    },
    onSuccess: (_, request) => {
      queryClient.invalidateQueries({ queryKey: messageKeys.inbox(viewerMemberId) });
      queryClient.invalidateQueries({
        queryKey: messageKeys.thread(viewerMemberId, request.threadId),
      });
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const viewerMemberId = currentUser?.memberId ?? '';

  return useMutation({
    mutationFn: async (request: DeleteMessageRequest) => {
      if (!viewerMemberId) {
        throw new Error('You must be logged in to delete a message.');
      }

      return messagesService.deleteMessage(request);
    },
    onSuccess: (_, request) => {
      queryClient.invalidateQueries({ queryKey: messageKeys.inbox(viewerMemberId) });
      queryClient.invalidateQueries({
        queryKey: messageKeys.thread(viewerMemberId, request.threadId),
      });
    },
    onError: (error: any) => {
      toast.fromError(error);
    },
  });
}

export function useCreateDirectMessageThread() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const viewerMemberId = currentUser?.memberId ?? '';

  return useMutation({
    mutationFn: (request: CreateDirectThreadRequest) => messagesService.createDirectThread(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.inbox(viewerMemberId) });
    },
    onError: (error: any) => {
      toast.fromError(error);
    },
  });
}

export function useCreateGroupMessageThread() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const viewerMemberId = currentUser?.memberId ?? '';

  return useMutation({
    mutationFn: (request: CreateGroupThreadRequest) => messagesService.createGroupThread(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messageKeys.inbox(viewerMemberId) });
    },
    onError: (error: any) => {
      toast.fromError(error);
    },
  });
}
