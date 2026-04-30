# Event Registration Forms Backend Handoff

## Purpose

This document explains the event registration form system that is already prototyped on the frontend with `localStorage`, so the backend team can implement the database structure and API contract around the same data flow.

This is not a speculative design. It is based on the current frontend behavior in:

- `src/features/events/pages/CreateEventPage.tsx`
- `src/features/events/components/EventRegistrationFormBuilderModal.tsx`
- `src/features/events/components/RegisterEventModal.tsx`
- `src/features/events/lib/eventRegistrationFormStorage.ts`
- `src/features/events/types/eventRegistrationForm.types.ts`

## Current Frontend Behavior

### Event creation flow

- Admin creates an event.
- Admin can attach **more than one** request-info form to the event.
- Each form is separate and has:
  - a name
  - a list of questions
  - ordered questions
- Each attached form is shown as a clickable card on the create-event page.
- Clicking an attached form reopens it in the builder for editing.

### Form builder behavior

- A form contains one or more questions.
- Supported question types:
  - `short_answer`
  - `long_answer`
  - `multiple_choice`
  - `checkbox`
  - `dropdown`
- Each question has:
  - `label`
  - `type`
  - `required`
  - `placeholder`
  - `options` for choice-based types
  - `order`
- Questions are reorderable via drag and drop.

### Event registration flow

- When a user opens event registration, the frontend loads **all forms attached to that event**.
- The forms render sequentially in the registration modal.
- The user answers questions across all attached forms in one registration flow.
- The user also sets RSVP status:
  - `going`
  - `maybe`
- The user may add an optional free-text note (`additionalInfo` / extra note).

### Current prototype persistence behavior

- Form definitions are currently saved in local storage by `eventId`.
- User responses are currently saved in local storage by `eventId + userId`.
- For backend compatibility during the prototype, the frontend currently also serializes a readable text summary of the structured answers into the existing `additional_info` event registration field.

## Core Product Rules

### Rule 1: An event can have multiple forms

One event may have zero, one, or many attached request-info forms.

Examples:

- one form for logistics
- one form for food preferences
- one form for dress code / attire / special requests

### Rule 2: A form contains ordered questions

Question order matters and must be preserved exactly as saved by the admin.

Examples:

- question 3 can be dragged to position 1
- question 1 can move to position 2
- question order must be persisted explicitly

### Rule 3: One user registration covers all forms for the event

The user should not submit each attached form separately.

The intended data model is:

- one event registration per `event + user`
- that registration contains answers across all forms attached to that event at submission time

### Rule 4: Form versioning matters

If forms are edited after users have already submitted responses, historical answers must still point to the exact form version the user saw.

This is important for:

- auditability
- accurate admin review
- preventing broken historical submissions when questions are renamed, reordered, or deleted

## Recommended Database Structure

### 1. `event_registration_forms`

Represents one request-info form attached to an event.

Suggested columns:

- `id`
- `event_id`
- `name`
- `version`
- `is_active`
- `created_by`
- `created_at`
- `updated_at`

Notes:

- One event has many forms.
- A form should remain identifiable across edits.
- If you version forms, either:
  - increment `version` on the same logical record, or
  - create a new record version and keep a stable `form_group_id`

### 2. `event_registration_form_questions`

Represents one question inside a form.

Suggested columns:

- `id`
- `form_id`
- `label`
- `type`
- `required`
- `placeholder`
- `options_json`
- `sort_order`
- `created_at`
- `updated_at`

Notes:

- `type` values should match frontend values exactly:
  - `short_answer`
  - `long_answer`
  - `multiple_choice`
  - `checkbox`
  - `dropdown`
- `options_json` can be null for non-choice types.
- `sort_order` is required. Do not rely only on insertion order.

### 3. `event_registrations`

Represents one user's registration for one event.

Suggested columns:

- `id`
- `event_id`
- `user_id`
- `rsvp_status`
- `additional_info`
- `submitted_at`
- `updated_at`

Recommended uniqueness:

- unique key on `event_id + user_id`

Notes:

- The current frontend flow assumes one registration per user per event.
- If the user edits their answers later, update this same record and preserve timestamps/history as desired.

### 4. `event_registration_answers`

Represents one saved answer to one question.

Suggested columns:

- `id`
- `registration_id`
- `form_id`
- `form_version`
- `question_id`
- `question_label_snapshot`
- `question_type`
- `question_order`
- `required_snapshot`
- `answer_text`
- `answer_json`
- `created_at`
- `updated_at`

Notes:

- Use `answer_text` for:
  - short answer
  - long answer
  - multiple choice
  - dropdown
- Use `answer_json` for:
  - checkbox selections
- Keep snapshot fields so historical answers still make sense even if forms later change.

## Recommended API Contract

## A. Create event with attached forms

There are two acceptable backend approaches.

### Option 1: Extend create event

Allow event creation to accept attached forms in the same request.

Example:

```json
{
  "title": "Annual Alumni Reunion 2026",
  "description": "Main event details...",
  "location": "Lagos",
  "event_date": "2026-06-20",
  "start_time": "10:00",
  "end_time": "17:00",
  "visibility": "public",
  "status": "upcoming",
  "max_attendees": 250,
  "registration_forms": [
    {
      "name": "Food Preferences",
      "questions": [
        {
          "label": "Preferred meal",
          "type": "dropdown",
          "required": true,
          "placeholder": "Select a meal",
          "options": ["Rice", "Pasta", "Salad"],
          "order": 1
        }
      ]
    },
    {
      "name": "Dress Code Details",
      "questions": [
        {
          "label": "Will you attend in alumni colors?",
          "type": "multiple_choice",
          "required": true,
          "placeholder": "",
          "options": ["Yes", "No"],
          "order": 1
        }
      ]
    }
  ]
}
```

