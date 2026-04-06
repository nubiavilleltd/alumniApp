# Messages Realtime Presence Plan

This is the plan for how I want us to handle realtime presence and typing in chat.

The goal is simple:

- show when a user is online, away, or offline
- show typing indicators in the active chat
- make new messages feel live
- keep the current HTTP message flow intact

I do **not** want us to rebuild the whole messaging system around websockets.

For now, normal message actions should still go through the backend APIs we already have:

- `v2_get_threads`
- `v2_get_thread`
- `v2_send_message`
- `v2_send_direct`
- `v2_upload_attachment`
- `v2_delete_message`

Realtime should sit on top of that and make the experience feel live.

## The Setup I Think We Should Use

Since the backend is in PHP / CodeIgniter, I think the cleanest setup is:

- CodeIgniter stays the main backend
- Soketi runs as the websocket server
- the frontend uses `pusher-js`
- we reuse the JWT we already have for realtime auth

Why I think this is the best fit:

- we do not need to change backend stack
- we do not need to move chat logic out of PHP
- we get private channels and presence channels without inventing our own websocket protocol from scratch

## What I Want To Handle In Frontend

### 1. I will keep the current HTTP message flow

I want the frontend to continue using HTTP for:

- loading inbox
- opening a thread
- sending messages
- uploading attachments
- deleting messages
- marking threads as read

That part is already working and I do not want to destabilize it.

### 2. I will add one websocket client after login

On the frontend, I will:

- open one websocket connection after the user logs in
- reconnect automatically if it drops
- disconnect on logout

This should be an app-level connection, not something that only exists if the user opens `/messages`.

### 3. I do not want global subscriptions everywhere

I only want us to subscribe where it makes sense.

What I want:

- one personal channel for the logged-in user
- one presence/thread channel only for the currently open thread

That means:

- not every thread at once
- not every alumna at once
- not one giant global presence channel

### 4. I will handle UI presence states in the frontend

On the frontend side, I want to interpret presence like this:

- `online` = socket connected and tab is active
- `away` = socket connected but tab is hidden or user is idle
- `offline` = socket disconnected or user no longer present

I can handle:

- `document.visibilitychange`
- idle timing
- updating dots / labels in the UI

### 5. I will handle typing UI in the frontend

Frontend should:

- send typing start / stop events from the active composer
- show typing only in the active thread
- clear typing on send, blur, or inactivity

Typing should stay ephemeral and should not be stored in the database.

### 6. I will keep HTTP fallback

Even after realtime is added, I still want:

- HTTP initial load
- HTTP fallback if socket fails
- HTTP refresh after reconnect if needed

So realtime improves the app, but does not become the only thing the app depends on immediately.

## What I Need The Backend To Handle

### 1. I need a realtime auth endpoint

I need the backend to expose an endpoint for websocket auth, something like:

- `POST /chat_api/realtime/auth`

This endpoint should:

- validate the current JWT
- identify the current user
- authorize which channels the user is allowed to join
- return the correct auth response for the websocket server

### 2. I need channel authorization to be strict

The backend should make sure:

- a user can only subscribe to her own personal channel
- a user can only subscribe to a thread presence channel if she is a participant in that thread

That is important so presence and typing are not exposed to the wrong people.

### 3. I need the backend to publish events after successful actions

After the normal HTTP actions succeed, I need the backend to publish realtime events.

At minimum:

- new message created
- message deleted
- thread read
- presence changed
- typing started
- typing stopped

### 4. I need the backend to be the source of truth for live presence

I do not want the frontend guessing who is online by itself.

The backend / realtime layer should decide:

- who is currently connected
- who is away
- who has gone offline

If we want, `last_seen_at` can still exist in the database as a fallback, but live presence should come from the actual realtime connection.

### 5. I need scoped broadcasting

I do not want the backend broadcasting everything to everyone.

What I want:

