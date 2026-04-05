# Messages Mock Testing Guide

This guide is for end-to-end testing of the current `/messages` feature before the
real backend is wired in.

The frontend already uses the same request and response shapes documented in:

- `docs/messages-api-handoff.md`
- `docs/messages-api-request-matrix.md`

The difference is that the data is currently served by the mock transport in
`src/features/messages/lib/mockMessagesTransport.ts`.

## Best Way To Test Repeatedly

In local development, the Messages page now shows a `Reset mock inbox` button.

Use it before a fresh test pass if you have already:

- sent messages
- uploaded attachments
- created new direct threads
- opened chats from alumni or marketplace

The mock transport persists state in `localStorage`, so resetting gives you the
same seeded baseline every time.

If you need to reset manually from the browser, clear these keys:

- `openalumns.messages.mockServer.v1`
- `openalumns.messages.recipientRegistry.v1`

## Seeded Mock Behavior

The default mock transport starts with these seeded conversation types:

- direct mentorship conversation
- direct marketplace conversation
- community planning group
- events planning group

The seeded participants the transport knows best are:

- Adaeze Okonkwo
- Ngozi Ibrahim
- Chidinma Eze
- Precious Ojeka

If a logged-in viewer has no existing threads, the mock transport automatically
creates starter conversations so the inbox is never empty.

## Timing Behavior Worth Testing

These timings are simulated by the mock server and are useful to call out to the
backend developer:

- inbox polling: every `6` seconds
- sent -> delivered transition: after about `3` seconds
- delivered -> seen transition: after about `12` seconds
- auto-reply after you send a message: after about `7` seconds
- background activity on existing threads: after about `45` seconds

## Core Test Pass

Run this pass after resetting the mock inbox.

### 1. Inbox Loads

Open `/messages` as a logged-in user and confirm:

- the inbox list renders
- at least one thread is selected automatically
- unread count appears in the header
- thread timestamps show as time, weekday, or month/day depending on age

### 2. Thread Filters Work

Check the `All`, `Unread`, and `Pinned` filters.

Expected behavior:

- `Unread` keeps the currently selected thread visible even if it becomes read
- `Pinned` only shows pinned conversations
- switching filters never breaks the active chat pane

### 3. Search Works Across Useful Fields

Try searching by:

- participant name
- thread topic
- last message preview
- thread category like `Marketplace` or `Community`

Expected behavior:

- matching threads remain sorted by recent activity
- non-matching threads disappear immediately

### 4. Opening A Thread Marks It Read

Open a thread that has unread messages.

Expected behavior:

- the active thread loads in the right pane
- the unread badge drops to `0` for that thread
- the inbox unread total updates after the read mutation completes

### 5. Send Text Message

Send a plain text message.

Expected behavior:

- the message appears immediately in the active thread
- the thread jumps to the top of the inbox
- delivery status progresses from `Sent` to `Delivered` to `Seen`
- an auto-reply appears after roughly `7` seconds in supported scenarios

### 6. Send Attachment

Attach a normal file and send it.

Expected behavior:

- the attachment is staged before send
- the file preview shows filename and size
- the sent message preview in the inbox includes the attachment description

If the attachment is an image, also confirm:

- the image renders inline inside the chat bubble
- clicking it opens a larger preview modal
- the full-size image can be opened separately from the preview modal

### 7. Send Voice Note

Press and hold the voice note button, then release to send.

Expected behavior:

- the button switches into recording state while it is held
- the composer shows a live recording status and timer
- releasing the button sends the voice note automatically
- a very short tap does not send a note
- if microphone capture is unavailable, the mock still simulates the note duration from the hold length
- the message bubble shows waveform bars
- duration and size are displayed

### 8. Send Attachment Without Text

Send a message that contains only attachments.

Expected behavior:

- the send action still succeeds
- the message preview is based on attachment labels

### 9. Refresh Paths Work

Test both refresh options:

- click the refresh icon
- use pull-to-refresh on touch or narrow-screen testing

Expected behavior:

- inbox and active thread both refetch
- no duplicate messages are created

### 10. Cross-Entry Flows Work

Start a direct conversation from:

- Alumni Directory
- Alumni Profile
- Marketplace

Expected behavior:

- if a direct thread already exists, it is reused
- if not, a new direct thread is created
- the app lands on `/messages?threadId=...`
- recipient identity details render correctly in the thread header

### 11. Self-Conversation Guard Works

Try starting a conversation with the current user.

Expected behavior:

- the app does not create a self-thread
- the user is taken to the inbox with an informational toast

### 12. Polling Keeps The UI Fresh

Leave the page open after sending or reading messages.

Expected behavior:

- thread order updates when activity changes
- unread counts stay in sync
- background mock activity appears without a manual refresh

## Edge Cases To Mention In Backend Handoff

These are already encoded in the current frontend contract and should stay true
when the real API replaces the mock:

- direct thread creation should reuse an existing two-person thread
- sending an empty message without attachments should be rejected
- thread access must be viewer-specific
- unread counts are viewer-specific
- attachment upload can stay a prepare step as long as the returned shape matches
- `pollingIntervalMs` should remain server-controlled
- `syncToken` should continue to exist even if it is only a placeholder at first

## Good Demo Narrative For The Backend Dev

If you want a clean walkthrough, this order works well:

1. Reset the mock inbox.
2. Open `/messages` and explain the inbox payload vs thread payload.
3. Open a seeded thread and point out participant metadata, message items, and read state.
4. Send a text message, then watch delivery state progress.
5. Send a file or voice note to show attachment handling.
6. Start a conversation from Alumni Directory or Marketplace to show direct-thread creation and reuse.
7. Show the two backend handoff docs for the exact contract shapes.
