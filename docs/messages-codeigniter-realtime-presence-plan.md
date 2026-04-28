# Messages Realtime Plan

This is the simple version of the realtime plan for both of us.

The goal is:

- keep the current HTTP chat APIs as they are
- add realtime on top for live updates
- support:
  - new message updates
  - online / away / offline
  - typing

We are not rebuilding the whole chat system around websockets.

The normal chat APIs should still handle:

- `v2_get_threads`
- `v2_get_thread`
- `v2_send_message`
- `v2_send_direct`
- `v2_upload_attachment`
- `v2_delete_message`

Realtime is only there to make the app feel live.

## Stack

This is the stack I want us to use:

- backend stays in `PHP / CodeIgniter`
- websocket server = `Soketi`
- frontend client = `pusher-js`

## Exact Config We Can Start With

These are the starter values I think we should use first.

### Backend Soketi app values

```text
APP ID     = alumni-app
APP KEY    = alumni-key
APP SECRET = alumni-secret-change-me
```

Important:

- `APP SECRET` stays backend-only
- frontend should only know `APP KEY`

### Backend PHP config

```php
$config['soketi_app_id']     = 'alumni-app';
$config['soketi_app_key']    = 'alumni-key';
$config['soketi_app_secret'] = 'alumni-secret-change-me';
$config['soketi_host']       = '127.0.0.1';
$config['soketi_port']       = 6001;
$config['soketi_scheme']     = 'http';
```

### Example `soketi.json`

```json
{
  "debug": true,
  "host": "0.0.0.0",
  "port": 6001,
  "appManager": {
    "driver": "array",
    "array": {
      "apps": [
        {
          "id": "alumni-app",
          "key": "alumni-key",
          "secret": "alumni-secret-change-me",
          "enableUserAuthentication": true,
          "webhooks": []
        }
      ]
    }
  }
}
```

### Frontend env values

These are the values I would set on my side:

```env
VITE_SOKETI_APP_KEY=alumni-key
VITE_SOKETI_HOST=127.0.0.1
VITE_SOKETI_PORT=6001
VITE_SOKETI_SCHEME=http
VITE_SOKETI_AUTH_ENDPOINT=/chat_api/realtime_auth
```

### Production note

For production, the public frontend host should usually become something like:

```text
ws.alumniportal.nubiaville.com
```

That means:

- Soketi can still run internally on `127.0.0.1:6001`
- frontend should connect to the public websocket hostname
- reverse proxy / SSL should sit in front of Soketi

## Very Clear Split

### What I will do in frontend

- connect to Soketi after login
- disconnect on logout
- subscribe only to the channels I need
- update the UI when events come in
- show online / away / offline
- show typing
- keep HTTP fallback in place

### What the backend guy needs to do

- install and run Soketi
- add Soketi config to backend env/config
- create realtime auth endpoint in CodeIgniter
- validate JWT in that auth endpoint
- authorize which channels a user can join
- publish realtime events after chat actions
- publish presence / typing updates

## Backend Steps

### Step 1. Install and run Soketi

Backend side should install Soketi:

```bash
npm install -g @soketi/soketi
```

Then run it with config:

```bash
soketi start --config=soketi.json
```

Default port can stay:

- `6001`

### Step 2. Add Soketi config in backend

Backend needs config like this:

```php
$config['soketi_app_id']     = 'alumni-app';
$config['soketi_app_key']    = 'alumni-key';
$config['soketi_app_secret'] = 'alumni-secret-change-me';
$config['soketi_host']       = '127.0.0.1';
$config['soketi_port']       = 6001;
$config['soketi_scheme']     = 'http'; // use https in production
```

Important:

- backend keeps `soketi_app_secret`
- frontend must never have the secret

### Step 3. Create realtime auth endpoint

Backend needs an endpoint like:

- `POST /chat_api/realtime_auth`

This endpoint should:

1. read the JWT
2. validate the JWT
3. identify the current user
4. check if the user is allowed to join the requested channel
5. return the signed Pusher-compatible auth response

### Step 4. Authorize channels correctly

Backend should enforce:

- user can join only her own personal channel
- user can join a thread channel only if she belongs to that thread

That means:

- allow `private-user.{userId}` only for that exact user
- allow `presence-thread.{threadId}` only if the user is a participant of that thread

### Step 5. Publish events after successful backend actions

After normal chat APIs succeed, backend should publish realtime events.

