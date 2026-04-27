import { useMutation } from '@tanstack/react-query';
import { toast } from '@/shared/components/ui/Toast';
import { contactService } from '@/features/contactUs/services/contact.service';
import type { Contact } from '@/features/contactUs/types/contact.types';

export function useSubmitContactForm() {
  return useMutation({
    mutationFn: (input: Contact) => contactService.create(input),
    onSuccess: (message) => {
      toast.success(message);
    },
    onError: (error: any) => {
      toast.fromError(error);
    },
  });
}
