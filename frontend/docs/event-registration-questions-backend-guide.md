# Event Registration Questions Backend Guide

## Purpose

We need to move the event registration questions feature from Firebase to our custom backend while keeping the same frontend behavior we already have.

The important improvement: registration answers should be accepted by `/api/register_event` so the RSVP and custom question answers are saved together in one backend transaction.

## 1. Full Scope

### What This Feature Does

Admins can attach extra registration questions to an event. When a user registers for that event, the user answers those questions in the registration modal.

Examples:

- meal preference
- shirt size
- arrival time
- transport needs
- special requests
- guest details

### Current User Flows To Preserve

#### Admin create event

1. Admin creates an event.
2. Admin can add one or more registration form sections.
3. Each form section has a name.
4. Each form section contains one or more ordered questions.
5. Admin saves the event.
6. Backend stores the event and the registration forms.
7. Event list/detail must indicate that the event has registration questions.

#### Admin edit event

1. Admin opens an existing event.
2. Existing registration forms load with their questions.
3. Admin can:
   - add a new form
   - edit a form name
   - add questions
   - edit questions
   - reorder questions
   - remove questions
   - archive/delete a form
   - reorder forms
4. Backend must preserve old submitted answers even if the form changes later.

#### User register for event

1. User opens event registration.
2. If the event has registration questions, frontend fetches the active forms.
3. User answers all required questions.
4. User submits registration.
5. `/api/register_event` saves:
   - normal RSVP registration
   - extra registration answers
6. Backend returns a stable success response.

#### Admin view attendees

1. Admin opens event attendees.
2. Backend returns normal attendees.
3. Backend also exposes which attendees have extra registration answers.
4. Admin can open one attendee and view their submitted question answers.
5. Answers must show the exact question labels/options from the time the user registered.

### Question Types

Backend must support these exact type values:

```ts
type EventQuestionType =
  | 'short_answer'
  | 'long_answer'
  | 'multiple_choice'
  | 'checkbox'
  | 'dropdown';
```

### Question Fields

Each question must support:

```ts
{
  id: string;
  label: string;
  type: EventQuestionType;
  required: boolean;
  placeholder: string;
  options: string[];
  max_selections: number | null;
  order: number;
}
```

Notes:

- `options` is required for `multiple_choice`, `checkbox`, and `dropdown`.
- `options` should be an empty array for `short_answer` and `long_answer`.
- `max_selections` only applies to `checkbox`.
- `order` controls the display order.
- The frontend can generate question IDs. Backend should preserve them unless missing.

### Form Fields

Each registration form section must support:

```ts
{
  id: string;
  event_id: string;
  name: string;
  sort_order: number;
  version: number;
  is_active: boolean;
  questions: RegistrationQuestion[];
  created_by: string;
  created_at: string;
  updated_by: string;
  updated_at: string;
}
```

### Versioning Requirement

Versioning is not optional.

If an admin edits questions after users have submitted answers, the old answers must still show correctly.

Backend should create a new form version whenever:

- form name changes
- question is added
- question is edited
- question is deleted
- question order changes
- options change
- required flag changes
- placeholder changes
- max selections change

Submitted answers must reference the form version the user answered.

## 2. Functions And Endpoints Needed

Use the same backend style we already use in the app:

- `POST` endpoints
- `snake_case` request fields
- `function_type` for manage actions
- `status`, `message`, and stable resource keys in responses
- auth through `Authorization: Bearer <token>` and `X-API-Key`

### Function A: Return Events With Registration Question Flags

Existing endpoint:

```http
POST /api/get_events
```

This endpoint already returns events. It must now include these fields on every event:

```json
{
  "has_registration_questions": true,
  "registration_form_count": 2
}
```

Fields read:

- event fields already returned today
- active registration form count for that event

Frontend expectation:

- `has_registration_questions` must be boolean.
- `registration_form_count` must be a number.
- If no forms exist, return:

```json
{
  "has_registration_questions": false,
  "registration_form_count": 0
}
```

### Function B: Get Registration Forms For An Event

New endpoint:

```http
POST /api/get_event_registration_forms
```

Used by:

- event registration modal
- edit event page

Request:

