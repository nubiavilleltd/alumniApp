# Job Vacancies: Auth and My Posts Plan

## Decision

Job vacancies should be protected behind authentication.

The app should also support a "My Job Posts" page where a signed-in user can see only the job vacancies they posted, then edit or delete those vacancies from there.

## Ownership Requirement

Each job vacancy must include a stable owner identifier so the frontend and backend can identify who posted it.

Preferred response field:

```ts
ownerId: string;
```

Acceptable backend fields the frontend can map:

```ts
created_by;
createdBy;
user_id;
userId;
posted_by;
postedBy;
member_id;
```

The existing adapter already checks these fields and maps them into `JobVacancyViewModel.ownerId`.

## Frontend Behavior

- `/job-vacancies` should require authentication.
- Posting a job should require a signed-in user.
- "My Job Posts" should filter vacancies by the signed-in user's ID/member ID.
- Edit and delete controls should appear only for vacancies owned by the signed-in user.
- The backend must still enforce ownership for edit and delete requests.

## Matching Logic

Use the current signed-in user identifiers:

```ts
const currentUserId = user?.id ? String(user.id) : '';
const currentUserMemberId = user?.memberId ? String(user.memberId) : '';
```

Then treat a vacancy as owned by the user when:

```ts
job.ownerId === currentUserId || job.ownerId === currentUserMemberId;
```

## Backend Contract

When creating a vacancy, the backend should store the authenticated user as the vacancy owner.

When listing vacancies, the backend should return the owner identifier with each vacancy. This is required for:

- showing user-owned vacancies on "My Job Posts"
- deciding whether to display edit/delete controls
- enforcing ownership consistently between frontend and backend

## Open Implementation Tasks

- Wrap the job vacancies route in `ProtectedRoute`.
- Add a `My Job Posts` route/page.
- Reuse the job card layout for the user's own posts.
- Add edit support for owned vacancies.
- Keep delete support owner-scoped.
- Confirm the backend returns one owner field consistently.
