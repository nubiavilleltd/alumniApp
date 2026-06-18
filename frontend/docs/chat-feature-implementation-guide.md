# Chat Feature Implementation Guide

This document explains how the current `/messages` feature in this app works and how to build the same kind of chat system in other apps we work on.

It is based on:

- the current frontend implementation under `src/features/messages`
- `docs/messages-api-handoff.md`
- `docs/messages-api-request-matrix.md`
- `docs/messages-backend-v2-rollout-notes.md`
- `docs/messages-backend-test-integration-notes.md`
- `docs/messages-realtime-implementation-plan.md`
- `docs/messages-heartbeat-presence-plan.md`
- `docs/messages-graduation-year-group-chat-handoff.md`
- `docs/messages-marketplace-auto-reply-handoff.md`

## Executive Summary

The strongest idea in this implementation is not the page layout. It is the layering.

The chat feature is built as:

1. a stable frontend domain model
2. a small set of query and mutation hooks
3. a service layer
4. one backend transport/adapter that reshapes real API payloads into the frontend model
5. one page that focuses on UX, drafts, optimistic sending, and interaction details

That structure is what we should reuse in other apps.

If we rebuild this elsewhere, we should keep:

- the domain model and feature boundaries
- the URL-driven "open a conversation from anywhere" flow
- optimistic sending with canonical refetch
- local draft attachment staging
- transport-level normalization instead of leaking backend quirks into the UI

If we rebuild this elsewhere, we should improve:

- backend support for "create or reuse direct thread"
- backend support for returning full thread detail after send
- real read and delivery semantics
- attachment upload flow
- automated tests around adapters, send flow, and cache updates

## What Exists In This App

### Feature Structure

The main module lives in `src/features/messages` and is split cleanly:

- `types/messages.types.ts`
  - frontend source of truth for threads, messages, participants, attachments, and statuses
- `api/messages.contract.ts`
  - request and response contracts expected by the frontend
- `api/adapters/messages.adapter.ts`
  - validation, MIME normalization, attachment helpers, send-request builders
- `services/messages.service.ts`
  - single entry point the UI calls
- `lib/backendMessagesTransport.ts`
  - backend-specific transport plus payload reshaping
- `hooks/useMessages.ts`
  - React Query hooks for inbox, thread detail, send, upload, delete, read, and thread creation
- `hooks/useStartDirectConversation.ts`
  - shared integration hook for opening chat from other parts of the app
- `hooks/useDraftComposerAttachments.ts`
  - draft attachment state and preview cleanup
- `pages/MessagesPage.tsx`
  - the chat screen orchestration
- `pages/MessagesPage.components.tsx`
  - avatars, delivery badges, attachment rendering, reply cards, participant modal, lightbox
- `pages/messagesPage.utils.ts`
  - optimistic message helpers, formatting helpers, merge logic

### Core Frontend Model

The current model is good enough to reuse almost as-is.

### Thread summary

Each inbox card is a normalized `MessageThreadSummary`:

- `id`
- `type`: `direct | group`
- `category`
- `title`, `subtitle`, `topic`
- avatar or initials
- unread count
- last activity timestamp
- last message preview
- optional last sender name for group previews
- optional delivery state for the latest outgoing message
- participants

### Thread detail

The open thread extends the summary with:

- `description`
- `attachmentsEnabled`
- `audioEnabled`
- `messages`
- `syncToken`
- `pollingIntervalMs`

### Message item

Each message includes:

- `id`
- `clientGeneratedId`
- `threadId`
- sender fields
- `body`
- `createdAt`
- `status`
- `attachments`
- `isOwn`
- optional reply preview
- optional `deletedAt`

### Attachment

Attachments are normalized into one shape for:

- files
- images
- audio/voice notes

This is important because the UI can render a single attachment model even if the backend stores media differently.

### Runtime Architecture

The current runtime flow is:

```text
MessagesPage
  -> useMessagesInbox / useMessageThread / mutations
  -> messagesService
  -> backendMessagesTransport
  -> HTTP API
  -> normalized frontend models
  -> React Query cache
  -> UI render
```

That separation is why the feature remains manageable even though the backend responses are inconsistent in places.

### How The Current Page Works

`MessagesPage.tsx` handles most user interaction:

- inbox filtering and search
- selected thread via URL query string
- opening direct conversations from other parts of the app
- auto-sending initial text for some entry flows
- optimistic local messages
- local draft text
- local attachment staging
- voice note recording
- reply, copy, and delete actions
- participant modal for groups
- image lightbox
- pull-to-refresh on mobile
- polling-based refresh through React Query