- personal events go to the user’s personal channel
- thread typing / active presence goes to that thread’s presence channel

That keeps the app light and avoids unnecessary noise.

## The Channel Structure I Want

### 1. Personal user channel

Channel:

- `private-user.{userId}`

Use this for:

- new message notifications
- inbox refresh hints
- delete updates
- read updates

This should exist for every logged-in user.

### 2. Active thread presence channel

Channel:

- `presence-thread.{threadId}`

Use this for:

- active presence in the open chat
- typing indicator
- direct-chat online / away / offline status

I only want this subscribed when the user is actively viewing that thread.

## The Event Shape I Want

I want to keep this small and practical.

### Server to frontend

`message.created`

```json
{
  "type": "message.created",
  "threadId": 14,
  "messageId": 55
}
```

Frontend action:

- refresh or patch inbox
- refresh or patch active thread

`message.deleted`

```json
{
  "type": "message.deleted",
  "threadId": 14,
  "messageId": 55
}
```

Frontend action:

- update or refetch active thread

`thread.read`

```json
{
  "type": "thread.read",
  "threadId": 14,
  "memberId": 8,
  "lastReadMessageId": 55
}
```

Frontend action:

- update read state in direct chat

`presence.changed`

```json
{
  "type": "presence.changed",
  "memberId": 8,
  "state": "online"
}
```

Frontend action:

- update presence dot and label

`typing.started`

```json
{
  "type": "typing.started",
  "threadId": 14,
  "memberId": 8
}
```

`typing.stopped`

```json
{
  "type": "typing.stopped",
  "threadId": 14,
  "memberId": 8
}
```

### Frontend to backend

The frontend should send:

- presence state updates
- typing started
- typing stopped

I do not think typing needs a database table.

## The Phases I Think We Should Follow

### Phase 1: Authenticated websocket connection

Backend:

- deploy Soketi
- create realtime auth endpoint
- allow personal user channel auth

Frontend:

- connect socket after login
- subscribe to `private-user.{userId}`

Goal:

- app can receive personal realtime events

### Phase 2: New messages feel live

Backend:

- publish events after successful send / delete / read operations

Frontend:

- refresh inbox and active thread when those events arrive

Goal:

- no need to wait for polling to see message activity

### Phase 3: Online / away / offline presence

Backend:

- support `presence-thread.{threadId}`
- authorize only thread participants
- publish presence updates

Frontend:

- subscribe only for active thread
- show online / away / offline in direct chat header and relevant places in inbox

Goal:

- direct chats show real live presence

### Phase 4: Typing indicator

Backend:

- accept typing start / stop and rebroadcast it to the right thread channel

Frontend:

- send typing events from active composer
- show typing only in the active thread

Goal:

- typing feels live and lightweight

### Phase 5: Delivered receipts later

Delivered is still a separate thing.

I will speak to the backend dev about that separately, because I do not want us to block presence and typing on delivered receipts.

## What I Do Not Want Us To Do

- I do not want every thread subscribed at once
- I do not want one global presence channel for the whole platform
- I do not want websocket-only message sending first
- I do not want typing stored in SQL
- I do not want to remove HTTP fallback immediately

## Straight To The Point Split

### What I will do

- keep the existing HTTP chat flow
- add the websocket client in frontend
- manage connection lifecycle after login
- subscribe only where needed
- handle tab visibility / idle state
- render online / away / offline
- render typing indicators
- refresh or patch frontend state when realtime events arrive

### What I need the backend guy to do

- deploy websocket server
- expose realtime auth endpoint
- validate JWT for realtime auth
- authorize private and presence channels correctly
- publish realtime events after backend chat actions
- maintain live presence state
- rebroadcast typing events only to the correct thread

## First Milestone I Want

The first good milestone is:

- websocket connection works after login
- personal user channel works
- inbox updates immediately when a new message comes in
- direct thread header can show real online / away / offline presence

Once that is stable, we can add typing cleanly.
