# Messages Supabase Implementation Plan

This document is the phased implementation plan for introducing a live
Supabase-backed messages backend while keeping the current mock transport active
until the live path has clean parity.

The goal is to make the chat feature work across real devices quickly while still
keeping the frontend architecture clean enough to migrate later to a dedicated
backend with minimal churn.

Related security handoff:

- [docs/messages-edge-functions-security-plan.md](/Users/nubiaville/Documents/alumniApp/docs/messages-edge-functions-security-plan.md)

## Current Migration Rule

For now:

- keep the current mock transport as the active runtime
- do not import Supabase directly into pages, hooks, login, or logout flows
- add the Supabase path beside the mock path, not in place of it
- cut over only after inbox, thread load, send, attachments, and receipts all
  work cleanly in a tester-only flow
- remove the mock implementation only after the live path has passed the full QA
  checklist

## What This Plan Is Optimizing For

- get `/messages` working beyond one browser and one machine
- keep the current frontend feature contract stable
- support realtime new messages, delivery receipts, and seen receipts
- use the existing mock implementation as the UX guide
- avoid locking page components directly to Supabase APIs

## When To Choose This Plan

Choose Supabase if the immediate priority is:

- seeing the feature behave live across devices
- moving faster than a custom reference backend would allow
- getting storage, database, and realtime from one hosted platform

Do not choose this path if the main goal is reproducing the exact architecture of
the future dedicated backend. Supabase is the faster prototype platform, not the
closest match to a hand-built API server.

## Core Architectural Rules

### 1. Keep The Current Frontend Contract Stable

The current transport boundary is already the right abstraction:

- [src/features/messages/api/messages.contract.ts](/Users/nubiaville/Documents/alumniApp/src/features/messages/api/messages.contract.ts)
- [src/features/messages/services/messages.service.ts](/Users/nubiaville/Documents/alumniApp/src/features/messages/services/messages.service.ts)

The page and hooks should keep calling the same methods:

- `listThreads`
- `getThread`
- `uploadAttachment`
- `sendMessage`
- `markThreadRead`
- `createDirectThread`
- `createGroupThread`

Supabase should be introduced behind a new transport implementation, not imported
directly into page components.

### 1a. Keep The Mock Path Fully Usable During Migration

Do not change the current working mock flow while preparing Supabase.

That means:

- `messages.service.ts` should continue pointing to the mock transport until a
  later cutover phase
- mock data remains the baseline reference for expected UX and message shapes
- the Supabase implementation should be built behind a feature flag or isolated
  test-only entry point first

### 2. Treat Supabase As Infrastructure, Not As Component State

Do not let UI code depend on:

- raw table row shapes
- raw storage paths
- raw realtime payloads
- Supabase auth objects

Instead, the transport and realtime bridge should map Supabase data into the
existing frontend message types in:

- [src/features/messages/types/messages.types.ts](/Users/nubiaville/Documents/alumniApp/src/features/messages/types/messages.types.ts)

### 3. Use Database Transactions For Multi-Step Operations

Simple selects are fine through the Supabase client.

Anything that involves multiple writes should be implemented as SQL functions and
called through `supabase.rpc(...)`.

That applies to:

- create direct thread
- create group thread
- send message
- mark thread read
- mark message delivered

This keeps business rules in one place and avoids race conditions from trying to
coordinate multi-step writes in the browser.

### 4. Realtime Is A Push Layer, Not The Source Of Truth

Realtime should notify the frontend that something changed.

The database remains the source of truth for:

- message order
- thread membership
- unread counts
- delivered cursor
- seen cursor

On reconnect or mismatch, the frontend should refetch and resync rather than
trusting stale in-memory state.

## What To Add To The Codebase

Add these pieces later, but do not wire them into the live app yet:

- `src/features/messages/lib/supabase/messagesSupabaseClient.ts`
- `src/features/messages/lib/supabase/messagesSupabaseTransport.ts`
- `src/features/messages/lib/supabase/messagesSupabaseRealtime.ts`
- `src/features/messages/lib/supabase/messagesSupabaseMappers.ts`
- `src/features/messages/lib/messagesCache.ts`
- a small transport switch or feature flag so testers can opt into Supabase
  without breaking the rest of the app

Do not add Supabase session sync inside:

- login form
- logout flow
- page components
- shared layout components

Those should stay backend-agnostic.

## Recommended Frontend Shape

Add a dedicated Supabase implementation layer under the messages feature.

Suggested files:

- `src/features/messages/lib/supabase/messagesSupabaseClient.ts`
- `src/features/messages/lib/supabase/messagesSupabaseTransport.ts`
- `src/features/messages/lib/supabase/messagesSupabaseRealtime.ts`
- `src/features/messages/lib/supabase/messagesSupabaseMappers.ts`
- `src/features/messages/lib/messagesCache.ts`

