# Messages Supabase RPC Spec

This document defines the first RPC layer for the Supabase-backed messages
prototype.

The schema starter lives in:

- [supabase/migrations/20260402153000_messages_schema.sql](/Users/nubiaville/Documents/alumniApp/supabase/migrations/20260402153000_messages_schema.sql)
- [supabase/seed.sql](/Users/nubiaville/Documents/alumniApp/supabase/seed.sql)

The RPCs below are the smallest useful set for getting the current frontend off
the mock transport while keeping business rules in SQL.

## General Rules

- derive the acting user from `auth.uid()`, not from request body
- keep thread creation and message sending transactional
- return canonical IDs and `server_time` from the database
- use these RPCs for writes first
- use plain `select` queries or a read-focused RPC for inbox/thread reads

## Required RPCs

### `messages_create_direct_thread`

Suggested signature:

```sql
messages_create_direct_thread(
  p_participant_member_id text,
  p_topic text default null
)
```

Responsibilities:

- resolve the caller from `auth.uid()`
- resolve the target participant from `member_id`
- build a deterministic `direct_key`
- return the existing direct thread if one already exists
- otherwise create the thread and both participant rows

Suggested return shape:

```ts
{
  thread_id: string;
  created_new: boolean;
  server_time: string;
}
```

### `messages_create_group_thread`

Suggested signature:

```sql
messages_create_group_thread(
  p_title text,
  p_member_ids text[],
  p_description text default null,
  p_topic text default null,
  p_category text default 'Community'
)
```

Responsibilities:

- resolve the caller from `auth.uid()`
- create the group thread
- insert the caller if not already present in `p_member_ids`
- insert all participant rows
- return the new thread ID

Suggested return shape:

```ts
{
  thread_id: string;
  server_time: string;
}
```

### `messages_send_message`

Suggested signature:

```sql
messages_send_message(
  p_thread_id uuid,
  p_body text,
  p_client_generated_id text,
  p_attachment_ids uuid[] default '{}'
)
```

Responsibilities:

- verify the caller belongs to the thread
- insert the message row
- attach any staged attachments to the new message
- update `message_threads.last_message_at`
- update `message_threads.last_message_preview`
- update `message_threads.last_message_sender_name`
- return the canonical message ID

Suggested return shape:

```ts
{
  thread_id: string;
  message_id: string;
  server_time: string;
}
```

Notes:

- this is where `client_generated_id` deduplication should happen
- attachment IDs should belong to the caller and the same thread

### `messages_mark_thread_read`

Suggested signature:

```sql
messages_mark_thread_read(
  p_thread_id uuid,
  p_last_seen_message_id uuid
)
```

Responsibilities:

- verify the caller belongs to the thread
- update the caller's participant row:
  - `last_read_message_id`
  - `last_read_at`
- return the thread ID and viewer-specific unread count

Suggested return shape:

```ts
{
  thread_id: string;
  unread_count: number;
  server_time: string;
}
```

### `messages_mark_message_delivered`

Suggested signature:

```sql
messages_mark_message_delivered(
  p_thread_id uuid,
  p_message_id uuid
)
```

Responsibilities:

- verify the caller belongs to the thread
- advance the caller's `last_delivered_message_id` only forward
- never move delivery backwards
- return the receipt target that changed

Suggested return shape:

```ts
{
  thread_id: string;
  message_id: string;
  server_time: string;
}
```

## Optional Read RPCs

You can keep reads as normal Supabase queries, but these two RPCs will make the
frontend adapter much easier if you want viewer-specific payloads directly from SQL.

### `messages_list_threads`

Suggested signature:

```sql
messages_list_threads(
  p_limit integer default 50
)
```

Suggested return shape:

- one row per thread summary
- or a single JSON payload containing:
  - `threads`
  - `unread_count`
  - `sync_token`
  - `polling_interval_ms`
  - `server_time`

### `messages_get_thread`

Suggested signature:

```sql
messages_get_thread(
  p_thread_id uuid,
  p_limit integer default 50,
  p_before_message_id uuid default null
)
```

Suggested return shape:

- a single JSON payload that maps closely to `GetMessageThreadResponse`

## Frontend Mapping Notes

These RPCs should feed the existing contract in:

- [messages.contract.ts](/Users/nubiaville/Documents/alumniApp/src/features/messages/api/messages.contract.ts)

Recommended mapping rules:

- ignore `viewerMemberId` for write authorization once Supabase auth is active
- keep accepting `viewerMemberId` in the frontend transport for now so the page and
  hooks do not need to change
- map outgoing status like this:
  - `sending`: optimistic frontend-only state
  - `sent`: message row exists
  - `delivered`: recipient `last_delivered_message_id` has passed the message
  - `seen`: recipient `last_read_message_id` has passed the message
