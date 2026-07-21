import type { Faq } from '../../types/faq.types';

function readString(...values: unknown[]) {
  const value = values.find((item) => typeof item === 'string' && item.trim().length > 0);
  return typeof value === 'string' ? value.trim() : '';
}

function readNumber(...values: unknown[]) {
  const value = values.find((item) => item !== undefined && item !== null && item !== '');

  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  return 0;
}

function readBoolean(...values: unknown[]) {
  const value = values.find((item) => item !== undefined && item !== null);

  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    return ['1', 'true', 'yes', 'published', 'active'].includes(value.trim().toLowerCase());
  }

  return false;
}

function mapFaq(raw: unknown): Faq {
  const faq = (raw ?? {}) as Record<string, unknown>;

  return {
    id: readString(faq.id, faq.faq_id, faq.faqId),
    question: readString(faq.question, faq.title),
    answer: readString(faq.answer, faq.body, faq.content),
    sortOrder: readNumber(faq.sort_order, faq.sortOrder),
    isPublished: readBoolean(faq.is_published, faq.isPublished, faq.published),
    createdAt: readString(faq.created_at, faq.createdAt) || undefined,
    updatedAt: readString(faq.updated_at, faq.updatedAt) || undefined,
  };
}

export function mapFaqList(raw: unknown): Faq[] {
  const data = (raw ?? {}) as Record<string, unknown>;
  const rawFaqs = Array.isArray(data.faqs)
    ? data.faqs
    : Array.isArray(data.data)
      ? data.data
      : Array.isArray(raw)
        ? raw
        : [];

  return rawFaqs
    .map(mapFaq)
    .filter((faq) => faq.id && faq.question)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
