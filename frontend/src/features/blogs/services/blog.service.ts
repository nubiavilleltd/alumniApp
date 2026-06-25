import { contentApiClient } from '@/lib/api/contentClient';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { mapBlogCategories, mapBlogPostDetail, mapBlogPosts } from '../api/adapters/blog.adapter';
import type {
  BlogCategory,
  BlogPostDetail,
  BlogPostStatus,
  BlogPostsResult,
  BlogSection,
} from '../types/blog.types';

export type GetBlogPostsInput = {
  status?: BlogPostStatus | 'all';
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  admin?: boolean;
};

export type SaveBlogPostInput = {
  id?: string;
  title: string;
  categoryId: string;
  excerpt: string;
  status: BlogPostStatus;
  sections: BlogSection[];
  images?: File[];
};

function summarizeBlogPostInput(input: SaveBlogPostInput) {
  return {
    ...input,
    images: input.images?.map((image) => ({
      name: image.name,
      type: image.type,
      size: image.size,
    })),
  };
}

function summarizeBlogFormData(formData: FormData) {
  return Array.from(formData.entries()).map(([key, value]) => {
    if (value instanceof File) {
      return {
        key,
        file: {
          name: value.name,
          type: value.type,
          size: value.size,
        },
      };
    }

    return { key, value };
  });
}

function appendBlogPostFields(formData: FormData, input: SaveBlogPostInput) {
  if (input.id) formData.append('id', input.id);
  formData.append('title', input.title);
  formData.append('category_id', input.categoryId);
  formData.append('excerpt', input.excerpt);
  formData.append('status', input.status);
  formData.append(
    'sections',
    JSON.stringify(
      input.sections.map((section, index) => ({
        ...(section.id ? { id: section.id } : {}),
        heading: section.heading,
        body: section.body,
        sort_order: section.sortOrder ?? index,
      })),
    ),
  );
  input.images?.forEach((image) => formData.append('images[]', image));
}

export const blogService = {
  async getCategories(): Promise<BlogCategory[]> {
    const { data } = await contentApiClient.get(API_ENDPOINTS.CONTENT.BLOG_CATEGORIES, {
      headers: { 'X-Skip-Bearer': '1' },
    });
    return mapBlogCategories(data).filter((category) => category.isActive);
  },

  async getPosts(input: GetBlogPostsInput = {}): Promise<BlogPostsResult> {
    const { data } = await contentApiClient.get(API_ENDPOINTS.CONTENT.BLOG_POSTS, {
      params: {
        ...(input.status ? { status: input.status } : {}),
        ...(input.category ? { category: input.category } : {}),
        ...(input.search ? { search: input.search } : {}),
        page: input.page ?? 1,
        limit: input.limit ?? 10,
      },
      headers: input.admin ? undefined : { 'X-Skip-Bearer': '1' },
    });

    return mapBlogPosts(data);
  },

  async getPostDetail(idOrSlug: string, options?: { admin?: boolean }): Promise<BlogPostDetail> {
    const { data } = await contentApiClient.get(API_ENDPOINTS.CONTENT.BLOG_POST_DETAIL(idOrSlug), {
      headers: options?.admin ? undefined : { 'X-Skip-Bearer': '1' },
    });

    return mapBlogPostDetail(data);
  },

  async createPost(input: SaveBlogPostInput): Promise<BlogPostDetail> {
    const formData = new FormData();
    appendBlogPostFields(formData, input);
    console.log('Create blog payload:', summarizeBlogPostInput(input));
    console.log('Create blog FormData:', summarizeBlogFormData(formData));

    const { data } = await contentApiClient.post(API_ENDPOINTS.CONTENT.CREATE_BLOG_POST, formData);
    console.log('Create blog response:', data);
    return mapBlogPostDetail(data);
  },

  async updatePost(input: SaveBlogPostInput): Promise<BlogPostDetail> {
    const formData = new FormData();
    appendBlogPostFields(formData, input);
    console.log('Update blog payload:', summarizeBlogPostInput(input));
    console.log('Update blog FormData:', summarizeBlogFormData(formData));

    const { data } = await contentApiClient.post(API_ENDPOINTS.CONTENT.UPDATE_BLOG_POST, formData);
    console.log('Update blog response:', data);
    return mapBlogPostDetail(data);
  },

  async deletePost(id: string): Promise<void> {
    await contentApiClient.post(API_ENDPOINTS.CONTENT.DELETE_BLOG_POST, { id });
  },
};
