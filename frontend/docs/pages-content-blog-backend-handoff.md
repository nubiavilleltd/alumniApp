# Pages Content And Blog Backend Handoff

## Purpose

This document lists the backend APIs needed to replace the current local/mock admin CMS behavior for:

- homepage content
- FAQs
- blog posts

The current frontend source is:

- `src/features/admin/components/pages-content/HomeContentPanel.tsx`
- `src/features/admin/components/pages-content/FaqContentPanel.tsx`
- `src/features/admin/components/pages-content/BlogContentPanel.tsx`
- `src/features/admin/components/pages-content/types.ts`

All admin write endpoints should require admin authentication. Public read endpoints should return only published/visible content.

## Shared Rules

- IDs should be stable strings or numeric IDs stringified by the frontend.
- Timestamps should be ISO 8601 strings.
- List endpoints should return items sorted by `sort_order` ascending unless stated otherwise.
- Write endpoints should return the updated entity or updated list so the frontend can refresh without guessing.
- Delete endpoints should soft-delete where content history matters.
- Image uploads should support `png`, `jpg`, `jpeg`, and `webp`.
- Image size limit should be at least 2MB for blog images. Homepage carousel can use the same limit unless backend prefers a higher value.

## 1. Homepage Content

### Current Frontend Behavior

The homepage CMS manages:

- carousel images
- image ordering by drag and drop
- hide/show per carousel image
- add image
- replace image
- delete image
- greeting title
- greeting message

The current local payload shape is:

```ts
{
  function_type: 'update',
  content_type: 'homepage',
  greeting_title: string,
  greeting_message: string,
  carousel_images: [
    {
      id: string,
      image_url: string,
      file_name: string | null,
      sort_order: number,
      is_hidden: '1' | '0'
    }
  ]
}
```

### API Needed: Get Homepage Content

- Method: `GET`
- Path: `/api/pages/homepage`
- Auth: public or admin

Response fields:

```ts
{
  status: 200,
  homepage: {
    greeting_title: string,
    greeting_message: string,
    carousel_images: HomepageCarouselImage[]
  }
}

type HomepageCarouselImage = {
  id: string;
  image_url: string;
  file_name?: string | null;
  alt_text?: string | null;
  sort_order: number;
  is_hidden: '1' | '0' | boolean;
  created_at: string;
  updated_at: string;
}
```

Business logic:

- Public consumers should receive only `is_hidden = 0` images.
- Admin consumers can receive all images.
- Images must be ordered by `sort_order`.

### API Needed: Update Homepage Text

- Method: `POST`
- Path: `/api/admin/pages/homepage/update_text`
- Auth: admin

Payload fields:

```ts
{
  greeting_title: string;
  greeting_message: string;
}
```

Validation:

- `greeting_title` is required.
- `greeting_message` is required.
- Trim whitespace.

Business logic:

- Update only homepage text fields.
- Do not modify carousel images.

### API Needed: Add Carousel Image

- Method: `POST`
- Path: `/api/admin/pages/homepage/carousel/create`
- Auth: admin
- Content type: `multipart/form-data`

Payload fields:

```ts
{
  image: File;
  alt_text?: string;
  sort_order?: number;
  is_hidden?: '1' | '0';
}
```

Business logic:

- If `sort_order` is omitted, append to the end.
- Store the uploaded image and return its public URL.
- Normalize carousel ordering after insert.

### API Needed: Replace Carousel Image

- Method: `POST`
- Path: `/api/admin/pages/homepage/carousel/update`
- Auth: admin
- Content type: `multipart/form-data`

Payload fields:

```ts
{
  id: string;
  image?: File;
  alt_text?: string;
  is_hidden?: '1' | '0';
}
```

Business logic:

- If `image` is present, replace the existing file.
- If only metadata is present, update metadata without changing the image.
- Return the updated image record.

### API Needed: Reorder Carousel Images

- Method: `POST`
- Path: `/api/admin/pages/homepage/carousel/reorder`
- Auth: admin

Payload fields:

```ts
{
  images: [
    {
      id: string;
      sort_order: number;
    }
  ]
}
```

Validation:

- Every listed `id` must exist.
- `sort_order` values should be positive integers.

Business logic:

- Apply ordering atomically.
- Return the full ordered carousel list.

### API Needed: Delete Carousel Image

- Method: `POST`
- Path: `/api/admin/pages/homepage/carousel/delete`
- Auth: admin

Payload fields:

```ts
{
  id: string;
}
```

Business logic:

- Soft-delete is preferred.
- Normalize remaining image order after delete.
- Return the full ordered carousel list.

