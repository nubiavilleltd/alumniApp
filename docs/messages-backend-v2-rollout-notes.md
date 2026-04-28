# Messages Backend V2 Rollout Notes

## Urgent

- `v2_send_message` and `v2_send_direct` do not return a full refreshed thread.
  Frontend fix: after every successful send, the app immediately calls `v2_get_thread` and rebuilds the thread from that response.

- `v2_mark_delivered` is still not wired on this branch.
  Frontend impact: `Seen` can advance from `v2_get_thread`, but `Delivered` will not be trustworthy until the backend-delivered cursor path is confirmed and hooked up.

- Direct chats still start as a frontend-only draft shell.
  Frontend fix: opening a DM composer creates nothing in the database. The real thread is resolved only after the first successful `v2_send_direct`.

- `v2_upload_attachment` requires a real `thread_id`.
  Frontend fix: attachments now upload correctly for existing threads, but a brand-new direct message cannot start with an attachment only. The user must send the first DM as text first.

- Group delivery/read receipts should not be inferred from a single participant cursor.
  Frontend fix: `Sent / Delivered / Seen` is only derived for direct threads. Group messages stay at `Sent` on the sender side for now.

- Frontend thread ids are string ids everywhere.
  Frontend fix: numeric backend `thread_id` values are normalized to string `id` values before they enter the UI state.

## Important

- Backend category values are lowercase (`community`, `mentorship`, `events`, `marketplace`).
  Frontend fix: these are reshaped to the existing UI enum values (`Community`, `Mentorship`, `Events`, `Marketplace`).

- Backend boolean flags come as numeric values (`0` / `1`).
  Frontend fix: `attachment_enabled`, `audio_enabled`, and `is_pinned` are converted to booleans before rendering.

- `v2_get_thread` auto-marks the thread as delivered and seen.
  Frontend fix: the open-thread payload is treated as canonical and the active thread unread count is forced to `0`.

- Existing-thread attachments now use the V2 staged upload flow.
  Frontend fix: the app uploads with `v2_upload_attachment`, stores the returned `attachment_id`, then sends it through `attachment_ids` on `v2_send_message`.

- Some browsers expose voice-note MIME types with codec suffixes such as `audio/webm;codecs=opus`.
  Frontend fix: upload MIME types are normalized, and live-recorded voice notes are converted to `.wav` before the file is sent.

- Reply and delete are now wired, but both still depend on refetch rather than a richer mutation payload.
  Frontend fix: `reply_to_message_id` is sent through `v2_send_message`, `v2_delete_message` is called for own messages, and the inbox/thread queries are invalidated so the backend response becomes canonical.

- Some participant/profile image URLs fail to load in chat surfaces.
  Frontend fix: thread avatars and group-member avatars now fall back to initials instead of rendering broken images.

## Nice to have

- Return the full refreshed thread from `v2_send_message` and `v2_send_direct`.
  This would remove the extra `v2_get_thread` request after every send.

- Standardize identity field names across the API.
  Right now the frontend still has to map between `member_id`, `sender_member_id`, `recipient_id`, `user_id`, and `member_ids`.

- Return a stable full attachment shape inside `v2_get_thread`.
  Ideal fields: `attachment_id`, `public_url`, `kind`, `file_name`, `mime_type`, `size_in_bytes`, `duration_seconds`.

- Support cursor-style pagination later if needed.
  Current V2 `limit + offset` works, but chat UIs usually age better with message-cursor pagination.

## Managed In Frontend

- Local draft text before send
- Local draft file / voice-note preview before send
- Optimistic `Sending...` state
- Restoring composer text after failed sends
- Preserving successfully uploaded attachment ids on retry after a failed send
- Desktop chat shell layout fixes from the Supabase branch
- Three-dot message actions menu UI
- Copy action from the message menu
- Reply composer preview and replied-message preview rendering
- Delete action for own messages