Starter database assets for this plan now live in:

- `supabase/migrations/20260402153000_messages_schema.sql`
- `supabase/seed.sql`
- `docs/messages-supabase-rpc-spec.md`

Recommended responsibilities:

- `messagesSupabaseClient.ts`
  - create and export the Supabase client
  - hold environment-variable wiring
- `messagesSupabaseTransport.ts`
  - implement the `MessagesTransport` interface
  - turn contract calls into `select`, `insert`, `rpc`, and storage operations
- `messagesSupabaseRealtime.ts`
  - open and tear down realtime subscriptions
  - listen for message, participant, and receipt updates
  - emit delivery and read acknowledgements
- `messagesSupabaseMappers.ts`
  - convert Supabase rows into `MessageThreadSummary`, `MessageThreadDetail`, and `MessageItem`
- `messagesCache.ts`
  - contain React Query cache patch helpers so HTTP responses and realtime events
    update the cache consistently

## What To Add In Supabase

Set up these platform pieces:

- a Supabase project
- Auth users for internal testers
- `chat_profiles`
- `message_threads`
- `message_thread_participants`
- `message_messages`
- `message_attachments`
- storage bucket for message attachments
- RLS policies
- SQL functions / RPCs for multi-step writes
- realtime enabled for the message and participant tables you subscribe to

## Recommended Supabase Data Model

Use a relational model that mirrors the current feature behavior.

### `chat_profiles`

Purpose:

- maps a Supabase-authenticated user to the app's `memberId`
- provides sender and participant display data for chat

Suggested fields:

- `id uuid primary key`
- `auth_user_id uuid unique null references auth.users(id)`
- `member_id text unique not null`
- `slug text not null`
- `full_name text not null`
- `first_name text not null`
- `headline text not null`
- `location text not null`
- `graduation_year int not null`
- `avatar_url text null`
- `initials text not null`
- `profile_href text not null`
- `presence text not null default 'offline'`
- `created_at timestamptz not null default now()`

Notes:

- the starter SQL keeps `id` separate from `auth_user_id` so seed data can be loaded
  before test users are fully linked in Supabase Auth
- `member_id` stays important because the current frontend contract already uses it

### `message_threads`

Purpose:

- stores the shared conversation record

Suggested fields:

- `id uuid primary key`
- `type text not null check (type in ('direct', 'group'))`
- `category text not null`
- `title text null`
- `subtitle text null`
- `topic text not null default ''`
- `description text null`
- `avatar_url text null`
- `initials text null`
- `is_archived boolean not null default false`
- `attachments_enabled boolean not null default true`
- `audio_enabled boolean not null default true`
- `created_by uuid not null references chat_profiles(id)`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `last_message_at timestamptz null`

### `message_thread_participants`

Purpose:

- defines who belongs to a thread
- stores per-user state like unread and receipts

Suggested fields:

- `thread_id uuid not null references message_threads(id)`
- `profile_id uuid not null references chat_profiles(id)`
- `member_id text not null`
- `role_in_thread text not null default 'member'`
- `is_pinned boolean not null default false`
- `joined_at timestamptz not null default now()`
- `last_delivered_message_id uuid null`
- `last_read_message_id uuid null`
- `last_read_at timestamptz null`
- primary key `(thread_id, profile_id)`

Notes:

- this table is the key to `delivered` and `seen`
- for direct chat, the sender's message status can be derived from the recipient row

### `message_messages`

Purpose:

- stores every message row

Suggested fields:

- `id uuid primary key`
- `thread_id uuid not null references message_threads(id)`
- `sender_profile_id uuid not null references chat_profiles(id)`
- `sender_member_id text not null`
- `body text not null default ''`
- `client_generated_id text not null`
- `created_at timestamptz not null default now()`
- `deleted_at timestamptz null`

Recommended indexes:

- `(thread_id, created_at desc)`
- `(sender_profile_id, created_at desc)`
- unique `(thread_id, client_generated_id)`

Notes:

- `client_generated_id` lets the frontend deduplicate optimistic sends
- do not store `sent`, `delivered`, and `seen` as the only source of truth here
- derive delivery/read state from participant cursors when possible

### `message_attachments`

Purpose:

- stores attachment metadata linked to a message

Suggested fields:

- `id uuid primary key`
- `message_id uuid null references message_messages(id)`
- `thread_id uuid not null references message_threads(id)`
- `uploader_profile_id uuid not null references chat_profiles(id)`
- `kind text not null check (kind in ('file', 'image', 'audio'))`
- `file_name text not null`
- `mime_type text not null`
- `size_in_bytes bigint not null`
- `duration_seconds int null`
- `upload_state text not null default 'uploaded'`
- `storage_bucket text not null`
- `storage_path text not null`
- `public_url text null`
- `waveform jsonb null`
- `created_at timestamptz not null default now()`

