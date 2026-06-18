# Messages Realtime Implementation Plan

This document is the shared implementation plan for moving the current `/messages`
feature from the mock transport to a real backend with WebSocket-powered realtime
updates.

It is meant to help the frontend and PHP backend move in parallel without guessing
or blocking each other.

## What We Are Optimizing For

- keep the current frontend contract as stable as possible
- avoid a stressful full rewrite on the backend
- add realtime delivery and seen receipts without abandoning HTTP
- use the mock implementation as the functional guide
- keep polling as a fallback, not the primary realtime mechanism

## Recommended Architecture

Use a hybrid model:

- HTTP remains responsible for:
  - initial inbox load
  - thread detail load
  - create direct thread
  - create group thread
  - upload attachment / prepare attachment
  - send message
  - mark thread read
- WebSocket remains responsible for:
  - pushing new messages to connected participants
  - pushing delivery status updates
  - pushing seen/read updates
  - pushing light inbox/thread refresh hints when needed

This is the least stressful path because it keeps the current mock-shaped REST flow
intact and adds sockets only where they create clear value.

## Key Rule

Do not move message creation to WebSocket first.

For the first real implementation:

- send messages over HTTP
- persist messages in the backend first
- use WebSocket to notify the other participant and to update receipts

That means the backend stays simpler and the frontend can keep its existing
`sendMessage`, `createDirectThread`, `markThreadRead`, and query flows.

## What The Mock Already Gives Us

The mock implementation already proves the frontend UX we want:

- inbox list
- thread detail view
- direct-thread creation and reuse
- read/unread state
- attachments
- voice notes
- status badges for `sent`, `delivered`, and `seen`

The main difference is:

- the mock changes statuses by time
- the real backend should change statuses from actual client events

## Realtime Status Semantics

### Sent

`sent` means:

- the backend accepted the HTTP send request
- the message is stored in the database
- the sender can safely see the message as committed

### Delivered

`delivered` should mean:

- the recipient client received the pushed message event
- the recipient client acknowledged receipt back to the backend

Important:

- do not mark `delivered` merely because the sender sent the message
- do not mark `delivered` merely because the backend stored the message

### Seen

`seen` should mean:

- the recipient actually opened the thread
- the recipient frontend sent a read event or read HTTP mutation
- the backend updated the read cursor for that participant

For best accuracy, the read payload should identify the furthest visible message,
not just the thread id.

## Recommended Receipt Model

For direct chat, the current frontend `status` field is fine.

For group chat, a single message status will become too simplistic. Long term,
the backend will likely need either:

- per-user message receipts
- or a thread participant table with read and delivery cursors

Recommended backend fields:

- `thread_participants.last_delivered_message_id`
- `thread_participants.last_read_message_id`

Or alternatively:

- `message_receipts(message_id, member_id, delivered_at, seen_at)`

For the first version, the cursor model is usually simpler.

## WebSocket Event Contract

Start with a very small event protocol.

### Server -> Client Events

`message.created`

```json
{
  "type": "message.created",
  "threadId": "thread-123",
  "message": {
    "id": "message-987",
    "threadId": "thread-123",
    "senderMemberId": "MBR-1998-ABC123",
    "senderDisplayName": "Adaeze Chioma Okonkwo",
    "body": "Hello there",
    "createdAt": "2026-04-02T12:00:00.000Z",
    "status": "sent",
    "attachments": [],
    "isOwn": false
  },
  "serverTime": "2026-04-02T12:00:00.000Z",
  "syncToken": "messages-245"
}
```

`message.status.updated`

```json
{
  "type": "message.status.updated",
  "threadId": "thread-123",
  "messageId": "message-987",
  "status": "delivered",
  "memberId": "MBR-2002-DEF456",
  "serverTime": "2026-04-02T12:00:04.000Z",
  "syncToken": "messages-246"
}
```

`thread.read`

```json
{
  "type": "thread.read",
  "threadId": "thread-123",
  "memberId": "MBR-2002-DEF456",
  "lastSeenMessageId": "message-987",
  "serverTime": "2026-04-02T12:00:08.000Z",
  "syncToken": "messages-247"
}
```

Optional later:

- `presence.updated`
- `thread.updated`
- `sync.required`

### Client -> Server Events

`message.delivered`

```json
{
  "type": "message.delivered",
  "threadId": "thread-123",
  "messageId": "message-987"
}
```

`thread.read`

```json
{
  "type": "thread.read",
  "threadId": "thread-123",
  "lastSeenMessageId": "message-987"
}
```

Optional later:

- `presence.heartbeat`

## HTTP Contract Adjustments

The current REST contract can stay mostly intact.

The only change I strongly recommend now is:

- extend `markThreadRead` to include `lastSeenMessageId`

Suggested request:

```ts
{
  viewerMemberId: string;
  threadId: string;
  lastSeenMessageId: string;
}
```

Why:

- it gives precise seen semantics
- it avoids marking a whole thread seen blindly
- it works for both polling and WebSocket paths

## PHP Backend Options For WebSockets

Using PHP is not a problem.

The backend does not need Node to support WebSockets.

### Option A: Laravel Reverb

Best if your friend is using Laravel.

Why it is attractive:

- first-party Laravel WebSocket server
- built for Laravel broadcasting
- supports reverse proxy setup
- supports horizontal scaling with Redis
- uses the Pusher protocol

Official docs:

- https://laravel.com/docs/reverb
- https://reverb.laravel.com/

