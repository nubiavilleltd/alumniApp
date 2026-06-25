import { contentApiClient } from '@/lib/api/contentClient';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { mapFaqList } from '../api/adapters/faq.adapter';
import type { Faq } from '../types/faq.types';

export type CreateFaqInput = {
  question: string;
  answer: string;
  sortOrder?: number;
  isPublished?: boolean;
};

export type UpdateFaqInput = {
  id: string;
  question?: string;
  answer?: string;
  sortOrder?: number;
  isPublished?: boolean;
};

export type ReorderFaqInput = {
  id: string;
  sortOrder: number;
};

function publishedValue(isPublished?: boolean) {
  return isPublished ? '1' : '0';
}

export const faqService = {
  async getPublishedFaqs(): Promise<Faq[]> {
    const { data } = await contentApiClient.get(API_ENDPOINTS.CONTENT.FAQS, {
      headers: { 'X-Skip-Bearer': '1' },
    });

    return mapFaqList(data).filter((faq) => faq.isPublished);
  },

  async getAdminFaqs(): Promise<Faq[]> {
    const { data } = await contentApiClient.get(API_ENDPOINTS.CONTENT.FAQS);
    return mapFaqList(data);
  },

  async createFaq(input: CreateFaqInput): Promise<Faq> {
    const { data } = await contentApiClient.post(API_ENDPOINTS.CONTENT.CREATE_FAQ, {
      question: input.question,
      answer: input.answer,
      sort_order: input.sortOrder ?? 0,
      is_published: publishedValue(input.isPublished ?? true),
    });

    return mapFaqList({ faqs: [data?.faq ?? data?.data ?? data] })[0];
  },

  async updateFaq(input: UpdateFaqInput): Promise<Faq> {
    const { data } = await contentApiClient.post(API_ENDPOINTS.CONTENT.UPDATE_FAQ, {
      id: input.id,
      ...(input.question !== undefined ? { question: input.question } : {}),
      ...(input.answer !== undefined ? { answer: input.answer } : {}),
      ...(input.sortOrder !== undefined ? { sort_order: input.sortOrder } : {}),
      ...(input.isPublished !== undefined
        ? { is_published: publishedValue(input.isPublished) }
        : {}),
    });

    return mapFaqList({ faqs: [data?.faq ?? data?.data ?? data] })[0];
  },

  async reorderFaqs(faqs: ReorderFaqInput[]): Promise<Faq[]> {
    const { data } = await contentApiClient.post(API_ENDPOINTS.CONTENT.REORDER_FAQS, {
      faqs: faqs.map((faq) => ({
        id: faq.id,
        sort_order: faq.sortOrder,
      })),
    });

    return mapFaqList(data);
  },

  async deleteFaq(id: string): Promise<void> {
    await contentApiClient.post(API_ENDPOINTS.CONTENT.DELETE_FAQ, { id });
  },
};