## 2. FAQ Content

### Current Frontend Behavior

The FAQ CMS manages:

- one or more FAQ items
- question and answer fields
- add FAQ only when all existing FAQs are filled
- edit FAQ
- delete FAQ
- reorder FAQ via drag and drop

Current frontend type:

```ts
{
  id: string;
  question: string;
  answer: string;
}
```

### API Needed: List FAQs

- Method: `GET`
- Path: `/api/faqs`
- Auth: public or admin

Response fields:

```ts
{
  status: 200,
  faqs: [
    {
      id: string;
      question: string;
      answer: string;
      sort_order: number;
      is_published: '1' | '0' | boolean;
      created_at: string;
      updated_at: string;
    }
  ]
}
```

Business logic:

- Public response should include only published FAQs.
- Admin response can include draft/unpublished FAQs if needed.
- Sort by `sort_order` ascending.

### API Needed: Create FAQ

- Method: `POST`
- Path: `/api/admin/faqs/create`
- Auth: admin

Payload fields:

```ts
{
  question: string;
  answer: string;
  sort_order?: number;
  is_published?: '1' | '0';
}
```

Validation:

- `question` is required.
- `answer` is required.
- Trim whitespace.

Business logic:

- If `sort_order` is omitted, append to the end.
- Return the created FAQ.

### API Needed: Update FAQ

- Method: `POST`
- Path: `/api/admin/faqs/update`
- Auth: admin

Payload fields:

```ts
{
  id: string;
  question?: string;
  answer?: string;
  is_published?: '1' | '0';
}
```

Business logic:

- Only update fields present in the payload.
- Return the updated FAQ.

### API Needed: Reorder FAQs

- Method: `POST`
- Path: `/api/admin/faqs/reorder`
- Auth: admin

Payload fields:

```ts
{
  faqs: [
    {
      id: string;
      sort_order: number;
    }
  ]
}
```

Business logic:

- Apply ordering atomically.
- Return the full ordered FAQ list.

### API Needed: Delete FAQ

- Method: `POST`
- Path: `/api/admin/faqs/delete`
- Auth: admin

Payload fields:

```ts
{
  id: string;
}
```

Business logic:

- Soft-delete is preferred.
- Return success and optionally the updated FAQ list.

## 3. Blog

### Current Frontend Behavior

The blog CMS currently displays mock posts and a create-post form.

The list card displays:

- category
- status: `published` or `draft`
- image
- published date/time
- read time
- title
- excerpt
- edit button
- delete button

The create form captures:

- blog title
- category
- short summary / excerpt
- image gallery
- repeatable content sections:
  - header
  - body
- save draft
- publish post

Current frontend list type:

```ts
{
  id: string;
  category: string;
  status: 'published' | 'draft';
  image: string;
  publishedAt: string;
  readTime: string;
  title: string;
  excerpt: string;
}
```

### API Needed: List Blog Posts

- Method: `GET`
- Path: `/api/blog/posts`
- Auth: public or admin

Query fields:

```ts
{
  status?: 'published' | 'draft' | 'all';
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}
```

Response fields:

```ts
{
  status: 200,
  posts: BlogPostSummary[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  }
}

type BlogPostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category_id: string;
  category_name: string;
  status: 'published' | 'draft';
  cover_image_url: string | null;
  published_at: string | null;
  read_time_minutes: number | null;
  created_at: string;
  updated_at: string;
}
```

Business logic:

- Public calls should only return `published` posts.
- Admin calls may request `status = all`.
- Sort newest first by `published_at`, then `created_at`.

### API Needed: Get Blog Post Detail

- Method: `GET`
- Path: `/api/blog/posts/:id_or_slug`
- Auth: public for published posts, admin for drafts

Response fields:

```ts
{
  status: 200,
  post: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    category_id: string;
    category_name: string;
    status: 'published' | 'draft';
    cover_image_url: string | null;
    gallery_images: BlogImage[];
    sections: BlogSection[];
    read_time_minutes: number | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
  }
}

type BlogImage = {
  id: string;
  image_url: string;
  file_name?: string | null;
  alt_text?: string | null;
  sort_order: number;
}

type BlogSection = {
  id: string;
  heading: string;
  body: string;
  sort_order: number;
}
```

Business logic:

- Public users should not access drafts.
- Sections must be returned by `sort_order`.
- Gallery images must be returned by `sort_order`.

### API Needed: Create Blog Post

- Method: `POST`
- Path: `/api/admin/blog/posts/create`
- Auth: admin
- Content type: `multipart/form-data` if uploading images

