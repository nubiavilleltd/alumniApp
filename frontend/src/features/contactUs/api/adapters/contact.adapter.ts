import type { Contact, ContactSubmissionResponse } from '@/features/contactUs/types/contact.types';

export function createContactPayload(input: Contact): Contact {
  return {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    email: input.email.trim(),
    message: input.message.trim(),
  };
}

export function extractContactSuccessMessage(data: unknown): string {
  const response = data as ContactSubmissionResponse | undefined;
  const message = response?.message?.trim();

  return message || 'Your message has been sent successfully.';
}
