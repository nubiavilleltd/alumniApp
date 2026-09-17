# Homepage Hero Day/Night Image Backend Handoff

## Purpose

The homepage hero should use different carousel images during the user's local day and night.

The backend should store a day/night tag for every carousel image and return all active images. The frontend will read the user's device time, determine whether the current period is `day` or `night`, and filter the returned images locally.

The backend must not filter images using server time or return only one time period.

## New Image Field

Add this field to every homepage carousel image:

```ts
time_of_day: 'day' | 'night';
```

Recommended database definition:

```sql
time_of_day VARCHAR(5) NOT NULL DEFAULT 'day'
```

Only these values are valid:

- `day`
- `night`

For existing carousel records, backfill `time_of_day` to `day` initially. Admins can then change selected images to `night`.

## GET Homepage Content

Existing endpoint:

```http
GET /homepage
```

The response should include both day and night images, provided they are not hidden. Keep the existing `sort_order` ordering.

Example:

```json
{
  "homepage": {
    "greeting_title": "Welcome home",
    "greeting_message": "Stay connected with the alumni community.",
    "carousel_images": [
      {
        "id": "101",
        "image_url": "https://example.com/day-hero.jpg",
        "file_name": "day-hero.jpg",
        "alt_text": "Alumni gathering during the day",
        "sort_order": 1,
        "is_hidden": "0",
        "show_greeting": "1",
        "time_of_day": "day"
      },
      {
        "id": "102",
        "image_url": "https://example.com/night-hero.jpg",
        "file_name": "night-hero.jpg",
        "alt_text": "Alumni gathering at night",
        "sort_order": 2,
        "is_hidden": "0",
        "show_greeting": "1",
        "time_of_day": "night"
      }
    ]
  }
}
```

Required behavior:

- Return all non-hidden images from both `day` and `night` groups.
- Do not use the backend server's current time to filter the response.
- Do not limit the response to one image or one time-of-day group.
- Preserve `show_greeting` independently for every image. Multiple images may have `show_greeting = "1"`.
- Preserve the existing `sort_order` behavior.

## Create Carousel Image

Existing endpoint:

```http
POST /create_carousel_image
Content-Type: multipart/form-data
```

Add this form field:

```text
time_of_day: day | night
```

Example fields:

```text
image: <uploaded file>
alt_text: Alumni gathering during the day
sort_order: 1
is_hidden: 0
time_of_day: day
```

The response should return the created image, including `time_of_day`.

For backward compatibility, an omitted `time_of_day` may default to `day` while the frontend is being updated. Invalid values must be rejected with a validation error.

## Update Carousel Image

Existing endpoint:

```http
POST /update_carousel_image
```

Accept `time_of_day` in both the JSON and multipart update formats:

```json
{
  "id": "102",
  "time_of_day": "night",
  "show_greeting": "1"
}
```

The update must modify only the supplied fields and return the complete updated image, including:

```json
{
  "id": "102",
  "time_of_day": "night",
  "show_greeting": "1"
}
```

Updating one image's `time_of_day` must not change the tag or `show_greeting` value of any other image.

## Admin and Public Response Rules

- Admin homepage responses may include hidden images so they can be managed.
- Public homepage responses should continue excluding hidden images.
- Both admin and public responses should include `time_of_day` for every returned image.
- The backend should not calculate day/night from a server timezone.

## Acceptance Criteria

1. A carousel can contain multiple `day` images and multiple `night` images.
2. `GET /homepage` returns all active images from both groups in `sort_order` order.
3. Create and update requests persist `time_of_day` and return it in the response.
4. Values other than `day` and `night` are rejected.
5. `show_greeting` remains independent and can be enabled for multiple images.
6. Existing images continue working after migration and are assigned a valid default tag.
7. No endpoint filters images based on the backend server's current time.
