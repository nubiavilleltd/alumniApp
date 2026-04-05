# Messages Edge Functions Security Plan

This document is the security plan for keeping the current Supabase-based chat
feature while moving the trust boundary out of the browser.

The goal is simple:

- keep the current app login exactly as users know it
- keep Supabase as the database, storage, and realtime layer
- stop trusting raw `member_id` values sent from the browser
- make it possible to turn RLS back on safely

## Why This Is Needed

Right now, the chat UI can talk directly to Supabase from the browser through:

- [src/features/messages/lib/supabase/messagesSupabaseTransport.ts](/Users/nubiaville/Documents/alumniApp/src/features/messages/lib/supabase/messagesSupabaseTransport.ts)
- [src/features/messages/lib/supabase/index.ts](/Users/nubiaville/Documents/alumniApp/src/features/messages/lib/supabase/index.ts)

That is fast for prototyping, but it has one big weakness:

- the browser can claim to be any `member_id`

Even with client-side checks, the browser is not a trusted environment.

`chat_profiles` is still useful, but only as a copy of user profile data. It is
not proof that the request really came from that user.

## The Trust Model We Want

The browser should no longer be the source of truth for who the acting user is.

Instead:

1. the user logs into the main app normally
2. the frontend sends the existing app JWT to an Edge Function
3. the Edge Function verifies that JWT against the main backend
4. the Edge Function derives the real user identity
5. the Edge Function writes to Supabase using the service role

This keeps the user experience unchanged:

- no extra chat login
- no Supabase login prompt
- no second password step

## Current Tables And Storage Paths

The current chat implementation is built around these database objects:

- `public.chat_profiles`
- `public.message_threads`
- `public.thread_participants`
- `public.messages`
- `public.messages_attachments`

The code also still supports `public.message_thread_participants` as a fallback.
Pick one participant table and standardize on it. The recommended canonical name
is:

- `public.thread_participants`

The current attachment storage path pattern is:

- `message-attachments/members/<memberId>/<random>-<fileName>`

That path is created in:

- [src/features/messages/lib/supabase/messagesSupabaseTransport.ts](/Users/nubiaville/Documents/alumniApp/src/features/messages/lib/supabase/messagesSupabaseTransport.ts)

## Edge Functions To Add

### Minimum Set For MVP Security

These are the first functions worth adding:

- `chat-list-threads`
- `chat-get-thread`
- `chat-send-message`
- `chat-mark-thread-read`
- `chat-create-group-thread`
- `chat-create-attachment-upload-url`

### Optional Helpers

- `chat-ensure-profile`
- `chat-get-signed-attachment-url`
- `chat-clean-stale-attachments`

### Direct Chat Note

Direct chat should stay ephemeral until the first real send.

That means:

- opening a direct chat should not create `message_threads`
- the first real message should create or reuse the direct thread

So in practice:

- `chat-send-message` should handle direct-thread creation internally

## What Each Edge Function Must Do

### 1. Verify The Current App Token

Every function should:

- read the app token from a custom header such as `x-app-jwt`
- call the main backend verification endpoint
- reject the request if the token is invalid, expired, or belongs to a disabled user

Best case:

- use the existing `/auth/me` endpoint if the backend supports it

Fallback:

- add a tiny backend endpoint that accepts the JWT and returns the current user

Expected verified fields:

- `user_id`
- `member_id`
- `role`
- `approval_status`
- `account_status`

### 2. Never Trust Browser-Supplied Identity

The request body may include things like:

- `viewerMemberId`
- `senderMemberId`
- `created_by`

The function should ignore those as authority values.

It may accept them as hints for debugging, but the function must always use the
verified identity from the backend token check.

### 3. Apply Authorization Rules Inside The Function

Examples:

- `chat-list-threads`
  - only return threads where the verified `member_id` is in `thread_participants`
- `chat-get-thread`
  - only return the thread if the verified `member_id` is a participant
- `chat-send-message`
  - direct chat:
    - create or reuse the thread for the verified sender and the target member
  - existing thread:
    - sender must already be a participant
- `chat-mark-thread-read`
  - only update the read state for the verified member
- `chat-create-group-thread`
  - creator must be the verified member
- `chat-create-attachment-upload-url`
  - only issue an upload path for the verified member

### 4. Use The Service Role Only Inside The Function

The service role key should never be used in the browser.

Inside the function:

- create an admin Supabase client with `SUPABASE_SERVICE_ROLE_KEY`
- use that client for database/storage work

Service role bypasses RLS, which is exactly why it must stay server-side only.

## What We Can Protect With Edge Functions

These protections become realistic immediately:

- prevent user impersonation by verifying the main app JWT
- prevent spoofed `member_id` writes
- ensure only participants can read a thread
- ensure only participants can send to a thread
- ensure only the sender can mark their own read cursor
- make attachments private and signed instead of public
- stop direct browser writes to chat tables
- stop direct browser writes to chat storage paths
- centralize logging of abusive or malformed requests