At minimum:

- `message.created`
- `message.deleted`
- `thread.read`
- `presence.changed`
- `typing.started`
- `typing.stopped`

### Step 6. Backend should own live presence truth

Backend / realtime layer should decide:

- who is online
- who is away
- who is offline

Frontend should only render what backend tells it.

## Frontend Steps

### Step 1. Add frontend env values

Once backend gives me the Soketi public values, I will add:

```env
VITE_SOKETI_APP_KEY=alumni-key
VITE_SOKETI_HOST=127.0.0.1
VITE_SOKETI_PORT=6001
VITE_SOKETI_SCHEME=http
VITE_SOKETI_AUTH_ENDPOINT=/chat_api/realtime_auth
```

Important:

- I only need the public values
- I do not need `soketi_app_secret`

### Step 2. Connect after login

On frontend, I will:

1. create one websocket connection after login
2. reconnect if it drops
3. disconnect on logout

This should be app-level, not messages-page-only.

### Step 3. Subscribe only where needed

I do not want global subscriptions everywhere.

I only want:

- `private-user.{userId}` for the logged-in user
- `presence-thread.{threadId}` for the thread currently open on screen

That means:

- not every thread
- not every alumna
- not one global presence channel

### Step 4. Handle new message events

When the frontend receives:

- `message.created`
- `message.deleted`
- `thread.read`

I will:

- refresh or patch inbox state
- refresh or patch active thread state
- show lightweight message notifications if needed

### Step 5. Handle presence

Frontend will render:

- `online`
- `away`
- `offline`

This should appear in:

- direct thread header
- inbox where useful

### Step 6. Handle typing

Frontend will:

- send typing start / stop only in the active thread
- show typing only in the active thread
- clear typing on send, blur, or inactivity

Typing should stay ephemeral.

It should not be stored in SQL.

## Channel Names

### Personal user channel

```text
private-user.{userId}
```

Use this for:

- new message notification
- inbox refresh hint
- delete update
- read update

### Active thread channel

```text
presence-thread.{threadId}
```

Use this for:

- thread presence
- online / away / offline in active chat
- typing

## Event Shapes

These are the simple event shapes I want.

### `message.created`

```json
{
  "type": "message.created",
  "threadId": 14,
  "messageId": 55
}
```

### `message.deleted`

```json
{
  "type": "message.deleted",
  "threadId": 14,
  "messageId": 55
}
```

### `thread.read`

```json
{
  "type": "thread.read",
  "threadId": 14,
  "memberId": 8,
  "lastReadMessageId": 55
}
```

### `presence.changed`

```json
{
  "type": "presence.changed",
  "memberId": 8,
  "state": "online"
}
```

### `typing.started`

```json
{
  "type": "typing.started",
  "threadId": 14,
  "memberId": 8
}
```

### `typing.stopped`

```json
{
  "type": "typing.stopped",
  "threadId": 14,
  "memberId": 8
}
```

## Order We Should Follow

### Phase 1. Get the connection working

Backend:

- install Soketi
- add backend Soketi config
- create realtime auth endpoint

Frontend:

- add env values
- connect after login
- subscribe to `private-user.{userId}`

Done means:

- socket connects successfully
- auth works
- user can join her own personal channel

### Phase 2. Make message updates live

Backend:

- publish `message.created`
- publish `message.deleted`
- publish `thread.read`

Frontend:

- update inbox when events arrive
- update open thread when events arrive

Done means:

- inbox changes immediately
- open thread updates immediately

### Phase 3. Add presence

Backend:

- support `presence-thread.{threadId}`
- publish `presence.changed`

Frontend:

- subscribe only for active thread
- render online / away / offline

Done means:

- direct chat header shows live presence

### Phase 4. Add typing

Backend:

- accept typing start / stop
- rebroadcast to correct thread channel

Frontend:

- send typing events from active composer
- render typing in active thread only

Done means:

- typing works without polling

## What We Should Not Do

- do not subscribe to every thread at once
- do not create one giant global presence channel
- do not move all message sending to sockets first
- do not store typing in SQL
- do not expose Soketi secret to frontend

## First Milestone

The first milestone I want is:

1. Soketi is running
2. realtime auth endpoint works
3. frontend connects after login
4. `private-user.{userId}` works
5. inbox updates immediately when a new message comes in

Once that works, presence and typing become much easier to add.