### Option 2: Keep event creation separate

Flow:

1. create event
2. backend returns `eventId`
3. frontend calls create-form endpoint one or more times

This is also acceptable and may be easier to ship safely.

## B. Create form(s) for an event

Suggested endpoint:

- `POST /api/create_event_registration_form`

Suggested request:

```json
{
  "event_id": 123,
  "name": "Food Preferences",
  "questions": [
    {
      "label": "Preferred meal",
      "type": "dropdown",
      "required": true,
      "placeholder": "Select a meal",
      "options": ["Rice", "Pasta", "Salad"],
      "order": 1
    }
  ]
}
```

## C. Update / delete / reorder form(s)

Suggested endpoint:

- `POST /api/manage_event_registration_form`

Suggested actions:

- `function_type: "update"`
- `function_type: "delete"`
- optional `function_type: "reorder_questions"`

Recommended behavior:

- updating a form after users have submitted should produce a new version
- deleting a form should either:
  - soft-delete / deactivate it, or
  - prevent delete when submissions already exist

## D. Fetch forms for event registration

Suggested endpoint:

- `POST /api/get_event_registration_forms`

Suggested request:

```json
{
  "event_id": 123
}
```

Suggested response:

```json
{
  "status": 200,
  "data": [
    {
      "id": 10,
      "event_id": 123,
      "name": "Food Preferences",
      "version": 1,
      "is_active": 1,
      "questions": [
        {
          "id": 101,
          "form_id": 10,
          "label": "Preferred meal",
          "type": "dropdown",
          "required": 1,
          "placeholder": "Select a meal",
          "options": ["Rice", "Pasta", "Salad"],
          "order": 1
        }
      ]
    }
  ]
}
```

## E. Submit registration with structured answers

Suggested endpoint:

- either extend existing event registration endpoint
- or create `POST /api/register_for_event_with_form`

Suggested request:

```json
{
  "event_id": 123,
  "user_id": 55,
  "status": "going",
  "additional_info": "I may arrive slightly late.",
  "form_answers": [
    {
      "form_id": 10,
      "form_version": 1,
      "question_id": 101,
      "question_type": "dropdown",
      "question_order": 1,
      "value": "Rice"
    },
    {
      "form_id": 11,
      "form_version": 1,
      "question_id": 205,
      "question_type": "checkbox",
      "question_order": 2,
      "value": ["Vegetarian", "No peanuts"]
    }
  ]
}
```

Notes:

- Keep `additional_info` as a plain optional note.
- Do not require frontend to flatten form answers into text once structured answers are supported.

## F. Admin readback

Suggested endpoints:

- `POST /api/get_event_registration_submissions`
- `POST /api/get_event_registration_submission_detail`

Admin needs to see:

- event
- user
- RSVP status
- which forms were attached
- which questions were asked
- answers in the exact order the user saw them

## Validation Rules

### For forms

- form name is required
- form must contain at least one question
- each question label is required
- choice-based types must have at least 2 options

### For answers

- required questions must have a value
- `multiple_choice` and `dropdown` must match one provided option
- `checkbox` values must all match provided options
- short and long answers can be plain strings

## Ordering Rules

Backend must preserve:

- form order if multiple forms are shown in a chosen sequence
- question order inside each form

At minimum:

- every question needs `sort_order`

Optional improvement:

- forms can also have `sort_order` if product later wants drag-and-drop between forms

## Versioning Recommendation

Recommended rule:

- once a form has responses, edits should create a new version instead of mutating the old shape in place

This keeps:

- old submissions stable
- question snapshots meaningful
- admin reporting consistent

## Frontend Data Model Already In Use

The frontend prototype already uses these concepts:

### Form

```ts
{
  id,
  eventId,
  name,
  version,
  isActive,
  createdByUserId,
  createdByName,
  createdAt,
  updatedAt,
  questions: [...]
}
```

### Question

```ts
{
  (id, formId, label, type, required, placeholder, options, order);
}
```

### Registration response

```ts
{
  id,
  eventId,
  userId,
  userName,
  userEmail,
  rsvpStatus,
  additionalInfo,
  answers: [...]
}
```

### Answer

```ts
{
  (formId, formName, formVersion, questionId, questionLabel, questionType, order, required, value);
}
```

## Recommended Implementation Sequence

1. Build read API for event registration forms by `event_id`
2. Build create API for one form with ordered questions
3. Build update/versioning behavior
4. Extend event registration submission to accept structured `form_answers`
5. Build admin read endpoints for submissions
6. Remove the temporary frontend text serialization into `additional_info`

## Open Product/Backend Decisions

These should be confirmed before final backend rollout:

1. Should forms themselves have explicit ordering between each other?
2. Should users be allowed to edit their answers after initial registration?
3. Should admins be allowed to delete forms after responses already exist?
4. Should form edits always create a new version, or only after first submission exists?
5. Should answer snapshots be duplicated into answer rows, or reconstructed by joins plus versioning?

## Summary

The backend should support:

- multiple request-info forms per event
- ordered questions per form
- one event registration per user
- structured answers across all attached forms
- stable versioning for historical submissions

That will align directly with the current frontend prototype and let us replace the local-storage layer with real APIs without changing the user experience.
