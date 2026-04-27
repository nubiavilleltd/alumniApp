import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { handleApiError } from '@/lib/errors/apiErrorHandler';
import {
  createContactPayload,
  extractContactSuccessMessage,
} from '@/features/contactUs/api/adapters/contact.adapter';
import type { Contact } from '@/features/contactUs/types/contact.types';

export const contactService = {
  async create(input: Contact): Promise<string> {
    try {
      const payload = createContactPayload(input);
      const { data } = await apiClient.post(API_ENDPOINTS.CONTACT.CREATE, payload);

      return extractContactSuccessMessage(data);
    } catch (error) {
      throw handleApiError(
        error,
        'Unable to send your message right now. Please try again.',
        'contactService.create',
      );
    }
  },
};
