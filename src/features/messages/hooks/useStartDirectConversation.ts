import { useNavigate } from 'react-router-dom';
import { toast } from '@/shared/components/ui/Toast';
import { registerMessageRecipient } from '../lib/messageRecipientRegistry';
import { useCreateDirectMessageThread } from './useMessages';
import { useIdentityStore } from '@/features/authentication/stores/useIdentityStore';

interface DirectConversationRecipientProfile {
  fullName: string;
  avatar?: string;
  headline?: string;
  location?: string;
  graduationYear?: number;
  slug?: string;
  profileHref?: string;
}

interface StartDirectConversationParams {
  participantMemberId: string;
  topic?: string;
  initialMessage?: string;
  recipientProfile?: DirectConversationRecipientProfile;
}

function buildMessagesIntent(params: StartDirectConversationParams) {
  const search = new URLSearchParams({
    recipient: params.participantMemberId,
  });

  if (params.topic) {
    search.set('topic', params.topic);
  }

  if (params.initialMessage?.trim()) {
    search.set('initialMessage', params.initialMessage.trim());
  }

  return `/messages?${search.toString()}`;
}

export function useStartDirectConversation() {
  const navigate = useNavigate();
  const currentUser = useIdentityStore((state) => state.user);
  const createDirectThread = useCreateDirectMessageThread();

  async function startDirectConversation(params: StartDirectConversationParams) {
    if (!params.participantMemberId) return;

    if (params.recipientProfile?.fullName) {
      // Store lightweight recipient context so the mock transport can resolve
      // real names for backend-driven alumni records it does not know yet.
      registerMessageRecipient({
        memberId: params.participantMemberId,
        ...params.recipientProfile,
      });
    }

    if (!currentUser?.memberId) {
      toast.info('Sign in to start a conversation.');
      navigate('/auth/login', {
        state: { from: buildMessagesIntent(params) },
      });
      return;
    }

    if (currentUser.memberId === params.participantMemberId) {
      toast.info('Your existing conversations are waiting in your inbox.');
      navigate('/messages');
      return;
    }

    try {
      const response = await createDirectThread.mutateAsync({
        viewerMemberId: currentUser.memberId,
        participantMemberId: params.participantMemberId,
        topic: params.topic,
      });

      const search = new URLSearchParams({
        threadId: response.thread.id,
      });

      if (params.initialMessage?.trim()) {
        search.set('initialMessage', params.initialMessage.trim());
      }

      navigate(`/messages?${search.toString()}`);
    } catch {
      // The shared mutation hook already reports errors through toast notifications.
    }
  }

  return {
    startDirectConversation,
    isPending: createDirectThread.isPending,
  };
}