The page does not talk to raw API payloads directly. That is a deliberate strength.

## Key Implementation Patterns Worth Reusing

### 1. Stable Frontend Contract

The frontend expects one internal contract regardless of backend shape.

That means:

- the UI never cares whether the backend returned `thread_id`, `group_id`, or `id`
- the UI never cares whether timestamps are ISO or SQL-like strings
- the UI never cares whether category names are lowercase or title case

All of that is normalized inside `backendMessagesTransport.ts`.

This is the single most reusable pattern from the current implementation.

### 2. Transport Adapter As A Shock Absorber

The transport does several important jobs:

- normalizes identifiers
- normalizes timestamps
- reshapes participants
- derives fallback profile details
- derives direct-message status from participant read/delivery cursors
- normalizes attachment payloads
- rebuilds reply previews
- sorts messages and threads
- handles draft direct-thread behavior
- refetches thread detail after send when send endpoints return partial payloads

For other apps, we should always keep a dedicated adapter like this between UI and backend.

### 3. Canonical Refetch After Send

Right now the send endpoints do not always return a full trustworthy thread payload.

So the current feature does this:

1. send the message
2. resolve the thread id if needed
3. immediately call `getThread`
4. replace cache with the backend-refreshed thread

This is a good fallback pattern when backend mutation responses are weak.

For a new app, we should keep the UI able to do this even if we later improve the backend.

### 4. Optimistic Sending Without Trusting It Forever

The page inserts a local optimistic message with:

- `status = sending`
- local timestamp
- local attachments
- optional reply preview

After the real send succeeds, the thread cache is replaced with canonical backend data.

This gives a responsive chat feel without forcing the optimistic object to be the long-term source of truth.

### 5. Draft Attachment Staging

Attachments are not sent immediately when chosen.

The flow is:

1. user picks a file or records a note
2. frontend validates it
3. frontend stores a local draft attachment
4. frontend renders preview immediately
5. upload happens during final send flow
6. backend response is normalized and merged back into the message

This is a strong default for chat composers because it preserves a smooth preview-first UX.

### 6. URL-Driven Chat Entry

Other pages can open chat without re-implementing message logic.

The app uses `useStartDirectConversation()` from:

- alumni directory
- alumni profile
- marketplace
- welfare coordinator flows

That hook:

- stores lightweight recipient context if needed
- requires sign-in if necessary
- reuses an existing direct thread when available
- opens a draft direct thread if no backend thread exists yet
- navigates to `/messages` with thread or draft intent in the query string

This is exactly the kind of small integration surface we should expose in future apps.

### 7. Extension-Specific Metadata Outside The Core Thread Model

The Marketplace docs show a healthy pattern:

- chat remains a normal buyer-to-owner direct thread
- marketplace-specific behavior is tracked outside the core thread model

That is better than stuffing business-specific fields directly into generic thread records.

The same principle applies to any future app:

- keep core chat generic
- keep product-specific entry rules in a side table or parallel metadata model

### 8. Group Chat Reuses The Same Core Model

The graduation-year group handoff shows another good principle:

- special groups should still use the same thread, participant, message, and attachment model
- the backend owns group membership rules
- the frontend renders them like any other group

That keeps the UI simple and prevents "special group" code from spreading everywhere.

## Reusable Blueprint For Other Apps

### Recommended Module Layout

If we build this again, start with a similar feature folder:

```text
src/features/chat/
  api/
    chat.contract.ts
    adapters/chat.adapter.ts
  hooks/
    useChat.ts
    useStartDirectConversation.ts
    useDraftComposerAttachments.ts
    usePullToRefresh.ts
  lib/
    backendChatTransport.ts
    chatAttachmentPreviewRegistry.ts
    chatRecipientRegistry.ts
  pages/
    ChatPage.tsx
    ChatPage.components.tsx
    chatPage.types.ts
    chatPage.utils.ts
  services/
    chat.service.ts
  types/
    chat.types.ts
```

This gives us one place for:

- domain types
- API contracts
- backend adaptation
- query/cache wiring
- UI behavior

### Recommended Backend Contract

For new apps, the minimum backend surface should be:

### Inbox

- `listThreads(viewer, syncToken?, limit?)`

Returns:

- normalized thread summaries
- unread total
- `pollingIntervalMs`
- `syncToken`
- `serverTime`

### Thread detail

