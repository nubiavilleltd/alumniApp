# Marketplace Messages Auto-Reply Handoff

## Goal

When a buyer clicks `Message` from the Marketplace:

- keep the existing direct-message design
- continue using the normal buyer `<->` owner direct thread
- let the **seller/business owner** send the first automatic greeting
- avoid sending that auto-reply more than once for the same business context

This should not change how normal direct messages work.

## Current Design We Want To Preserve

Right now our message design is still good:

- direct thread = buyer `<->` owner
- messages belong to the direct thread
- Marketplace is only an **entry point** into that thread

We do **not** want to turn the thread itself into a business thread.

We also do **not** want to add one global `auto_message_sent` flag directly on the thread, because:

- one owner can have multiple businesses
- the same buyer and owner may already have an existing thread for another reason

So the Marketplace-specific logic should stay separate from the core thread model.

## What Frontend Will Send

Frontend should call a new backend endpoint like:

- `POST /chat_api/v2_start_marketplace_thread`

Request body:

```json
{
  "business_id": "3"
}
```

## What Backend Should Use It For

Backend should use `business_id` to:

1. load the business
2. get the business owner
3. identify the buyer from jwt/auth
4. find or create the normal buyer-owner direct thread
5. decide whether the seller auto-reply has already been sent for that business context

## Recommended Backend Logic

### 1. Resolve identities

- buyer = authenticated user from JWT/session
- business = lookup by `business_id`
- owner = `business.owner_id`

If buyer and owner are the same user:

- do not create/send anything special
- just return the existing thread if needed

### 2. Find or create the normal direct thread

Keep the existing message logic:

- thread is still between `buyer_id` and `owner_id`
- do not create a separate thread type for Marketplace

### 3. Track Marketplace auto-reply separately

Use a small Marketplace-specific context record instead of changing the main thread design.

Recommended fields:

- `thread_id`
- `business_id`
- `buyer_id`
- `owner_id`
- `auto_message_sent`
- `auto_message_sent_at`

This can be a small side table or similar metadata store.

Important:

- do **not** put one single `auto_message_sent` field on the thread itself
- the flag should be tied to the **business context**

### 4. Send seller auto-reply once

When Marketplace message start is called:

1. find or create the buyer-owner thread
2. check Marketplace context for that `thread_id + business_id`
3. if `auto_message_sent = false`:
   - insert a normal message into the thread
   - sender should be the **owner**
   - body can be:

```text
Hey there, thanks for reaching out to {business_name}, what can we do for you?
```

4. after sending, set:
   - `auto_message_sent = true`
   - `auto_message_sent_at = now`

If `auto_message_sent = true` already:

- do not send the greeting again
- just return the thread

## Why This Logic Is Better

This avoids spoiling the current design because:

- direct messages remain buyer `<->` owner
- Marketplace-specific behavior is isolated
- existing inbox/thread polling still works
- seller greeting is a real backend-authored message
- frontend does not have to fake seller identity

## What Backend Should Return

Preferred response:

```json
{
  "status": 200,
  "message": "Marketplace thread ready",
  "data": {
    "thread_id": "123",
    "auto_message_sent": true,
    "thread": {
      "...normal thread detail payload..."
    }
  }
}
```

Minimum acceptable response:

```json
{
  "status": 200,
  "data": {
    "thread_id": "123",
    "auto_message_sent": true
  }
}
```

Preferred because:

- if backend returns full thread detail, frontend can hydrate the open thread immediately
- if only `thread_id` is returned, frontend can still navigate and let normal polling/thread fetch load it

## What Frontend Will Use The Response For

Frontend will use the response to:

1. navigate to `/messages?threadId={thread_id}`
2. stop auto-sending the current frontend Marketplace starter text
3. let the existing inbox/thread fetch show the seller-authored greeting normally

If full thread detail is returned:

- frontend can also seed the thread cache immediately

## Summary

Frontend sends:

- `business_id`

Backend uses it to:

- resolve buyer from auth
- resolve owner from business
- find/create normal buyer-owner direct thread
- check Marketplace-specific `auto_message_sent`
- send seller greeting once if needed

Backend returns:

- `thread_id`
- `auto_message_sent`
- preferably full `thread` detail too

Frontend uses that to:

- open the right messages thread
- stop sending the fake frontend starter message
- rely on normal message rendering/polling