## Suggested Storage Layout

Use Supabase Storage for image, file, and voice-note uploads.

Recommended bucket structure:

- bucket: `message-attachments`
- path pattern: `threads/{threadId}/{messageOrTempId}/{fileName}`

Rules:

- keep images and audio in the same bucket for MVP
- save the canonical bucket and path in `message_attachments`
- do not let components build storage URLs themselves
- generate URLs through the transport layer

## Auth Strategy For The Prototype

This is the biggest design decision in a Supabase prototype.

### Recommended Prototype Choice

Use Supabase Auth for the prototype and map each chat user to a real `memberId`.

That means:

- each internal tester has a Supabase user
- each Supabase user maps to exactly one `chat_profiles` row
- the transport still returns `memberId` to the rest of the app

Why this is the best prototype choice:

- it makes RLS straightforward
- it keeps the browser on the safe side of the database
- it avoids needing a custom auth-signing backend just to test chat

### What To Avoid

Avoid using the service role key from the browser.

Avoid bypassing RLS just to make the prototype easier.

Avoid spreading Supabase auth handling across multiple feature components.

## Row-Level Security Plan

Use RLS as the thread-access guardrail.

High-level rule set:

- a user can read a thread only if they are in `message_thread_participants`
- a user can read messages only if they are in the parent thread
- a user can insert a message only into a thread they belong to
- a user can update only their own participant row for delivery and read cursors
- a user can upload attachments only for threads they belong to

Practical rule of thumb:

- most chat tables should be `authenticated` only
- authorization should be based on `auth.uid()` matching `profile_id`

## Mapping The Current Contract To Supabase

### `listThreads`

Recommended implementation:

- call an RPC or select from a view that returns viewer-specific inbox summaries
- include:
  - `unreadCount`
  - `isPinned`
  - `lastMessagePreview`
  - `lastMessageSenderName`
  - participant summaries

Why RPC is attractive here:

- inbox summaries are viewer-specific
- direct chat titles and subtitles often need participant joins
- unread counts are easier to compute once in SQL than repeatedly in the browser

### `getThread`

Recommended implementation:

- fetch thread metadata
- fetch participant rows
- fetch ordered messages
- fetch attachments
- map all of that into `MessageThreadDetail`

For MVP, a single RPC can return a denormalized payload.

### `uploadAttachment`

Recommended implementation:

- upload the file to Supabase Storage
- create an attachment metadata row
- return the attachment in the existing `MessageAttachment` shape

For larger files later, move to signed upload URLs or resumable uploads.

### `sendMessage`

Recommended implementation:

- call an RPC that:
  - validates membership
  - inserts the message
  - links any staged attachments
  - updates `message_threads.last_message_at`
  - returns the full refreshed thread or at least the created message payload

Why RPC is preferred:

- message send is transactional
- it prevents split-brain cases where attachments upload but the message insert fails

### `markThreadRead`

Recommended implementation:

- extend the request shape to include `lastSeenMessageId`
- update the caller's participant row:
  - `last_read_message_id`
  - `last_read_at`

Suggested future contract:

```ts
{
  viewerMemberId: string;
  threadId: string;
  lastSeenMessageId: string;
}
```

### `createDirectThread`

Recommended implementation:

- call an RPC that:
  - sorts the two participants deterministically
  - checks whether a direct thread already exists
  - returns the existing one if found
  - otherwise creates a thread and two participant rows

This should not be handled as ad hoc browser inserts.

### `createGroupThread`

Recommended implementation:

- call an RPC that:
  - creates the thread
  - inserts all participant rows
  - returns the new thread detail payload

## Realtime Architecture In Supabase

Use realtime for push, not for initial state.

### Tables To Watch

For MVP, the frontend should subscribe to changes in:

- `message_messages`
- `message_thread_participants`
- optionally `message_threads`

This covers:

- new messages
- delivery cursor updates
- read cursor updates
- thread ordering changes

### What The Frontend Should Do With Realtime Events

When a new message arrives:

- patch the active thread cache if open
- patch the inbox preview for that thread
- increment unread state if the thread is not active
- if the message is incoming, acknowledge delivery

When a participant cursor changes:

- recompute message status for the sender side
- refresh unread counts for the affected thread
- if needed, update `seen` badges for outgoing messages

When the realtime connection drops:

- reconnect
- refetch inbox
- refetch active thread

### Delivery And Seen Semantics

For this Supabase implementation, define the states as:

- `sent`: the message row exists in the database
- `delivered`: the recipient's `last_delivered_message_id` has advanced past the message
- `seen`: the recipient's `last_read_message_id` has advanced past the message