- `getThread(viewer, threadId, limit?, beforeMessageId?)`

Returns:

- full thread detail
- participant list
- full message list or latest page
- `syncToken`
- `serverTime`

### Direct thread upsert

- `createOrReuseDirectThread(viewer, participantMemberId, topic?)`

This is better than making the frontend fake a draft thread. The current app only falls back to a draft thread because this behavior is not fully owned by the backend yet.

### Group thread create

- `createGroupThread(viewer, title, memberIds, description?, topic?, category?)`

### Attachment prepare/upload

- `uploadAttachment(viewer, threadId?, file metadata, binary or upload token)`

### Send message

- `sendMessage(viewer, threadId, body?, attachmentIds?, replyToMessageId?, clientGeneratedId)`

Important recommendation:

- return the full refreshed thread detail after send

That removes the extra `getThread` round trip now needed in this app.

### Delete message

- `deleteMessage(viewer, threadId, messageId)`

### Mark thread read

- `markThreadRead(viewer, threadId, lastSeenMessageId?)`

Including `lastSeenMessageId` is better than a blind thread read because it supports more accurate seen semantics.

### Receipt semantics

For direct chat:

- `sent` means the backend accepted and stored the message
- `delivered` means the recipient device or session actually received it
- `seen` means the recipient opened the thread and advanced read state

For group chat:

- do not fake `delivered` or `seen` from one shared cursor
- start with sender-side `sent`
- only add richer group receipts if the backend supports per-member receipt truth

### Recommended Frontend Responsibilities

Frontend should own:

- page layout
- search and filter
- selected thread state
- local draft text
- local draft attachments
- optimistic message rendering
- attachment previews
- voice note preview
- retry UX
- inline actions like reply, copy, delete
- scroll behavior
- query invalidation and cache seeding

Backend should own:

- thread truth
- message truth
- read/unread truth
- delivery truth
- permission checks
- group membership truth
- media persistence
- identity resolution

## Step-By-Step Build Plan For A New App

### Phase 1: Define The Domain

Start by defining the normalized frontend model first.

Do not begin with raw backend payloads.

At minimum define:

- `ChatThreadSummary`
- `ChatThreadDetail`
- `ChatMessage`
- `ChatParticipant`
- `ChatAttachment`

Also define:

- delivery statuses
- thread type enum
- optional category enum
- capability flags like `attachmentsEnabled` and `audioEnabled`

### Phase 2: Build A Transport Interface

Create a transport interface like the current `MessagesTransport`.

The page should only know this interface:

- `listThreads`
- `getThread`
- `uploadAttachment`
- `sendMessage`
- `deleteMessage`
- `markThreadRead`
- `createDirectThread`
- `createGroupThread`

Then implement one concrete backend transport.

This makes it easy to:

- swap mock and real backends
- handle versioned backends
- support future protocol changes without rewriting UI code

### Phase 3: Add Query And Mutation Hooks

Use React Query or an equivalent cache layer.

Recommended query keys:

- `chat/inbox/{viewer}`
- `chat/thread/{viewer}/{threadId}`

Recommended mutations:

- upload attachment
- send message
- mark read
- delete message
- create direct thread
- create group thread

Keep cache logic centralized in the hooks.

### Phase 4: Build The Chat Screen

The main page should orchestrate:

- inbox pane
- active thread pane
- composer
- attachments
- reply state
- lightweight mobile refresh behavior

Try to keep presentational components separate from orchestration logic.

### Phase 5: Add Optimistic Sending

Build helper functions for:

- local `clientGeneratedId`
- optimistic message creation
- merging optimistic and persisted messages
- restoring drafts after send failure

This app already proves that optimistic send feels good as long as canonical backend data wins after success.

### Phase 6: Add Attachment And Voice Note Support

Keep a dedicated draft attachment model separate from persisted attachments.

The draft model should hold:

- local preview URL
- upload request
- optional uploaded attachment result
- duration for audio

That allows:

- image preview
- audio preview
- retry without rebuilding the draft from scratch

### Phase 7: Add Cross-App Entry Hooks

Expose a helper like `useStartDirectConversation`.

That hook should be the only public integration API other features need.

Typical consumers:

- user profile pages
- directory/listing pages
- marketplace/contact flows
- moderation/admin tools
- support/escalation flows

### Phase 8: Start With Polling, Then Add Realtime

The current app shows a good rollout pattern:

1. get polling working first
2. keep REST as the source of truth
3. add realtime events later for live updates