```json
{
  "event_id": "123"
}
```

Fields read:

- active forms for `event_id`
- active version for each form
- questions from active version

Success response:

```json
{
  "status": 200,
  "message": "Event registration forms retrieved successfully",
  "event_id": "123",
  "forms": [
    {
      "id": "12",
      "event_id": "123",
      "name": "Food Preferences",
      "sort_order": 1,
      "version": 3,
      "is_active": true,
      "questions": [
        {
          "id": "question-1710000000000-abc123",
          "label": "Preferred meal",
          "type": "dropdown",
          "required": true,
          "placeholder": "Select an option",
          "options": ["Rice", "Pasta", "Salad"],
          "max_selections": null,
          "order": 1
        }
      ],
      "created_at": "2026-06-18T10:00:00Z",
      "updated_at": "2026-06-18T10:30:00Z"
    }
  ]
}
```

Important response rules:

- Always return `forms`.
- If no forms exist, return `forms: []`.
- Sort forms by `sort_order`.
- Sort questions by `order`.
- Do not return archived forms.

### Function C: Manage Registration Forms

New endpoint:

```http
POST /api/manage_event_registration_form
```

Admin only.

#### C1. Create Form

Request:

```json
{
  "function_type": "create",
  "event_id": "123",
  "name": "Food Preferences",
  "sort_order": 1,
  "questions": [
    {
      "id": "question-1710000000000-abc123",
      "label": "Preferred meal",
      "type": "dropdown",
      "required": true,
      "placeholder": "Select an option",
      "options": ["Rice", "Pasta", "Salad"],
      "max_selections": null,
      "order": 1
    }
  ]
}
```

Fields written:

- `event_registration_forms`
  - `event_id`
  - `name`
  - `sort_order`
  - `is_active = true`
  - `active_version_id`
  - `active_version_number = 1`
  - `has_submissions = false`
  - `created_by`
  - `created_at`
  - `updated_by`
  - `updated_at`
- `event_registration_form_versions`
  - `form_id`
  - `event_id`
  - `version_number = 1`
  - `name`
  - `sort_order`
  - `questions_json`
  - `status = published`
  - `created_by`
  - `created_at`

Success response:

```json
{
  "status": 200,
  "message": "Event registration form created successfully",
  "form": {
    "id": "12",
    "event_id": "123",
    "name": "Food Preferences",
    "sort_order": 1,
    "version": 1,
    "is_active": true,
    "questions": []
  }
}
```

#### C2. Update Form

Request:

```json
{
  "function_type": "update",
  "event_id": "123",
  "form_id": "12",
  "name": "Food Preferences",
  "sort_order": 1,
  "questions": [
    {
      "id": "question-1710000000000-abc123",
      "label": "Preferred meal",
      "type": "dropdown",
      "required": true,
      "placeholder": "Select an option",
      "options": ["Rice", "Pasta", "Salad", "Vegetarian"],
      "max_selections": null,
      "order": 1
    }
  ]
}
```

Fields edited:

- `event_registration_forms`
  - `name`
  - `sort_order`
  - `active_version_id`
  - `active_version_number`
  - `updated_by`
  - `updated_at`
- `event_registration_form_versions`
  - create a new version row

Fields not overwritten:

- `created_by`
- `created_at`
- old version rows
- old submitted answers

Success response:

```json
{
  "status": 200,
  "message": "Event registration form updated successfully",
  "form": {
    "id": "12",
    "event_id": "123",
    "name": "Food Preferences",
    "sort_order": 1,
    "version": 4,
    "is_active": true,
    "questions": []
  }
}
```

#### C3. Archive Form

Request:

```json
{
  "function_type": "archive",
  "event_id": "123",
  "form_id": "12"
}
```

Fields edited:

- `event_registration_forms`
  - `is_active = false`
  - `updated_by`
  - `updated_at`

Fields not deleted:

- form versions
- submitted answers

Success response:

```json
{
  "status": 200,
  "message": "Event registration form archived successfully",
  "success": true
}
```

#### C4. Reorder Forms

Request:

```json
{
  "function_type": "reorder",
  "event_id": "123",
  "forms": [
    { "form_id": "12", "sort_order": 1 },
    { "form_id": "13", "sort_order": 2 }
  ]
}
```

