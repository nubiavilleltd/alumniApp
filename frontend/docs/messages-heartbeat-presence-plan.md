# Messages Heartbeat Presence Plan

This is the plan we are using for now instead of websockets.

The goal is simple:

- show `Online` / `Offline` on the messages page
- keep backend work light
- avoid hosting Soketi or any separate realtime service for now

We are **not** doing:

- websockets
- typing indicators
- true realtime presence

## Final Rule

This is the rule we will use:

- frontend sends a heartbeat every `60 seconds`
- backend updates the current user's `last_seen_at`
- on the messages page:
  - user is `Online` if `last_seen_at` is within the last `60 seconds`
  - user is `Offline` if `last_seen_at` is older than `60 seconds`

## Important Decision

We should use `last_seen_at` as the source of truth.

We should **not** depend mainly on an `is_online` boolean.

Why:

- booleans become stale easily
- timestamps are easier to trust
- frontend can derive status cleanly from one field

## What Backend Needs To Do

### Step 1. Store `last_seen_at`

Backend should make sure each user has a `last_seen_at` field.

Best place:

- `users.last_seen_at`

That is better than storing it per thread, because presence is about the user, not one conversation.

### Step 2. Create a heartbeat endpoint

Backend should add:

- `POST /chat_api/v2_presence_ping`

This endpoint should:

1. validate `token`
2. validate `jwt`
3. identify the current user from JWT
4. update that user's `last_seen_at = now`
5. return success

### Example request

```json
{
  "token": "API_TOKEN",
  "jwt": "ACCESS_TOKEN"
}
```

### Example response

```json
{
  "status": 200,
  "message": "Presence updated",
  "data": {
    "last_seen_at": "2026-04-06 20:15:00"
  }
}
```

### Step 3. Return `last_seen_at` in chat responses

Backend should include `last_seen_at` anywhere the frontend needs to show presence.

At minimum:

- `v2_get_threads`
  - inside each participant object
- `v2_get_thread`
  - inside each participant object

### Example participant shape

```json
{
  "member_id": 5,
  "fullname": "Thomas Example",
  "avatar": "https://...",
  "role": "member",
  "last_seen_at": "2026-04-06 20:15:00"
}
```

### Step 4. Optional backend improvement

Backend can also update `last_seen_at` on existing chat requests like:

- `v2_get_threads`
- `v2_get_thread`
- `v2_send_message`
- `v2_send_direct`

That is optional, but it helps keep presence fresh even if one heartbeat is missed.

The dedicated heartbeat endpoint should still exist.

## What I Need To Do In Frontend

### Step 1. Start a heartbeat interval

When the user is logged in, I will:

1. start a timer
2. call `v2_presence_ping` every `60 seconds`
3. stop the timer on logout

### Step 2. Use `last_seen_at` to derive presence

On the messages page, I will calculate:

- `online` if `now - last_seen_at <= 60 seconds`
- `offline` if `now - last_seen_at > 60 seconds`

### Step 3. Show presence only where it matters

For now, I only need this on the messages UI:

- direct chat header
- thread list
- participant list if needed later

### Step 4. No typing markers for now

We are intentionally skipping:

- typing started
- typing stopped
- live websocket presence

This heartbeat plan is only for simple `Online` / `Offline`.

## Suggested Frontend Logic

### Presence helper

```ts
function getPresenceFromLastSeen(lastSeenAt?: string) {
  if (!lastSeenAt) return 'offline';

  const lastSeen = new Date(lastSeenAt).getTime();
  const now = Date.now();
  const diffMs = now - lastSeen;

  return diffMs <= 60_000 ? 'online' : 'offline';
}
```

## Suggested Rollout Order

### Phase 1

Backend:

- add `last_seen_at`
- add `v2_presence_ping`

Frontend:

- send heartbeat every 60 seconds

Done means:

- backend stores fresh `last_seen_at`

### Phase 2

Backend:

- return `last_seen_at` in `v2_get_threads`
- return `last_seen_at` in `v2_get_thread`

Frontend:

- show `Online` / `Offline` from `last_seen_at`

Done means:

- messages page can show simple presence

## What We Should Expect

This approach is good enough for:

- simple online dots
- basic direct-chat presence
- lightweight implementation

This approach will not give us:

- instant presence changes
- typing indicators
- true realtime updates

Someone may still appear online for up to one minute after leaving.

That is acceptable for this version.

## Very Short Split

### Backend

- add `last_seen_at`
- add `POST /chat_api/v2_presence_ping`
- return `last_seen_at` in thread and inbox participant data

### Frontend

- send heartbeat every 60 seconds
- derive online/offline from `last_seen_at`
- show it on the messages page
- skip typing for now