That means the frontend should not wait for a message-row status update.

Instead, it should derive outgoing message status from:

- message order
- recipient participant cursor values

This is a better long-term model than storing mutable status on every message row.

## Recommended Cache Strategy

The current UI already expects normalized thread data.

To keep realtime manageable:

- centralize all inbox patching in one helper
- centralize all thread patching in one helper
- centralize outgoing-status derivation in one helper

That makes it possible for:

- initial fetches
- optimistic sends
- realtime inserts
- realtime receipts

to all update state the same way.

## Proposed Build Order

### Phase 0. Keep Mock As The Active Runtime

- keep [src/features/messages/services/messages.service.ts](/Users/nubiaville/Documents/alumniApp/src/features/messages/services/messages.service.ts)
  pointing to the mock transport
- keep using the mock inbox reset and the current manual QA flow
- treat the mock behavior as the parity reference

Deliverable:

- the current feature remains stable while Supabase work starts in parallel

### Phase 1. Supabase Project Setup

- create the Supabase project
- create the database tables
- create storage bucket
- create RLS policies
- seed internal test users and matching `chat_profiles`

Deliverable:

- multiple people can authenticate and read only their own chat data

### Phase 2. Read-Only Supabase Adapter

- add the Supabase client, mapper, and read queries
- load inbox and thread data from Supabase in a controlled tester-only path
- compare the live responses against the mock contract and UI expectations
- do not replace the global transport yet

Deliverable:

- inbox and thread rendering work against live data without changing the default app flow

### Phase 3. Write Parity

- implement direct thread creation
- implement group thread creation
- implement message send
- implement attachment upload
- implement mark-read
- keep this behind a tester-only switch until the flows are reliable

Deliverable:

- one tester can create, send, and read through Supabase without affecting the
  mock default path

### Phase 4. Controlled Transport Cutover

- add a feature flag or isolated environment toggle for the Supabase transport
- let a small tester group use the live path
- keep the mock path available as fallback

Deliverable:

- live inbox, thread loading, direct chat creation, group creation, send, and
  attachment upload all work for selected testers

### Phase 5. Realtime Messaging

- subscribe to message inserts
- patch inbox and open thread state in real time
- stop relying on timer-based mock status changes

Deliverable:

- new messages arrive live across devices

### Phase 6. Delivery Receipts

- when an incoming message is received in the client, advance the viewer's
  `last_delivered_message_id`
- reflect that in the sender UI by recomputing outgoing statuses

Deliverable:

- sent messages become `delivered` from actual recipient activity

### Phase 7. Seen Receipts

- when the thread is open and visible, update `last_read_message_id`
- recompute outgoing statuses for the sender

Deliverable:

- sent messages become `seen` from actual thread viewing behavior

### Phase 8. Hardening And Mock Retirement

- handle reconnect and stale subscriptions
- add pagination
- add resumable uploads for larger media
- add presence if needed
- remove the mock transport only after parity and QA are complete

## What The Frontend Owns

- Supabase client initialization
- transport implementation
- row-to-model mapping
- React Query cache updates
- optimistic send state
- delivery acknowledgement from the recipient client
- read acknowledgement from the active thread
- reconnect refetch behavior

## What Supabase Owns

- persistent message and thread storage
- access control through RLS
- file storage
- realtime change delivery
- transactional message creation through SQL functions

## Migration Plan To A Dedicated Backend Later

This prototype should be built so it can be retired cleanly.

### Keep These Boundaries Stable

- `MessagesTransport`
- frontend message types
- page-level hooks
- cache patch helpers

### Keep Supabase-Specific Logic Isolated

- only the new Supabase transport and realtime files should know about table names
- only mappers should know about row shapes
- only auth helpers should know about Supabase sessions

### Later Migration Strategy

When the dedicated backend is ready:

- replace `messagesSupabaseTransport` with `apiMessagesTransport`
- replace Supabase realtime subscriptions with backend websocket client logic
- keep the rest of the feature intact

If we keep those boundaries clean, the migration becomes a transport swap instead
of a UI rewrite.

## Known Tradeoffs

- Supabase is faster to stand up than a custom backend, but it is not identical to
  the final architecture
- using Supabase Auth for the prototype introduces a second auth system temporarily
- inbox summary queries will likely be easier in SQL functions than in plain client
  queries
- delivery and seen status should be cursor-derived, which adds mapper/cache logic
  on the frontend

## Recommended Decision

If the priority is to see the feature work live, share it, and validate the user
experience before the dedicated backend is ready, this is a strong path.

The success condition is not "move the whole app to Supabase."

The success condition is:

- build a live messages backend quickly
- keep the UI contract stable
- prove the message flows and receipt rules with real users
- make the eventual migration mostly an adapter replacement
