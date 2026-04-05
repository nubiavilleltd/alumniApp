# Messages Backend Test Integration Notes

This file tracks the reshaping and temporary frontend management needed to fit
the current backend chat APIs into the messages UI that was first proven out on
Supabase.

Current scope on `test`:

- `POST /chat_api/get_threads`
- `POST /chat_api/get_thread`
- `POST /chat_api/send_message`
- `POST /chat_api/send_direct`

## Implemented Now

- inbox loading from `get_threads`
- thread detail loading from `get_thread`
- text message sending to an existing thread through `send_message`
- direct conversation open flow through a frontend draft shell plus first-send
  `send_direct`

## Reshapes Applied In The Frontend

### 1. `group_id` is mapped to the generic frontend thread `id`

The UI uses one thread model for direct and group chats, so:

- backend `group_id`
- frontend `id`

This is managed in the adapter for now.

### 2. Non-ISO timestamps are normalized in the adapter

The backend guide shows timestamps like:

- `2026-04-05 14:32:00`

The UI expects ISO-like timestamps for reliable browser parsing, so the
frontend currently normalizes those before rendering.

### 3. Missing `category` is defaulted to `Community`

The frontend thread model requires one of:

- `Mentorship`
- `Events`
- `Marketplace`
- `Community`

If the backend does not send a category, the adapter currently defaults it to
`Community`.

### 4. Presence is defaulted to `offline`

The current backend guide does not include live presence data, so:

- direct thread `presence`
- participant `presence`

are currently defaulted to `offline`.

### 5. Participant identity is mapped as `user_id -> memberId`

The current frontend uses `memberId` everywhere in the chat UI. The backend
payloads currently expose `user_id`, so the adapter maps:

- backend `user_id`
- frontend `memberId`

This should be confirmed as the canonical identity value.

### 6. Thread subtitles and participant profile fields are partly derived

The backend guide does not provide all the profile fields the current messages
UI uses, so the adapter currently derives or defaults:

- `slug`
- `headline`
- `location`
- `graduationYear`
- `profileHref`
- `initials`

These are presentational fallbacks, not backend truth.

### 7. `send_message` is followed by `get_thread`

The current UI expects `sendMessage()` to return a full normalized thread
detail.

The backend guide does not clearly guarantee that `send_message` returns full
thread detail, so the frontend currently:

1. posts to `send_message`
2. extracts the returned `group_id`
3. immediately calls `get_thread`
4. returns the normalized thread detail to the UI

This is a temporary management step in the frontend.

### 8. Attachments are not yet wired through this backend path

The current UI uses:

- local preview first
- then upload/prepare
- then final send

The backend guide's `upload_media` behavior auto-creates a message row, which
does not fit the current preview-first UX.

So on this branch, `send_message` currently supports:

- text messages only

and attachment sending is intentionally blocked until the upload/send flow is
agreed with backend.

### 9. Direct chat open-before-first-send is managed as a frontend draft thread

The current backend guide creates direct chats on first send through
`send_direct`, but the UI already supports opening a conversation shell before
the first message is sent.

So on this branch the frontend currently does this:

1. call `get_threads`
2. if an existing direct thread for that recipient is already present, open it
3. otherwise create a local draft direct thread with a temporary `draft-direct__...`
   id
4. when the first message is sent, call `send_direct`
5. then immediately call `get_thread` for the real backend thread and swap the
   UI to that real thread id

This keeps the current UI behavior working, but the draft thread itself is not
backend truth.

Current frontend assumption for `send_direct`:

```json
{
  "recipient_id": "<member id>",
  "message": "Hello"
}
```

If backend expects different field names here, the first direct-message send
will fail even though the draft-thread UX opens correctly.

The frontend is also currently sending the same identifier it uses everywhere
in the UI, which is `memberId`. If backend expects a different canonical
recipient identity here, such as numeric `user_id`, first direct-message sends
will fail until that identity mapping is aligned.

### 10. Existing direct-thread reuse depends on inbox visibility

Because there is no dedicated "open or reuse direct thread" endpoint in the
current backend guide, the frontend can only immediately reuse a direct thread
if it is discoverable from `get_threads`.

If the relevant direct thread is older and not returned by the backend thread
list, the frontend will open a local draft shell first. The first `send_direct`
call should still allow the backend to create or reuse the actual thread, but
the historical messages will not be visible before that first send.

## Things Still Managed In The Frontend For Now

- optimistic `Sending` state
- restoring draft text if send fails
- local draft attachment preview
- local composer UX
- thread sorting/filtering/search

These are good frontend responsibilities and do not need backend ownership.

## Things The Backend Should Eventually Own

- unread / read truth
- delivered truth
- direct thread creation / reuse behavior
- attachment persistence flow
- reply linkage
- delete state
- pin state
- participant management truth

## Known Gaps Right Now

- `send_message` attachments are not integrated
- `mark_read` is not yet wired on this backend branch
- `pin_thread` is not yet wired on this backend branch
- reply and delete are not yet wired on this backend branch
- presence and typing are not provided by these REST endpoints

## Backend Improvements That Would Reduce Frontend Management

- return generic `id` or `thread_id` instead of `group_id`
- return ISO 8601 timestamps
- return explicit canonical member identity
- include `category`
- make `send_message` return a full updated thread detail, or a canonical
  message object plus updated summary metadata
- add a dedicated "create or reuse direct thread" endpoint so the frontend does
  not need a local draft-DM workaround
- provide an attachment flow that supports preview-first UX without creating a
  message before final send