Recommended sequence:

- polling inbox + active thread
- add heartbeat presence from `last_seen_at` if simple online/offline is enough
- add websocket events for new messages
- add delivery and seen updates
- optionally add typing indicators later

Do not move message creation to websocket first unless the whole product is intentionally socket-native.

## Reusable UX Features Already Proven Here

These are features from the current app that are worth keeping in future builds.

### Inbox

- search
- unread filter
- unread badges
- last message preview
- last outgoing delivery state on the inbox card

### Active thread

- day dividers
- grouped timestamp headers
- reply previews
- attachment rendering
- image lightbox
- voice note playback
- sender name in group chats

### Composer

- multiline text
- character limit
- file picker
- drag-and-drop files
- hold-to-record voice notes
- staged voice note preview before send
- reply target preview

### Message actions

- reply
- copy
- delete own message

### Group tools

- participant modal
- start a DM from a group member

## Current Constraints In This App

If we replicate this feature, we should know which behaviors are clean design choices and which are temporary workarounds.

### Clean design choices

- stable frontend types
- transport adapter boundary
- optimistic send
- preview-first attachments
- shared direct-conversation entry hook
- generic thread model for both direct and group chat

### Temporary workarounds

- direct chats can start as frontend-only draft shells
- send endpoints may require an immediate `getThread` refresh
- `markThreadRead` is effectively a placeholder in the current transport
- group delivery and seen are intentionally simplified
- presence is mostly planned rather than fully live
- attachment upload rules still depend on backend limitations

## What I Would Copy Exactly

- the folder split
- the normalized message and thread types
- the service -> transport -> API boundary
- the draft attachment pattern
- the optimistic send merge pattern
- the cross-feature entry hook
- the extension model where business-specific metadata stays outside the core thread model

## What I Would Change In The Next Build

### 1. Replace draft direct threads with a real backend upsert endpoint

The frontend draft shell works, but a true `createOrReuseDirectThread` backend endpoint is cleaner.

### 2. Return full thread detail from send endpoints

That removes the extra fetch and simplifies state updates.

### 3. Support cursor-based message pagination

The contract already points toward this. Long threads will age better with cursors than offset pagination.

### 4. Make `markThreadRead` precise

Use `lastSeenMessageId` so seen state is not ambiguous.

### 5. Add stronger attachment lifecycle support

Preferred flow:

- upload to storage
- receive stable media metadata
- send message with attachment ids
- render final CDN/public URLs in thread detail

### 6. Add tests at the adapter and hook boundaries

The biggest risk areas are:

- payload normalization
- send flow with thread-id swaps
- optimistic merge behavior
- attachment retry behavior
- read/delivery status derivation

## Suggested Test Plan For Future Apps

At minimum, add tests for:

- thread summary normalization from backend payloads
- message normalization including replies and attachments
- direct-thread reuse behavior
- first-send flow for a brand-new direct message
- optimistic message insertion and removal
- attachment validation and MIME normalization
- delivery status derivation
- cache replacement after send success

## Suggested Rollout Order

If we want to build this again without overloading the team, this is a practical order.

### Phase A

- direct chat
- inbox list
- open thread
- send text
- unread count
- polling

### Phase B

- file attachments
- voice notes
- reply
- delete

### Phase C

- group chat
- participant modal
- cross-feature chat entry points
- domain-specific group rules

### Phase D

- precise read receipts
- delivery receipts
- presence heartbeat

### Phase E

- websocket events
- typing indicators
- lightweight notification fan-out

## Quick Checklist For New Apps

Before building:

- define the normalized chat domain model
- decide whether chat is only direct or also group-based
- decide whether attachments and voice notes are in scope
- decide whether inbox polling is enough for v1
- define direct-thread creation and reuse rules

Before backend handoff:

- make id fields stable
- make timestamps parseable
- define message status semantics
- define attachment persistence flow
- define whether send returns full thread detail

Before frontend launch:

- verify optimistic send fallback behavior
- verify attachment retry behavior
- verify deep-link/open-from-anywhere behavior
- verify unread count and read reset behavior
- verify group-chat rendering rules

## Bottom Line

If we want to recreate this chat feature in other apps, we should not copy only the screen. We should copy the architecture:

- normalized chat domain types
- a transport adapter that hides backend quirks
- query-driven inbox and thread caches
- optimistic composer UX
- a small public hook for opening conversations from elsewhere in the product

That is the part of this implementation that is portable, maintainable, and worth standardizing.
