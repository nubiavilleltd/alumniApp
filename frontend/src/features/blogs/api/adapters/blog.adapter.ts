import type {
  BlogCategory,
  BlogImage,
  BlogPagination,
  BlogPostDetail,
  BlogPostStatus,
  BlogPostSummary,
  BlogSection,
} from '../../types/blog.types';

function toRecord(value: unknown): Record<string, any> {
  return value && typeof value === 'object' ? (value as Record<string, any>) : {};
}

function toStringValue(value: unknown, fallback = '') {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function toNumberValue(value: unknown, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function toBooleanValue(value: unknown) {
  return value === true || value === 1 || value === '1' || value === 'true';
}

function toStatus(value: unknown): BlogPostStatus {
  return value === 'draft' ? 'draft' : 'published';
}

export function mapBlogCategory(rawCategory: unknown): BlogCategory {
  const category = toRecord(rawCategory);
  const mappedCategory = {
    id: toStringValue(category.id),
    name: toStringValue(category.name),
    slug: toStringValue(category.slug),
    sortOrder: toNumberValue(category.sort_order),
    isActive: toBooleanValue(category.is_active ?? true),
  };

  console.log('[Blog Categories] map category:', {
    raw: rawCategory,
    mapped: mappedCategory,
  });

  return mappedCategory;
}

export function mapBlogCategories(response: unknown): BlogCategory[] {
  const data = toRecord(response);
  const rawCategories = Array.isArray(data.categories)
    ? data.categories
    : Array.isArray(data.data)
      ? data.data
      : Array.isArray(response)
        ? response
        : [];

  const mappedCategories = rawCategories
    .map(mapBlogCategory)
    .filter((category) => category.id && category.name)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  console.log('[Blog Categories] map categories response:', {
    response,
    rawCategories,
    mappedCategories,
  });

  return mappedCategories;
}

export function mapBlogPostSummary(rawPost: unknown): BlogPostSummary {
  const post = toRecord(rawPost);

  return {
    id: toStringValue(post.id),
    slug: toStringValue(post.slug || post.id),
    title: toStringValue(post.title),
    excerpt: toStringValue(post.excerpt),
    categoryId: toStringValue(post.category_id),
    categoryName: toStringValue(post.category_name),
    status: toStatus(post.status),
    coverImageUrl: post.cover_image_url ? toStringValue(post.cover_image_url) : null,
    readTimeMinutes:
      post.read_time_minutes === null || post.read_time_minutes === undefined
        ? null
        : toNumberValue(post.read_time_minutes),
    publishedAt: post.published_at ? toStringValue(post.published_at) : null,
    createdAt: toStringValue(post.created_at),
    updatedAt: toStringValue(post.updated_at),
  };
}

function mapBlogSection(rawSection: unknown): BlogSection {
  const section = toRecord(rawSection);

  return {
    id: section.id === undefined || section.id === null ? undefined : toStringValue(section.id),
    heading: toStringValue(section.heading),
    body: toStringValue(section.body),
    sortOrder: toNumberValue(section.sort_order),
  };
}

function mapBlogImage(rawImage: unknown): BlogImage {
  const image = toRecord(rawImage);

  return {
    id: toStringValue(image.id),
    imageUrl: toStringValue(image.image_url),
    fileName: image.file_name === undefined ? null : toStringValue(image.file_name),
    altText: image.alt_text === undefined ? null : toStringValue(image.alt_text),
    sortOrder: toNumberValue(image.sort_order),
  };
}

export function mapBlogPostDetail(response: unknown): BlogPostDetail {
  const data = toRecord(response);
  const rawPost = data.post ?? data.data ?? response;
  const post = toRecord(rawPost);

  return {
    ...mapBlogPostSummary(post),
    sections: (Array.isArray(post.sections) ? post.sections : [])
      .map(mapBlogSection)
      .sort((a, b) => a.sortOrder - b.sortOrder),
    galleryImages: (Array.isArray(post.gallery_images) ? post.gallery_images : [])
      .map(mapBlogImage)
      .filter((image) => image.imageUrl)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  };
}

export function toBooleanActive(value: number | boolean | undefined, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  return fallback;
}

export function mapBlogPosts(response: unknown) {
  const data = toRecord(response);
  const rawPosts = Array.isArray(data.posts)
    ? data.posts
    : Array.isArray(data.data)
      ? data.data
      : Array.isArray(response)
        ? response
        : [];
  const paginationData = toRecord(data.pagination);
  const pagination: BlogPagination = {
    page: toNumberValue(paginationData.page, 1),
    limit: toNumberValue(paginationData.limit, rawPosts.length || 10),
    total: toNumberValue(paginationData.total, rawPosts.length),
    totalPages: toNumberValue(paginationData.total_pages, 1),
  };

  return {
    posts: rawPosts.map(mapBlogPostSummary).filter((post) => post.id && post.title),
    pagination,
  };
}
