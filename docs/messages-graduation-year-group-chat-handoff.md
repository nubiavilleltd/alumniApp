# Graduation-Year Group Chat Handoff

## Goal

Every alumna belongs to one default class group based on her `graduation_year`.

Example:

- If 5 users have `graduation_year = 2014`
- they all belong to the same group thread
- that thread is the `Class of 2014` group

For now:

- the backend should create and maintain these groups automatically
- the frontend should treat them like normal group chats
- per-message group status stays `Sent`
- we are **not** tracking `Delivered` or `Seen` for group messages

Manual group renaming by admin can come later. It is not part of this handoff.

## No Table Changes Needed

The current messaging tables are enough.

- `message_threads`
  - one row for the `Class of YEAR` group
- `thread_participants`
  - one row per user in that year group
- `messages`
  - one row per sent message
- `messages_attachments`
  - one row per uploaded file or voice note

This should reuse the same schema as direct chats and other groups.

## Backend Responsibilities

### 1. Ensure one group thread per graduation year

The backend should guarantee:

- one active group thread for each graduation year that has users
- thread type = `group`
- default title = `Class of 2014`, `Class of 2015`, etc.
- category can default to `community`

Important:

- do not create duplicate year groups
- use one stable thread per year

### 2. Automatically manage membership

The backend should automatically add users to the correct year group based on `graduation_year`.

That means:

- if a user has `graduation_year = 2014`, add them to the `Class of 2014` group
- if a new user with that year is approved later, add them too
- if a user’s graduation year changes, move them to the correct class group

Recommended behavior when graduation year changes:

- soft-leave the old group by setting `left_at`
- add or reactivate the membership row in the new group

### 3. Return these groups in inbox normally

`get_threads` should return graduation-year groups the same way it returns any other group thread.

The frontend should not need a special endpoint just for class groups.

Each thread should still include:

- `thread_id`
- `type = group`
- `title`
- `category`
- `participants`
- `last_message_preview`
- `unread_count`
- `is_pinned`

### 4. Return thread detail normally

`get_thread` should work the same way it already does for other threads.

The frontend still needs:

- thread metadata
- participant list
- messages
- attachments

### 5. Let group messages use the same send path

Sending to a graduation-year group should use the normal existing-thread flow:

- `send_message`
- `upload_attachment`
- `delete_message`

No special send endpoint is needed for class groups.

### 6. Keep group status simple

For graduation-year group chats:

- do not try to derive `Delivered`
- do not try to derive `Seen`
- own messages can stay at `Sent`

This is already how the frontend treats group messages today.

## Frontend Responsibilities

### 1. Render class groups like normal groups

The frontend should:

- show the group in the inbox
- open it in the thread pane
- render the participant list
- render text, files, and voice notes the same way as other threads
- treat the year group as pinned in the inbox UI, even if that pin is not persisted by backend

No new table logic is needed in the frontend.

### 2. Do not create these groups manually

The frontend should **not**:

- create class-of-year groups itself
- decide who belongs in them
- sync membership based on graduation year

That logic belongs in the backend.

### 3. Keep existing UI behavior

The frontend will still handle:

- local draft text
- local file preview
- local voice-note preview
- optimistic `Sending...`
- retry after failed send
- three-dot message menu

### 4. Keep group message status at `Sent`

The frontend will not show `Delivered` or `Seen` for class groups.

That means:

- direct chats = `Sent / Delivered / Seen`
- graduation-year groups = `Sent`

## Recommended Backend Rules

### Thread creation rule

When the backend sees a graduation year for the first time:

- create one group thread for that year
- example title: `Class of 2014`

### Membership rule

Whenever a user becomes eligible for chat:

- read their `graduation_year`
- ensure their membership exists in that class thread
- if they previously left and should belong again, clear `left_at`

### Inbox rule

A graduation-year group should appear in `get_threads` only if:

- the user is an active participant
- `left_at` is `null`

### Message rule

Messages in year groups should work exactly like any other group message:

- same `messages` table
- same `messages_attachments` table
- same `reply_to_message_id` support later
- same soft delete behavior

## Good Default Shape

Example graduation-year thread:

```json
{
  "thread_id": 14,
  "type": "group",
  "title": "Class of 2014",
  "category": "community"
}
```

## What We Need From Backend

- automatic creation of one group thread per graduation year
- automatic participant syncing based on `graduation_year`
- normal `get_threads` support for these groups
- normal `get_thread` support for these groups
- normal `send_message` / attachment / delete support for these groups
- no per-message delivered/seen logic for group chats

## What Stays Frontend-Only

- composer draft state
- attachment preview
- voice-note preview
- optimistic sending state
- retry UX
- rendering group messages as `Sent`
- local auto-pinning of graduation-year groups in the inbox
