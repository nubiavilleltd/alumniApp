# Messages Backend Test Integration Notes

This file tracks the reshaping and temporary frontend management needed to fit
the current backend chat APIs into the messages UI that was first proven out on
Supabase.

Current scope on `test`:

- `POST /chat_api/get_threads`
- `POST /chat_api/get_thread`
- `POST /chat_api/send_message`
- `POST /chat_api/send_direct`
- `POST /chat_api/mark_read`

## Implemented Now

- inbox loading from `get_threads`
- thread detail loading from `get_thread`
- text message sending to an existing thread through `send_message`
- direct conversation open flow through a frontend draft shell plus first-send
  `send_direct`
- explicit read acknowledgement through `mark_read`
- attachment preview-first flow through local staging plus final multipart send

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

### 7b. `get_thread` is treated as the canonical thread refresh after send

The backend guide says `get_thread` returns the full thread and also marks it as
read for the viewer.

So after:

- `send_message`
- `send_direct`

the frontend immediately reloads the real thread through `get_thread` instead
of trying to trust the send response alone.

### 8. Attachments are staged locally and only persisted on final send

The current UI uses:

- local preview first
- then local staging in frontend state
- then final send

That is preserved on this branch by avoiding `upload_media` for the normal
composer flow.

What the frontend currently does instead:

1. user chooses a file or records a voice note
2. the file stays in local state for preview
3. `uploadAttachment()` returns a staged local attachment object only
4. when the user finally presses `Send`, the frontend posts multipart/form-data
   to:
   - `send_message` for an existing thread
   - `send_direct` for the first direct message
5. after send succeeds, the frontend reloads the thread through `get_thread`
   and renders the canonical persisted attachment URL from the backend

This keeps the current preview-first UX intact without creating a message too
early.

Important limitation right now:

- the current backend guide shows a single `file` field, so this branch only
  supports one attachment per message for the backend path

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

Current frontend assumption for `send_direct` text sends:

```json
{
  "recipient_id": "<member id>",
  "message": "Hello"
}
```

If backend expects different field names here, the first direct-message send
will fail even though the draft-thread UX opens correctly.

For direct-message attachments, this branch also assumes `send_direct` accepts
multipart/form-data with:

- `recipient_id`
- optional `message`
- `file`
- `attachment_type`

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

### 11. `get_thread` currently forces `unreadCount` to `0` in the open thread view

The backend guide says opening a thread automatically marks it as read.

So when the frontend maps `get_thread`, it currently normalizes:

- `thread.unreadCount = 0`

for the open thread detail. This keeps the active pane aligned with what the
backend is already doing.

### 12. `mark_read` is still wired because the page already triggers it

The page logic already calls `markThreadRead()` when an open thread has unread
messages.

Because the backend also auto-marks inside `get_thread`, this is partially
duplicate behavior, but the frontend now wires `POST /chat_api/mark_read` so
the page does not throw a placeholder error.

Long term, we should choose one clear behavior:

- rely fully on `get_thread`
- or keep explicit `mark_read` and stop auto-marking inside `get_thread`

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

- backend attachment sending currently supports one attachment per message
- `pin_thread` is not yet wired on this backend branch
- reply and delete are not yet wired on this backend branch
- presence and typing are not provided by these REST endpoints
- delivered state is not truly backend-driven yet
- pagination shape still differs between frontend and backend

## Possible Backend Issues To Watch

### 1. `get_thread` uses `offset`, but the frontend contract uses `beforeMessageId`

The backend guide pages messages with:

- `limit`
- `offset`

The current frontend contract was originally designed around:

- `limit`
- `beforeMessageId`

For now, the frontend only loads the first page cleanly. If we want proper
infinite scroll for older messages, the backend and frontend should agree on one
pagination model.

### 2. There is no explicit backend-delivered receipt model yet

The current REST guide supports:

- inbox unread count
- thread read state

But it does not describe any explicit delivered marker such as:

- `last_delivered_message_id`
- or per-message delivery receipts

So on this backend branch, the frontend can safely show:

- `sending`
- `sent`
- `seen`

but not a trustworthy persisted `delivered` state yet.

### 3. `upload_media` still conflicts with preview-first UX

The backend guide says standalone upload:

- auto-creates a message row

The current UI expects:

- choose file
- preview file locally
- remove if needed
- only create a message when the user finally presses `Send`

So attachment upload still needs a backend-side adjustment if we want to stop
managing around it in the frontend.

### 4. Multipart attachment send currently assumes one backend file field

The current branch sends attachments through:

- `send_message` multipart/form-data
- `send_direct` multipart/form-data for a first DM

This is based on the guide describing a single uploaded `file` field.

That means the frontend currently has to enforce:

- one attachment per message

If backend wants true multi-attachment sends, the API shape needs to make that
explicit.

### 5. `send_direct` file support should be confirmed explicitly

This branch uses the same multipart strategy for:

- existing thread file sends
- first direct-message file sends

That works only if `send_direct` accepts:

- `recipient_id`
- optional `message`
- `file`
- `attachment_type`

If `send_direct` only supports JSON text sends, then first-message attachments
in a new DM will still fail until backend adds multipart support there too.

### 6. The backend should standardize one canonical user identity field

Right now responses appear to use:

- `user_id`

while the current chat UI historically uses:

- `memberId`

The frontend adapter handles that mapping, but the backend should return one
clear stable identity field consistently across:

- participants
- message sender ids
- direct-message recipient ids

## Backend Improvements That Would Reduce Frontend Management

- return generic `id` or `thread_id` instead of `group_id`
- return ISO 8601 timestamps
- return explicit canonical member identity
- include `category`
- make `send_message` return a full updated thread detail, or a canonical
  message object plus updated summary metadata
- add a dedicated "create or reuse direct thread" endpoint so the frontend does
  not need a local draft-DM workaround
- either keep `send_message` / `send_direct` multipart-friendly for final send
  or provide a dedicated prepare-upload flow that does not create a message
  before final send
- support multiple attachments per message if that is a product requirement
