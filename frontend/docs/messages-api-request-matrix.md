# Messages API Request Matrix

This file is a systematic backend checklist for the current `/messages` feature.

It answers:

- which `GET` requests we need
- which `POST` requests we need
- what parameters each request needs
- what each request is used for in the UI
- what is still missing or not fully defined yet

## Current Frontend Behavior

- The inbox shows message threads, not raw messages.
- Threads are the conversations the current user has with:
  - one other user in a direct chat
  - multiple users in a group chat
- The inbox should show the most recent threads first.
- Clicking a thread loads all messages for that thread.
- Sending a message posts it to the backend for:
  - one recipient in a direct thread
  - all members in a group thread
- The frontend currently polls for updates every `6` seconds, not `5`.
  - source: `MESSAGE_POLLING_INTERVAL_MS = 6_000`

## The Core Data Flow

1. Load inbox threads.
2. Sort them by `lastActivityAt` descending.
3. Show thread summaries in the left pane.
4. When a thread is opened, fetch that thread's full detail.
5. When a message is sent, persist it to the thread.
6. Mark the thread as read when the user opens it.
7. Poll inbox and active thread for updates.

## Required GET Requests

### 1. Get Inbox Threads

- Method: `GET`
- Path: `/messages/threads`
- Used by:
  - initial messages page load
  - ongoing inbox polling
  - refresh / pull-to-refresh

Parameters:

```ts
{
  viewerMemberId: string;
  syncToken?: string;
  limit?: number;
}
```

Response:

```ts
{
  threads: MessageThreadSummary[];
  unreadCount: number;
  syncToken: string;
  pollingIntervalMs: number;
  serverTime: string;
}
```

What backend must do:

- return only threads the current user belongs to
- sort by `lastActivityAt` descending
- compute `unreadCount` per viewer
- include enough summary data for the inbox card:
  - thread title
  - subtitle
  - preview text
  - last sender name for group previews
  - unread count
  - presence for direct chats

### 2. Get One Thread

- Method: `GET`
- Path: `/messages/threads/:threadId`
- Used by:
  - clicking a thread in the inbox
  - opening a thread from alumni directory
  - opening a thread from alumni profile
  - opening a thread from marketplace
  - active-thread polling

Parameters:

```ts
{
  viewerMemberId: string;
  threadId: string;
  limit?: number;
  beforeMessageId?: string;
}
```

Response:

```ts
{
  thread: MessageThreadDetail;
  syncToken: string;
  serverTime: string;
}
```

What backend must do:

- check access to the thread
- return all thread summary fields plus all messages for that thread
- return participants and thread metadata needed for the header
- return `attachmentsEnabled` and `audioEnabled`

### 3. Optional Poll Endpoint

- Method: `GET`
- Path: `/messages/poll`
- Status:
  - reserved
  - not currently used by the frontend

Possible parameters:

```ts
{
  viewerMemberId: string;
  syncToken?: string;
  activeThreadId?: string;
}
```

Possible response:

```ts
{
  inboxChanged: boolean;
  threadChanged?: boolean;
  syncToken: string;
  pollingIntervalMs: number;
  serverTime: string;
}
```

Why it may help later:

- lighter polling than refetching full inbox and thread every time
- easier bridge before websockets

## Required POST Requests

### 1. Create Or Reuse Direct Thread

- Method: `POST`
- Path: `/messages/threads/direct`
- Used by:
  - clicking `Send Message` on alumni directory
  - clicking `Send Message` on alumni profile
  - clicking `Send Message` on marketplace

Parameters:

```ts
{
  viewerMemberId: string;
  participantMemberId: string;
  topic?: string;
}
```

Response:

```ts
{
  thread: MessageThreadDetail;
  serverTime: string;
}
```

What backend must do:

- create a direct thread if none exists
- return the existing direct thread if one already exists between those two users
- make sure only two users are in this thread

Important note:

- Marketplace still uses this same endpoint.
- The recipient is the `business.ownerId`, not the business itself.

### 2. Create Group Thread

- Method: `POST`
- Path: `/messages/threads/group`
- Used by:
  - future group creation flow

Parameters:

```ts
{
  viewerMemberId: string;
  title: string;
  memberIds: string[];
  description?: string;
  topic?: string;
  category?: 'Mentorship' | 'Events' | 'Marketplace' | 'Community';
}
```

Response:

```ts
{
  thread: MessageThreadDetail;
  serverTime: string;
}
```

