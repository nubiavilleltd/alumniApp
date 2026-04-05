# Messages API Handoff

This document lists the backend endpoints and request/response parameters the current
frontend expects for the `/messages` feature.

The frontend is currently using a mock transport, but it already follows a backend-style
contract. If the real backend matches the shapes below, we should be able to switch from
mock data to live data with minimal frontend changes.

For the broader rollout plans, see:

- `docs/messages-realtime-implementation-plan.md` for the backend-neutral realtime architecture
- `docs/messages-supabase-implementation-plan.md` for the Supabase-backed prototype path

## Source Of Truth In Code

- Endpoint constants: `src/lib/api/endpoints.ts`
- Request/response contract: `src/features/messages/api/messages.contract.ts`
- Shared data models: `src/features/messages/types/messages.types.ts`
- Query/mutation hooks: `src/features/messages/hooks/useMessages.ts`
- Transport swap point: `src/features/messages/services/messages.service.ts`

## General Rules

- All endpoints are authenticated.
- IDs are strings.
- Timestamps should be ISO 8601 strings.
- The frontend currently passes `viewerMemberId` in requests.
- Once the real auth layer is fully wired, the backend can derive the viewer from the token.
- Until then, keep accepting `viewerMemberId` so the frontend can swap over cleanly.
- `pollingIntervalMs` should be returned by the backend so polling can be tuned server-side.
- `syncToken` is included now to support future delta sync or websocket handoff later.

## Shared Types The Frontend Expects

### MessageThreadSummary

```ts
{
  id: string;
  type: 'direct' | 'group';
  category: 'Mentorship' | 'Events' | 'Marketplace' | 'Community';
  title: string;
  subtitle: string;
  topic: string;
  avatar?: string;
  initials: string;
  unreadCount: number;
  isPinned: boolean;
  lastActivityAt: string;
  lastMessagePreview: string;
  lastMessageSenderName?: string;
  presence?: 'online' | 'away' | 'offline';
  memberCount: number;
  participants: MessageParticipant[];
}
```

### MessageThreadDetail

```ts
{
  ...MessageThreadSummary,
  description?: string;
  attachmentsEnabled: boolean;
  audioEnabled: boolean;
  messages: MessageItem[];
  syncToken: string;
  pollingIntervalMs: number;
}
```

### MessageParticipant

```ts
{
  memberId: string;
  slug: string;
  fullName: string;
  firstName: string;
  headline: string;
  location: string;
  graduationYear: number;
  avatar?: string;
  initials: string;
  profileHref: string;
  presence: 'online' | 'away' | 'offline';
  roleInThread: 'member' | 'moderator' | 'admin';
}
```

### MessageItem

```ts
{
  id: string;
  threadId: string;
  senderMemberId: string;
  senderDisplayName: string;
  senderAvatar?: string;
  body: string;
  createdAt: string;
  status: 'sending' | 'sent' | 'delivered' | 'seen' | 'failed';
  attachments: MessageAttachment[];
  isOwn: boolean;
}
```

### MessageAttachment

```ts
{
  id: string;
  kind: 'file' | 'image' | 'audio';
  fileName: string;
  mimeType: string;
  sizeInBytes: number;
  sizeLabel: string;
  durationSeconds?: number;
  uploadState: 'uploaded' | 'processing';
  url?: string;
  waveform?: number[];
}
```

## Endpoints

### 1. List Inbox Threads

- Method: `GET`
- Path: `/messages/threads`

Query parameters:

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

Notes:

- Sort threads by `lastActivityAt` descending.
- `unreadCount` must be viewer-specific.
- This is called on first page load and during polling.

### 2. Get One Thread

- Method: `GET`
- Path: `/messages/threads/:threadId`

Query parameters:

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

Notes:

- This powers the active chat pane.
- `limit` and `beforeMessageId` are included now so message pagination can be added later without changing the contract.

### 3. Upload Or Prepare Attachment

- Method: `POST`
- Path: `/messages/attachments`

Request body:

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

Notes:

- The frontend currently treats this as a prepare step and stages the returned attachment locally.
- Later this can become multipart upload, object storage upload, or signed upload without changing the page behavior.

### 4. Send Message

- Method: `POST`
- Path: `/messages/messages`

Request body:

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

Validation:

- Reject if both `body` and `attachments` are missing.
- Use `clientGeneratedId` for idempotency and duplicate protection.

### 5. Mark Thread Read

- Method: `POST`
- Path: `/messages/threads/:threadId/read`

Request body:

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

Notes:

- The page triggers this after opening a thread that still has unread messages.

### 6. Create Direct Thread

- Method: `POST`
- Path: `/messages/threads/direct`

Request body:

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

Notes:

- If a direct thread already exists between those two users, backend may return the existing one instead of creating a duplicate.

### 7. Create Group Thread

- Method: `POST`
- Path: `/messages/threads/group`

Request body:

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

### 8. Poll Endpoint

- Method: `GET`
- Path: `/messages/poll`

Notes:

- This path is reserved in the endpoint map.
- The current frontend does not call it directly yet.
- If implemented later, it can return either:
- updated inbox state
- thread deltas since `syncToken`
- a lightweight change feed for websocket fallback mode

## Frontend Action To Endpoint Mapping

- Open `/messages` page:
  `GET /messages/threads`
- Select a conversation:
  `GET /messages/threads/:threadId`
- Active thread has unread messages:
  `POST /messages/threads/:threadId/read`
- Pull to refresh or tap refresh:
  rerun `GET /messages/threads` and `GET /messages/threads/:threadId`
- Attach a file:
  `POST /messages/attachments`
- Attach audio:
  `POST /messages/attachments`
- Send a message:
  `POST /messages/messages`
- Create a direct chat:
  `POST /messages/threads/direct`
- Create a group chat:
  `POST /messages/threads/group`

## Backend Behavior Expectations

- `401` if not authenticated
- `403` if authenticated but user is not allowed to view the thread
- `404` if thread does not exist
- `422` for invalid send payloads
- `lastMessagePreview` should already be backend-computed for inbox display
- `lastMessageSenderName` is especially useful for group thread previews
- `attachmentsEnabled` and `audioEnabled` should be thread-level capability flags
- `presence` is only meaningful for direct threads today
- `memberCount` should be returned by the backend rather than recomputed on the client

## Polling And Future Websockets

- The frontend currently polls every `pollingIntervalMs`
- When websockets are added later, the initial REST contract should remain
- Websockets can then push updates that hydrate or invalidate the same inbox/thread caches
- That means this REST contract is still worth implementing cleanly even if realtime is planned next
