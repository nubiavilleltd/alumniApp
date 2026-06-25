export type BlogPostStatus = 'published' | 'draft';

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
};

export type BlogImage = {
  id: string;
  imageUrl: string;
  fileName?: string | null;
  altText?: string | null;
  sortOrder: number;
};

export type BlogSection = {
  id?: string;
  heading: string;
  body: string;
  sortOrder: number;
};

export type BlogPostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  categoryId: string;
  categoryName: string;
  status: BlogPostStatus;
  coverImageUrl: string | null;
  readTimeMinutes: number | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BlogPostDetail = BlogPostSummary & {
  sections: BlogSection[];
  galleryImages: BlogImage[];
};

export type BlogPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type BlogPostsResult = {
  posts: BlogPostSummary[];
  pagination: BlogPagination;
};