## What We Still Cannot Fully Protect Without More Work

These limits remain even with Edge Functions:

- direct browser access to base tables, if we keep it enabled
- trustworthy per-user browser RLS without Supabase Auth
- anonymous Presence / online-status trust
- fully atomic attachment lifecycle unless send + attachment finalization are
  handled server-side
- perfect rate limiting unless we add explicit throttling

Important:

If the browser is still allowed to read or write the base chat tables directly,
the system is still only partially protected.

## Recommended Security Modes

### Mode A: Recommended Final MVP Mode

Use Edge Functions for all chat reads and writes.

Browser access:

- no direct table reads
- no direct table writes
- no direct storage reads
- no direct storage uploads

Supabase access:

- Edge Functions read/write tables with service role
- Edge Functions issue signed URLs for upload/download

This is the safest mode if Supabase remains the MVP backend.

### Mode B: Temporary Migration Mode

Use Edge Functions for writes first, while some reads still come directly from
the browser.

This is acceptable for a short transition, but it is not the final recommended
state because:

- without Supabase Auth, RLS cannot reliably distinguish one anonymous browser
  from another

### Mode C: Current Prototype Mode

Direct browser access to Supabase with the anon key.

This is fine for feature building and internal testing, but not trustworthy
enough for launch.

## Recommended Edge Function Responsibilities

### `chat-list-threads`

Input:

- optional cursor / limit

Server-side rules:

- derive verified `member_id`
- load threads where that member appears in `thread_participants`
- return only those threads

### `chat-get-thread`

Input:

- `threadId`
- optional pagination cursor

Server-side rules:

- derive verified `member_id`
- confirm that member is in `thread_participants`
- return the thread, participants, messages, and signed attachment URLs

### `chat-send-message`

Input:

- `threadId` or `directParticipantMemberId`
- `body`
- `attachments`
- `clientGeneratedId`

Server-side rules:

- derive verified `member_id`
- if direct-thread draft:
  - create or reuse `message_threads`
  - create `thread_participants`
- insert into `messages`
- attach staged uploads if present
- update `message_threads.last_message_*`

### `chat-mark-thread-read`

Input:

- `threadId`
- `lastReadMessageId`

Server-side rules:

- derive verified `member_id`
- confirm participant membership
- update only that member's participant row

### `chat-create-group-thread`

Input:

- `title`
- `memberIds`

Server-side rules:

- derive verified `member_id`
- create `message_threads`
- insert `thread_participants` for creator + members

### `chat-create-attachment-upload-url`

Input:

- `fileName`
- `mimeType`
- `sizeInBytes`
- `kind`

Server-side rules:

- derive verified `member_id`
- validate allowed mime type and file size
- create a path under `members/<verified-member-id>/...`
- return a signed upload URL or upload token
- optionally create a staged `messages_attachments` row

## Policy Strategy

### Table Policy Rule

For the final secure mode, base chat tables should not be directly accessible to
the browser at all.

That means:

- enable RLS on all chat tables
- do not add permissive `anon` or `authenticated` policies on the base tables
- let Edge Functions use the service role

Why:

- service role bypasses RLS
- the browser should not talk to the base tables anymore

### Tables To Lock Down

- `public.chat_profiles`
- `public.message_threads`
- `public.thread_participants`
- `public.messages`
- `public.messages_attachments`

### SQL Setup For Base Tables

```sql
alter table public.chat_profiles enable row level security;
alter table public.message_threads enable row level security;
alter table public.thread_participants enable row level security;
alter table public.messages enable row level security;
alter table public.messages_attachments enable row level security;
```

```sql
revoke all on table public.chat_profiles from anon, authenticated;
revoke all on table public.message_threads from anon, authenticated;
revoke all on table public.thread_participants from anon, authenticated;
revoke all on table public.messages from anon, authenticated;
revoke all on table public.messages_attachments from anon, authenticated;
```

Final-state note:

- do not add browser-facing RLS policies for these base tables
- the absence of matching policies is the protection

If your project is still using `message_thread_participants`, apply the same
lockdown there too.

## Storage Policy Strategy

### Recommended Final Mode

Use a private bucket:

- bucket name: `message-attachments`
- `public = false`

Do not rely on:

- `public_url`
- `getPublicUrl()`

Use:

- signed upload URLs
- signed download URLs

### Final Storage Access Model

- Edge Function creates a signed upload URL for a verified member
- browser uploads using that signed URL
- Edge Function creates signed read URLs when loading attachments

### Final Storage Policy Recommendation

If all upload and download authorization is handled by Edge Functions and signed
URLs, do not keep a broad `anon` access policy on `storage.objects`.

At minimum:

- bucket must be private
- direct browser uploads should not be generally allowed
- direct browser reads should not be generally allowed

Because signed URLs are the intended access path, broad `anon` `select` and
`insert` policies on `storage.objects` should be removed after migration.

