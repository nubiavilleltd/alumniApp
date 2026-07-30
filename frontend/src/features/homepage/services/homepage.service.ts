import { contentApiClient } from '@/lib/api/contentClient';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { mapCarouselImage, mapHomepageContent } from '../api/adapters/homepage.adapter';
import type { HomepageCarouselImage, HomepageContent } from '../types/homepage.types';

export type UpdateHomepageTextInput = {
  greetingTitle: string;
  greetingMessage: string;
};

export type CreateCarouselImageInput = {
  image: File;
  altText?: string;
  sortOrder?: number;
  isHidden?: boolean;
};

export type UpdateCarouselImageInput = {
  id: string;
  image?: File;
  altText?: string;
  isHidden?: boolean;
  showGreetingMessage?: boolean;
};

export type ReorderCarouselImageInput = {
  id: string;
  sortOrder: number;
};

function visibilityValue(isHidden?: boolean) {
  return isHidden ? '1' : '0';
}

function greetingVisibilityValue(showGreetingMessage?: boolean) {
  return showGreetingMessage ? '1' : '0';
}

export const homepageService = {
  async getHomepage(options?: { admin?: boolean }): Promise<HomepageContent> {
    const { data } = await contentApiClient.get(API_ENDPOINTS.CONTENT.HOMEPAGE, {
      headers: options?.admin ? undefined : { 'X-Skip-Bearer': '1' },
    });
    const homepage = mapHomepageContent(data);

    if (
      !homepage.greetingTitle &&
      !homepage.greetingMessage &&
      homepage.carouselImages.length === 0
    ) {
      throw new Error('Homepage content response was empty.');
    }

    if (options?.admin) {
      return homepage;
    }

    return {
      ...homepage,
      carouselImages: homepage.carouselImages.filter((image) => !image.isHidden),
    };
  },

  async updateHomepageText(input: UpdateHomepageTextInput): Promise<UpdateHomepageTextInput> {
    const { data } = await contentApiClient.post(API_ENDPOINTS.CONTENT.UPDATE_HOMEPAGE_TEXT, {
      greeting_title: input.greetingTitle,
      greeting_message: input.greetingMessage,
    });
    const responseData = (data?.data ?? data ?? {}) as Record<string, unknown>;

    return {
      greetingTitle: String(responseData.greeting_title ?? input.greetingTitle),
      greetingMessage: String(responseData.greeting_message ?? input.greetingMessage),
    };
  },

  async createCarouselImage(input: CreateCarouselImageInput): Promise<HomepageCarouselImage> {
    const formData = new FormData();
    formData.append('image', input.image);
    if (input.altText !== undefined) formData.append('alt_text', input.altText);
    if (input.sortOrder !== undefined) formData.append('sort_order', String(input.sortOrder));
    if (input.isHidden !== undefined) formData.append('is_hidden', visibilityValue(input.isHidden));

    const { data } = await contentApiClient.post(
      API_ENDPOINTS.CONTENT.CREATE_CAROUSEL_IMAGE,
      formData,
    );

    return mapCarouselImage(data?.image);
  },

  async updateCarouselImage(input: UpdateCarouselImageInput): Promise<HomepageCarouselImage> {
    if (!input.id) {
      throw new Error('Unable to update carousel image.');
    }

    if (input.image) {
      const formData = new FormData();
      formData.append('id', input.id);
      formData.append('image', input.image);
      if (input.altText !== undefined) formData.append('alt_text', input.altText);
      if (input.isHidden !== undefined) {
        formData.append('is_hidden', visibilityValue(input.isHidden));
      }
      if (input.showGreetingMessage !== undefined) {
        formData.append('show_greeting', greetingVisibilityValue(input.showGreetingMessage));
      }

      const { data } = await contentApiClient.post(
        API_ENDPOINTS.CONTENT.UPDATE_CAROUSEL_IMAGE,
        formData,
      );
      return mapCarouselImage(data?.image);
    }

    const { data } = await contentApiClient.post(API_ENDPOINTS.CONTENT.UPDATE_CAROUSEL_IMAGE, {
      id: input.id,
      ...(input.altText !== undefined ? { alt_text: input.altText } : {}),
      ...(input.isHidden !== undefined ? { is_hidden: visibilityValue(input.isHidden) } : {}),
      ...(input.showGreetingMessage !== undefined
        ? { show_greeting: greetingVisibilityValue(input.showGreetingMessage) }
        : {}),
    });
    return mapCarouselImage(data?.image);
  },

  async reorderCarousel(images: ReorderCarouselImageInput[]): Promise<HomepageCarouselImage[]> {
    if (images.some((image) => !image.id)) {
      throw new Error('Unable to update carousel order.');
    }

    const { data } = await contentApiClient.post(API_ENDPOINTS.CONTENT.REORDER_CAROUSEL, {
      images: images.map((image) => ({
        id: image.id,
        sort_order: image.sortOrder,
      })),
    });
    const rawImages = Array.isArray(data?.carousel_images) ? data.carousel_images : [];
    return rawImages.map(mapCarouselImage);
  },

  async deleteCarouselImage(id: string): Promise<void> {
    await contentApiClient.post(API_ENDPOINTS.CONTENT.DELETE_CAROUSEL_IMAGE, { id });
  },
};
