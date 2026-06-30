# Blog Main Image Backend Walkthrough

This is a small extension to the current blog create/update API. The goal is to support multiple uploaded blog images and allow admins to choose which image becomes the main/cover image without redesigning the existing blog API.

## Current Frontend Behavior

The admin blog form already uploads multiple images as repeated `images[]` fields.

The frontend now lets an admin choose one image as the main image:

- If the selected image is a newly uploaded file, the request sends `main_image_index`.
- If the selected image is an existing image URL, the request sends `main_image_url`.
- The rest of the images remain gallery images.

The public blog page uses the existing response field `cover_image_url` as the main displayed image. No frontend-local image preference is used.

## Minimal API Change

Keep the current create/update endpoints:

- `POST /blog_api/create_blog_post`
- `POST /blog_api/update_blog_post`

Keep the current multipart upload structure:

- `title`
- `category_id`
- `excerpt`
- `status`
- `sections`
- repeated `images[]`

Add only these optional fields:

```ts
main_image_index?: number;
main_image_url?: string;
```

## Create Blog Post

### Endpoint

```txt
POST /blog_api/create_blog_post
Content-Type: multipart/form-data
```

### Payload

```ts
{
  title: string;
  category_id: string;
  excerpt: string;
  status: 'published' | 'draft';
  sections: string; // JSON string
  main_image_index?: number;
  images[]?: File[];
}
```

### Example

```txt
title = "History of Rugby"
category_id = "3"
excerpt = "A short intro"
status = "published"
sections = "[{\"heading\":\"History of Rugby\",\"body\":\"...\",\"sort_order\":0}]"
main_image_index = "1"
images[] = first-file.jpg
images[] = second-file.jpg
images[] = third-file.jpg
```

If `main_image_index` is `1`, the backend should use the second uploaded file as `cover_image_url`.

If `main_image_index` is missing, keep the current behavior: use the first uploaded image as the cover.

## Update Blog Post

### Endpoint

```txt
POST /blog_api/update_blog_post
Content-Type: multipart/form-data
```

### Payload

```ts
{
  id: string;
  title?: string;
  category_id?: string;
  excerpt?: string;
  status?: 'published' | 'draft';
  sections?: string; // JSON string
  main_image_index?: number;
  main_image_url?: string;
  images[]?: File[];
}
```

### Use Cases

#### 1. Admin selects an existing image as main

```txt
id = "12"
main_image_url = "https://alumniportal.nubiaville.com/uploads/blog/rugby-2.jpg"
```

Backend should set `cover_image_url` to that existing image URL if it belongs to the blog post.

#### 2. Admin uploads new images and selects one new image as main

```txt
id = "12"
main_image_index = "0"
images[] = new-main-image.jpg
images[] = new-gallery-image.jpg
```

Backend should use the uploaded file at `main_image_index` as `cover_image_url`.

#### 3. Admin uploads images but does not select a main image

Keep current behavior. Existing `cover_image_url` should remain unchanged if possible. If the post has no cover image yet, the backend may use the first uploaded image.

## Response Shape

Keep the current response shape. The important part is that `cover_image_url` reflects the selected main image.

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
    gallery_images: [
      {
        id: string;
        image_url: string;
        file_name?: string | null;
        alt_text?: string | null;
        sort_order: number;
      }
    ];
    sections: [
      {
        id: string;
        heading: string;
        body: string;
        sort_order: number;
      }
    ];
    read_time_minutes: number | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
  }
}
```

No `is_main`, `main_image_id`, or new image table contract is required for this iteration.

## Validation Rules

- `main_image_index` must be a valid zero-based index into the uploaded `images[]` files.
- `main_image_url` must belong to the target blog post before using it as `cover_image_url`.
- If both fields are sent, prefer `main_image_url` only when it matches an existing image for the post; otherwise use `main_image_index`.
- Do not break existing create/update requests that do not include these fields.

## Frontend Integration Notes

The frontend currently appends these fields in `frontend/src/features/blogs/services/blog.service.ts`:

```ts
main_image_index
main_image_url
```

Once the backend persists `cover_image_url` from these fields, no additional frontend storage is needed.