## Temporary Storage Policies For Migration Only

If you still need direct browser uploads for a short transition period, use the
smallest possible policy surface.

These are not the recommended final production policies.

### Temporary Insert Policy

```sql
create policy "temporary message attachments insert"
on storage.objects
for insert
to anon
with check (
  bucket_id = 'message-attachments'
  and lower((storage.foldername(name))[1]) = 'members'
);
```

### Temporary Read Policy

```sql
create policy "temporary message attachments read"
on storage.objects
for select
to anon
using (
  bucket_id = 'message-attachments'
  and lower((storage.foldername(name))[1]) = 'members'
);
```

Why this is still weak:

- it does not prove which member owns the upload
- it only restricts the path shape

That is acceptable only while moving to signed URLs and Edge Functions.

## What We Should Protect Per Table

### `chat_profiles`

Protect:

- arbitrary profile creation for another member
- arbitrary profile edits for another member

Final access:

- Edge Functions only

### `message_threads`

Protect:

- creating threads as another user
- editing `created_by`
- editing `last_message_*` for threads the user does not belong to

Final access:

- Edge Functions only

### `thread_participants`

Protect:

- adding yourself to someone else's thread
- changing your role to `admin`
- removing or editing other participants

Final access:

- Edge Functions only

### `messages`

Protect:

- sending as another member
- sending into a thread where you are not a participant
- editing or deleting another user's messages

Final access:

- Edge Functions only

### `messages_attachments`

Protect:

- linking your upload to someone else's message
- reusing another user's staged attachment
- writing fake metadata

Final access:

- Edge Functions only

### `storage.objects` Under `message-attachments`

Protect:

- uploading outside `members/<verified-member-id>/...`
- reading files through public URLs
- direct anonymous browsing of object paths

Final access:

- signed upload/download URLs only

## Security Test Checklist

Use these tests before turning RLS back on and again after the Edge Function
migration.

### Identity Spoofing Tests

1. Open DevTools and change the outgoing `viewerMemberId` to another member.
   Expected result:

- the request should still act as the logged-in user
- or the function should reject the request

2. Try to send a message while manually changing `sender_member_id`.
   Expected result:

- sender should be derived from the verified token, not the payload

### Authorization Tests

1. Use a valid token from User A and request a thread that belongs only to User B.
   Expected result:

- `403` or `404`

2. Use a valid token from User A and try to send into a thread where A is not a
   participant.
   Expected result:

- `403`

3. Try to mark read for another member's thread row.
   Expected result:

- denied

### Storage Tests

1. Try direct `supabase.storage.from('message-attachments').upload(...)` from the
   browser after final policies are in place.
   Expected result:

- denied

2. Try to open a stored object without a signed URL.
   Expected result:

- denied

3. Try to upload to a path outside the verified member folder.
   Expected result:

- denied

### Table Access Tests

1. From the browser console, try:

```ts
supabase.from('messages').insert({...})
```

Expected result:

- denied by RLS

2. From the browser console, try:

```ts
supabase.from('message_threads').select('*');
```

Expected result:

- denied or empty, depending on final policy mode

### Attachment Ownership Tests

1. Upload a file as User A.
2. Try to attach that staged upload to a message sent by User B.

Expected result:

- denied

### Public URL Leakage Test

1. Confirm `messages_attachments.public_url` is not relied on.
2. Confirm attachment delivery uses signed URLs only.

Expected result:

- old permanent public links are not the active access path

## Recommended Rollout Order

1. Add `supabase/functions` to the repo.
2. Build `chat-send-message` first.
3. Build `chat-get-thread`.
4. Build `chat-list-threads`.
5. Build `chat-mark-thread-read`.
6. Build `chat-create-attachment-upload-url`.
7. Switch storage to private + signed URLs.
8. Re-enable RLS on tables.
9. Remove temporary `anon` storage policies.

## Final Decision Rule

If the backend developer can take over chat soon, use this plan to stabilize the
security thinking and hand off the same rules.

If the backend developer cannot take it now, Supabase Edge Functions are still a
good MVP path as long as:

- the browser stops being the authority for identity
- the base tables are not directly exposed
- storage becomes private and signed

## References

- Supabase Edge Functions quickstart: https://supabase.com/docs/guides/functions/quickstart
- Supabase Edge Functions deploy: https://supabase.com/docs/guides/functions/deploy
- Supabase Edge Function secrets: https://supabase.com/docs/guides/functions/secrets
- Supabase RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Storage schema notes: https://supabase.com/docs/guides/storage/schema/design
- Supabase signed upload URL docs: https://supabase.com/docs/reference/javascript/storage-from-createsigneduploadurl
- Supabase signed URL docs: https://supabase.com/docs/reference/javascript/storage-from-createsignedurl
- Supabase Functions invoke docs: https://supabase.com/docs/reference/javascript/functions-invoke