What backend must do:

- include the creator in the member list
- dedupe member IDs
- initialize group read state

### 3. Send Message

- Method: `POST`
- Path: `/messages/messages`
- Used by:
  - chat composer submit

Parameters:

```ts
{
  viewerMemberId: string;
  threadId: string;
  body?: string;
  attachments?: MessageAttachment[];
  clientGeneratedId: string;
}
```

Response:

```ts
{
  thread: MessageThreadDetail;
  messageId: string;
  serverTime: string;
}
```

What backend must do:

- reject empty sends if no body and no attachments
- append the message to the target thread
- for direct threads, make it visible to the other user
- for group threads, make it visible to the thread members
- return the updated thread or enough data for the frontend to refetch cleanly
- use `clientGeneratedId` for idempotency protection

### 4. Upload / Prepare Attachment

- Method: `POST`
- Path: `/messages/attachments`
- Used by:
  - file attach button
  - audio note button

Parameters:

```ts
{
  viewerMemberId: string;
  fileName: string;
  mimeType: string;
  sizeInBytes: number;
  kind: 'file' | 'image' | 'audio';
  durationSeconds?: number;
  source: 'device' | 'microphone';
}
```

Response:

```ts
{
  attachment: MessageAttachment;
  serverTime: string;
}
```

What backend must do:

- validate file metadata
- return a normalized attachment object
- later this can evolve into:
  - multipart upload
  - signed upload URL
  - storage-backed media pipeline

### 5. Mark Thread As Read

- Method: `POST`
- Path: `/messages/threads/:threadId/read`
- Used by:
  - opening an unread conversation

Parameters:

```ts
{
  viewerMemberId: string;
  threadId: string;
}
```

Response:

```ts
{
  threadId: string;
  unreadCount: number;
  serverTime: string;
}
```

What backend must do:

- update read state only for the current viewer
- not affect unread state for other members

## Summary Of What The UI Needs

### Inbox

The inbox needs:

- all recent threads for the user
- sorted newest first
- preview text
- unread badge counts
- direct vs group type
- participant identity for naming and avatars

### Active Thread

The active thread pane needs:

- thread identity
- other user or group members
- full message list
- message timestamps
- delivery status
- attachments

### Composer

The composer needs:

- send message
- upload file
- upload or prepare audio note

## What You Are Missing

These are the main things still not fully defined or not fully live yet.

### 1. Exact Polling Contract

Right now the frontend polls:

- inbox threads
- active thread

every `6` seconds.

That works, but you still need to decide:

- whether to keep polling full payloads
- whether to add a lightweight `/messages/poll`
- when to switch to websockets

### 2. Auth Source

Right now requests include `viewerMemberId`.

Long-term, the backend should probably derive the viewer from the auth token instead, then ignore or validate `viewerMemberId`.

### 3. Message Pagination

The current thread request already supports:

- `limit`
- `beforeMessageId`

But the UI does not yet render “load older messages”.

So pagination is prepared in the contract, but not finished as a feature.

### 4. Real Attachment Upload Flow

Right now attachments are treated like prepared metadata.

You still need to define:

- where files are stored
- whether uploads are direct-to-storage or backend-proxied
- how URLs are returned

### 5. Group Management

The current contract can create a group, but does not yet define:

- add member
- remove member
- leave group
- rename group

If group chat will be important, those will likely become additional `POST` endpoints.

### 6. Read / Delivery Semantics

The frontend already supports:

- `sent`
- `delivered`
- `seen`
- `failed`

You still need backend rules for:

- when a message becomes `delivered`
- when it becomes `seen`
- whether group messages track seen per member or just aggregate state

### 7. Typing / Presence / Online Status

The UI has a place for presence labels in direct chat, but there is no real presence service yet.

This is optional for now, but it is still missing as a live backend feature.

### 8. Notifications Outside The Messages Page

The inbox unread count is present, but if you want:

- nav-bar badges
- push notifications
- email notifications

those are still separate backend concerns.

## Minimum Backend Set To Make The Current UI Work

If you want the current UI to work end to end, the minimum must-have endpoints are:

- `GET /messages/threads`
- `GET /messages/threads/:threadId`
- `POST /messages/threads/direct`
- `POST /messages/threads/group`
- `POST /messages/messages`
- `POST /messages/attachments`
- `POST /messages/threads/:threadId/read`

Everything else is optional or future-facing.