Payload fields:

```ts
{
  title: string;
  category_id: string;
  excerpt: string;
  status: 'published' | 'draft';
  images?: File[];
  sections: [
    {
      heading: string;
      body: string;
      sort_order: number;
    }
  ];
}
```

Validation:

- `title` is required.
- `category_id` is required.
- `excerpt` is required.
- At least one section is required.
- Each section requires `heading` and `body`.
- `status` must be `published` or `draft`.

Business logic:

- Generate a unique `slug` from title.
- If `status = published`, set `published_at` if not already set.
- If `status = draft`, leave `published_at` null.
- Calculate `read_time_minutes` from all section body text.
- First uploaded image may be used as `cover_image_url` unless a specific cover field is added later.

### API Needed: Update Blog Post

- Method: `POST`
- Path: `/api/admin/blog/posts/update`
- Auth: admin
- Content type: `multipart/form-data` if uploading images

Payload fields:

```ts
{
  id: string;
  title?: string;
  category_id?: string;
  excerpt?: string;
  status?: 'published' | 'draft';
  images?: File[];
  sections?: [
    {
      id?: string;
      heading: string;
      body: string;
      sort_order: number;
    }
  ];
}
```

Business logic:

- Only update fields present in the payload.
- If title changes, backend may update slug, but must avoid breaking public links. A redirect/alias table is preferred if slugs are mutable.
- Replacing sections can be implemented as full replacement for simplicity.
- Publishing a draft should set `published_at`.
- Moving a published post back to draft should hide it from public endpoints.

### API Needed: Delete Blog Post

- Method: `POST`
- Path: `/api/admin/blog/posts/delete`
- Auth: admin

Payload fields:

```ts
{
  id: string;
}
```

Business logic:

- Soft-delete is preferred.
- Deleted posts should not appear in public or admin list by default.

### API Needed: List Blog Categories

- Method: `GET`
- Path: `/api/blog/categories`
- Auth: public or admin

Response fields:

```ts
{
  status: 200,
  categories: [
    {
      id: string;
      name: string;
      slug: string;
      sort_order: number;
      is_active: '1' | '0' | boolean;
    }
  ]
}
```

Business logic:

- Active categories only for public use.
- Admin may need inactive categories later.

### Optional API: Manage Blog Categories

- Method: `POST`
- Path: `/api/admin/blog/categories/manage`
- Auth: admin

Payload fields:

```ts
{
  function_type: 'create' | 'update' | 'delete' | 'reorder';
  id?: string;
  name?: string;
  is_active?: '1' | '0';
  categories?: [
    {
      id: string;
      sort_order: number;
    }
  ];
}
```

Business logic:

- Required only if admins should manage categories from the frontend later.
- Current UI only needs category listing for the create/edit form.

## Recommended Endpoint Constants For Frontend

Suggested additions to `src/lib/api/endpoints.ts`:

```ts
PAGES_CONTENT: {
  HOMEPAGE: '/api/pages/homepage',
  UPDATE_HOMEPAGE_TEXT: '/api/admin/pages/homepage/update_text',
  CREATE_HOMEPAGE_CAROUSEL: '/api/admin/pages/homepage/carousel/create',
  UPDATE_HOMEPAGE_CAROUSEL: '/api/admin/pages/homepage/carousel/update',
  REORDER_HOMEPAGE_CAROUSEL: '/api/admin/pages/homepage/carousel/reorder',
  DELETE_HOMEPAGE_CAROUSEL: '/api/admin/pages/homepage/carousel/delete',
  FAQS: '/api/faqs',
  CREATE_FAQ: '/api/admin/faqs/create',
  UPDATE_FAQ: '/api/admin/faqs/update',
  REORDER_FAQS: '/api/admin/faqs/reorder',
  DELETE_FAQ: '/api/admin/faqs/delete',
},
BLOG: {
  POSTS: '/api/blog/posts',
  POST_DETAIL: (idOrSlug: string) => `/api/blog/posts/${idOrSlug}`,
  CREATE_POST: '/api/admin/blog/posts/create',
  UPDATE_POST: '/api/admin/blog/posts/update',
  DELETE_POST: '/api/admin/blog/posts/delete',
  CATEGORIES: '/api/blog/categories',
  MANAGE_CATEGORIES: '/api/admin/blog/categories/manage',
}
```

## Implementation Priority

1. Homepage get/update text and carousel image CRUD.
2. FAQ list/create/update/reorder/delete.
3. Blog categories list.
4. Blog post list/detail/create/update/delete.
5. Optional category management.