Recommendation:

- choose this if the backend is already Laravel or close to Laravel conventions

### Option B: Workerman

Best if your friend is using custom PHP or wants a lighter standalone WebSocket server.

Why it is attractive:

- straightforward WebSocket worker model
- simple process management from the command line
- supports active push to connected clients
- no Node required

Official docs:

- https://manual.workerman.net/doc/en/appendices/about-websocket.html
- https://manual.workerman.net/doc/en/install/start-and-stop.html
- https://manual.workerman.net/doc/en/faq/active-push.html

Recommendation:

- this is probably the least stressful non-Laravel PHP route

### Option C: OpenSwoole

Best if performance matters and the team is comfortable with PHP extensions and more
infrastructure control.

Why it is attractive:

- dedicated WebSocket server support
- event-driven server model
- strong realtime performance potential

Official docs:

- https://openswoole.com/docs/modules/swoole-websocket-config
- https://openswoole.com/docs/modules/swoole-websocket-server-construct
- https://openswoole.com/docs/modules/swoole-websocket-server-start

Recommendation:

- only choose this if the backend team is comfortable with PECL extensions and server ops

## My Practical Recommendation

Choose based on the backend stack:

- if Laravel: use Reverb
- if plain/custom PHP: use Workerman
- if high-performance realtime infra is already familiar: consider OpenSwoole

If the goal is the smoothest path with the least stress:

- keep REST in the existing PHP app
- run a PHP WebSocket server alongside it
- use Redis or the database as the bridge if needed

## Frontend Responsibilities

The frontend should handle:

- keeping the current HTTP flows working
- adding a WebSocket client service
- opening the socket after auth is ready
- reconnecting automatically
- subscribing to realtime events
- updating React Query cache when events arrive
- emitting delivery acknowledgements
- emitting seen/read acknowledgements
- falling back to refetch after reconnect or desync

Frontend should not own the truth of receipts.

The frontend should only:

- display optimistic state
- send client acknowledgements
- apply canonical backend updates

## Backend Responsibilities

The backend should handle:

- authenticating the socket connection
- mapping connections to `memberId`
- storing messages
- storing read and delivery cursors
- deciding when a message is officially `delivered`
- deciding when a message is officially `seen`
- broadcasting updates to the correct participants
- replaying or resyncing missed changes after reconnect

Backend should remain the source of truth.

## Shared Decisions We Need Early

The frontend and backend should agree on these before coding too far:

- how WebSocket auth will work
- whether the socket runs inside the main PHP app or as a sidecar process
- whether reconnect recovery uses `syncToken`, timestamps, or both
- the exact payload for `thread.read`
- the exact rule for `delivered`
- whether direct chat ships first and group receipts later

## Lowest-Stress Rollout Plan

### Phase 1: Backend REST Parity

Backend:

- implement the existing HTTP endpoints from the handoff docs
- keep payloads aligned with the current mock contract
- include `syncToken` and `pollingIntervalMs`

Frontend:

- keep using the current hooks and service
- swap mock transport for real HTTP transport once ready

Goal:

- full messages feature works over HTTP and polling

### Phase 2: Add Socket Connection Only

Backend:

- expose authenticated WebSocket connection
- register user connections by `memberId`

Frontend:

- connect socket after login
- reconnect on drop
- keep polling as fallback

Goal:

- infrastructure exists without changing message semantics yet

### Phase 3: Push New Messages In Real Time

Backend:

- after successful HTTP send, broadcast `message.created` to participants

Frontend:

- update inbox and thread cache from `message.created`
- reduce dependence on short polling

Goal:

- recipient gets new messages immediately

### Phase 4: Delivered Receipts

Backend:

- accept `message.delivered` ack
- persist delivered cursor or receipt
- broadcast `message.status.updated` back to sender

Frontend:

- emit `message.delivered` when the pushed message is received
- update sender UI when delivered event arrives

Goal:

- sender sees `Delivered` based on actual client receipt

### Phase 5: Seen Receipts

Backend:

- accept `thread.read` or read HTTP mutation with `lastSeenMessageId`
- persist seen cursor
- broadcast seen update to sender

Frontend:

- when active thread is open and visible, emit seen state
- update sender UI to `Seen` when backend confirms

Goal:

- sender sees accurate read receipts

### Phase 6: Reduce Polling But Keep It As Fallback

Backend:

- support lightweight resync after reconnect

Frontend:

- use polling on startup, reconnect, tab restore, or socket failure
- use socket events as the normal realtime path

Goal:

- stable realtime experience without depending entirely on polling

## How We Use The Mock As Our Guide

The mock remains valuable because it already defines:

- the user experience
- the thread summary shape
- the thread detail shape
- the direct-thread reuse behavior
- the send / upload / read workflow

What changes in the real version is not the UI contract.

What changes is:

- status transitions become event-driven
- reads become backend-confirmed
- new messages arrive through sockets instead of waiting for polling

## What We Should Avoid

- do not build the whole feature around WebSocket-only message send first
- do not remove HTTP fetches immediately
- do not drop polling completely on day one
- do not make the frontend guess delivery or seen states by timers
- do not over-design group receipts before direct chat is stable

## First Joint Milestone

The best first shared milestone is:

- real HTTP endpoints working against the current contract
- socket connection established and authenticated
- new incoming messages pushed in real time
- polling still present as fallback

Once that is stable, add:

- delivered acknowledgements
- seen acknowledgements

That is the safest order for a seamless result.