Fields edited:

- `event_registration_forms.sort_order`
- `event_registration_forms.updated_by`
- `event_registration_forms.updated_at`

Success response:

```json
{
  "status": 200,
  "message": "Event registration forms reordered successfully",
  "success": true
}
```

### Function D: Register Event With Answers

Existing endpoint to improve:

```http
POST /api/register_event
```

This endpoint should continue to support the current simple registration payload. It should also accept optional registration answers.

Current simple payload:

```json
{
  "user_id": "55",
  "event_id": "123",
  "status": "going",
  "year": "2026",
  "additional_info": "Optional note"
}
```

Improved payload with answers:

```json
{
  "user_id": "55",
  "event_id": "123",
  "status": "going",
  "year": "2026",
  "additional_info": "Registration form: Food Preferences\n1. Preferred meal: Rice",
  "extra_note": "I may arrive late.",
  "registration_answers": [
    {
      "form_id": "12",
      "question_id": "question-1710000000000-abc123",
      "value": "Rice"
    },
    {
      "form_id": "13",
      "question_id": "question-1710000000000-def456",
      "value": ["Email", "SMS"]
    }
  ]
}
```

Fields written to normal event registration:

- `event_id`
- `user_id`
- `status`
- `year`
- `additional_info`
- `created_at` or `submitted_at`
- `updated_at`

Fields written to extra answer submission:

- `event_id`
- `event_title_snapshot`
- `user_id`
- `user_name_snapshot`
- `user_email_snapshot`
- `rsvp_status`
- `additional_info` from `extra_note`
- `form_versions_json`
- `answers_json`
- `submitted_at`
- `updated_at`

Backend behavior:

- Save RSVP and registration answers in one transaction.
- If any required answer is invalid, save nothing and return validation error.
- Derive trusted user identity from auth/session where possible.
- If `user_id` is still required by existing backend code, verify it matches the authenticated user.
- Preserve existing `submitted_at` if user updates registration.
- Update `updated_at` every time.

Success response:

```json
{
  "status": 200,
  "message": "Event registration successful",
  "registration": {
    "event_id": "123",
    "user_id": "55",
    "status": "going",
    "additional_info": "Registration form: Food Preferences\n1. Preferred meal: Rice",
    "has_registration_answers": true,
    "submitted_at": "2026-06-18T10:45:00Z",
    "updated_at": "2026-06-18T10:45:00Z"
  },
  "answer_submission": {
    "eventId": "123",
    "eventTitleSnapshot": "Annual Alumni Reunion 2026",
    "userId": "55",
    "userName": "Jane Doe",
    "userEmail": "jane@example.com",
    "rsvpStatus": "going",
    "additionalInfo": "I may arrive late.",
    "formVersions": [
      {
        "formId": "12",
        "formVersionId": "41",
        "formVersionNumber": 3,
        "formName": "Food Preferences"
      }
    ],
    "answers": [
      {
        "formId": "12",
        "formVersionId": "41",
        "questionId": "question-1710000000000-abc123",
        "questionLabel": "Preferred meal",
        "questionType": "dropdown",
        "order": 1,
        "required": true,
        "value": "Rice"
      }
    ],
    "submittedAt": "2026-06-18T10:45:00Z",
    "updatedAt": "2026-06-18T10:45:00Z"
  }
}
```

Important:

- Always return `answer_submission` when `registration_answers` were submitted.
- Return `answer_submission: null` if the event has no registration answers in the request.
- Do not return different field names per request.

### Function E: Validate Registration Answers

Optional endpoint:

```http
POST /api/validate_event_registration_answers
```

This is only needed if we want the frontend to pre-check answers before calling `/api/register_event`.

Request:

```json
{
  "event_id": "123",
  "answers": [
    {
      "form_id": "12",
      "question_id": "question-1710000000000-abc123",
      "value": "Rice"
    }
  ]
}
```

Success response:

```json
{
  "status": 200,
  "message": "Registration answers are valid",
  "success": true
}
```

Error response:

```json
{
  "status": 400,
  "message": "Question \"Preferred meal\" is required.",
  "field": "registration_answers.0.value"
}
```

