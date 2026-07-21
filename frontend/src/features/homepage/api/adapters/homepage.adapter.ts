import type { HomepageCarouselImage, HomepageContent } from '../../types/homepage.types';

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
    return ['1', 'true', 'yes', 'hidden'].includes(value.trim().toLowerCase());
  }

  return false;
}

export function mapCarouselImage(raw: unknown): HomepageCarouselImage {
  const image = (raw ?? {}) as Record<string, unknown>;
  const imageUrl = readString(image.image_url, image.imageUrl, image.url, image.src);

  return {
    id: readString(image.id, image.image_id, image.imageId) || imageUrl,
    imageUrl,
    fileName: readString(image.file_name, image.fileName),
    altText: readString(image.alt_text, image.altText),
    sortOrder: readNumber(image.sort_order, image.sortOrder),
    isHidden: readBoolean(image.is_hidden, image.isHidden),
    createdAt: readString(image.created_at, image.createdAt) || undefined,
    updatedAt: readString(image.updated_at, image.updatedAt) || undefined,
  };
}

export function mapHomepageContent(raw: unknown): HomepageContent {
  const data = (raw ?? {}) as Record<string, unknown>;
  const homepage = (data.homepage ?? data.data ?? data) as Record<string, unknown>;
  const carouselImages = Array.isArray(homepage.carousel_images)
    ? homepage.carousel_images
    : Array.isArray(homepage.carouselImages)
      ? homepage.carouselImages
      : [];

  return {
    greetingTitle: readString(homepage.greeting_title, homepage.greetingTitle),
    greetingMessage: readString(homepage.greeting_message, homepage.greetingMessage),
    carouselImages: carouselImages
      .map(mapCarouselImage)
      .filter((image) => image.imageUrl)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  };
}