### Function F: List Registration Answer Submissions

New endpoint:

```http
POST /api/get_event_registration_answer_submissions
```

Admin only.

Used by attendees page.

Request:

```json
{
  "event_id": "123"
}
```

Fields read:

- answer submissions for event
- user snapshot data
- submitted/updated timestamps
- whether answers exist

Success response:

```json
{
  "status": 200,
  "message": "Registration answer submissions retrieved successfully",
  "event_id": "123",
  "submissions": [
    {
      "userId": "55",
      "userName": "Jane Doe",
      "userEmail": "jane@example.com",
      "rsvpStatus": "going",
      "submittedAt": "2026-06-18T10:45:00Z",
      "updatedAt": "2026-06-18T10:45:00Z",
      "hasSurveyResponse": true
    }
  ]
}
```

Response rules:

- Always return `submissions`.
- If no submissions exist, return `submissions: []`.
- Sort newest first by `updatedAt`.

### Function G: Get One Attendee's Registration Answer Detail

New endpoint:

```http
POST /api/get_event_registration_answer_detail
```

Admin only.

Request:

```json
{
  "event_id": "123",
  "user_id": "55"
}
```

Fields read:

- answer submission for `event_id + user_id`
- historical form versions referenced by the submission
- answer values

Success response:

```json
{
  "status": 200,
  "message": "Registration answer detail retrieved successfully",
  "registration": {
    "eventId": "123",
    "eventTitleSnapshot": "Annual Alumni Reunion 2026",
    "userId": "55",
    "userName": "Jane Doe",
    "userEmail": "jane@example.com",
    "rsvpStatus": "going",
    "additionalInfo": "I may arrive late.",
    "formVersions": [
      {
        "formId": "12",
        "formVersionId": "41",
        "formVersionNumber": 3,
        "formName": "Food Preferences"
      }
    ],
    "answers": [
      {
        "formId": "12",
        "formVersionId": "41",
        "questionId": "question-1710000000000-abc123",
        "questionLabel": "Preferred meal",
        "questionType": "dropdown",
        "order": 1,
        "required": true,
        "value": "Rice"
      }
    ],
    "submittedAt": "2026-06-18T10:45:00Z",
    "updatedAt": "2026-06-18T10:45:00Z"
  },
  "forms": [
    {
      "formId": "12",
      "formName": "Food Preferences",
      "formVersionId": "41",
      "formVersionNumber": 3,
      "questions": [
        {
          "id": "question-1710000000000-abc123",
          "label": "Preferred meal",
          "type": "dropdown",
          "required": true,
          "placeholder": "Select an option",
          "options": ["Rice", "Pasta", "Salad"],
          "maxSelections": null,
          "order": 1,
          "value": "Rice"
        }
      ]
    }
  ]
}
```

Important:

- `forms[].questions[]` must include the answer `value`.
- Use the historical form version from submission time.
- If the historical version row is missing, build the response from answer snapshots.

## 3. What Backend Dev Needs To Build

### Database Work

Add tables or equivalent storage for:

1. `event_registration_forms`
2. `event_registration_form_versions`
3. `event_registration_answer_submissions`

Recommended indexes:

```sql
event_registration_forms(event_id, is_active, sort_order)
event_registration_form_versions(form_id, version_number)
event_registration_answer_submissions(event_id, user_id)
event_registration_answer_submissions(event_id, updated_at)
```

Recommended unique constraints:

```sql
unique(event_id, user_id) on event_registration_answer_submissions
unique(form_id, version_number) on event_registration_form_versions
```

### Endpoint Work

Add or update these functions:

1. Update `/api/get_events`
   - add `has_registration_questions`
   - add `registration_form_count`
2. Add `/api/get_event_registration_forms`
3. Add `/api/manage_event_registration_form`
4. Update `/api/register_event`
   - accept optional `registration_answers`
   - save RSVP and answers atomically
5. Optional: add `/api/validate_event_registration_answers`
6. Add `/api/get_event_registration_answer_submissions`
7. Add `/api/get_event_registration_answer_detail`

### Validation Work

Backend must validate form definitions:

- event exists
- user is admin for create/update/archive/reorder
- form name is required
- form has at least one question
- question labels are required
- question type is supported
- choice questions have at least two non-empty options
- non-choice questions should store empty options
- checkbox `max_selections` is null or between `1` and option count
- question IDs are unique inside a form
- question order is normalized to `1..n`

Backend must validate submitted answers:

- event exists
- event has active forms if answers are submitted
- every required active question has an answer
- submitted form exists and is active
- submitted question exists in the active form version
- no duplicate answer for the same `form_id + question_id`
- checkbox answers are arrays
- checkbox selected values exist in options
- checkbox answer count respects `max_selections`
- dropdown and multiple choice answers match one option
- short and long answers are strings
- reject unexpected extra answers

### Transaction Rules

For `/api/register_event` with `registration_answers`:

- Start transaction.
- Validate event and active forms.
- Validate all answers.
- Upsert normal event RSVP.
- Upsert structured answer submission.
- Commit.
- If anything fails, rollback.

For form update:

- Start transaction.
- Validate payload.
- Create new version row.
- Update active form pointer.
- Commit.

### Auth Rules

- Reading active forms is allowed for authenticated users who can view/register for the event.
- Managing forms is admin only.
- Listing submissions is admin only.
- Viewing submission detail is admin only.
- User registration must not trust a random `user_id` if it conflicts with the bearer token.

## 4. Required Response Standards

Backend should always send predictable response shapes. This is the part that keeps frontend work simple.

### General Success Format

Use:

```json
{
  "status": 200,
  "message": "Human readable message",
  "data_key": {}
}
```

Examples:

- `forms`
- `form`
- `registration`
- `answer_submission`
- `submissions`

Do not sometimes return `data`, sometimes `result`, sometimes `form_data` for the same endpoint.

### General Error Format

Use:

```json
{
  "status": 400,
  "message": "Question \"Preferred meal\" is required."
}
```

Optional field-level error:

```json
{
  "status": 400,
  "message": "Question \"Preferred meal\" is required.",
  "field": "registration_answers.0.value"
}
```

The frontend can also handle `error`, but `message` is preferred.

### Required Status Codes

- `200` success
- `400` validation error
- `401` unauthenticated
- `403` not allowed
- `404` event/form/submission not found
- `409` duplicate or invalid state
- `500` server error

### Timestamp Format

Always return ISO strings:

```json
"2026-06-18T10:45:00Z"
```

Do not return mixed timestamp formats.

### ID Format

IDs can be numeric in the database, but API responses should return IDs as strings.

Good:

```json
{ "id": "12" }
```

Avoid:

```json
{ "id": 12 }
```

### Empty Data

Always return empty arrays, not null:

```json
{
  "forms": [],
  "submissions": []
}
```

For optional objects, use `null`:

```json
{
  "answer_submission": null
}
```

### Field Naming

Request payloads should use `snake_case`.

Frontend can map responses, but these response fields must remain stable:

```ts
// forms
id;
event_id;
name;
sort_order;
version;
is_active;
questions;

// questions
id;
label;
type;
required;
placeholder;
options;
max_selections;
order;

// submission list
userId;
userName;
userEmail;
rsvpStatus;
submittedAt;
updatedAt;
hasSurveyResponse;

// submission detail
registration;
forms;
formVersions;
answers;
```

The submission detail intentionally uses camelCase because it matches the current frontend/Firebase shape. If backend strongly prefers snake_case, tell frontend before implementation so we can write one adapter and keep it consistent.

## Acceptance Checklist

Backend is ready when:

- `/api/get_events` returns `has_registration_questions` and `registration_form_count`.
- `/api/get_event_registration_forms` returns active forms and questions in order.
- Admin can create, update, archive, and reorder forms.
- Every form update creates a version.
- `/api/register_event` accepts optional `registration_answers`.
- RSVP and answers save in one transaction.
- Required answers are enforced.
- Invalid choice answers are rejected.
- Checkbox max selections are enforced.
- Admin can list answer submissions.
- Admin can view one attendee's submitted answers.
- Historical answers still render after form edits.
- Empty states return `[]`, not missing fields.
- All errors return stable `status` and `message`.
