# Job Vacancies API Contract

Frontend route: `/job-vacancies`

This document describes the job vacancy data contract the frontend is prepared to use. The current page is static UI only; once these endpoints exist, the UI can be wired with minimal adapter work.

## Auth Headers

Use the same auth convention as the rest of the upgraded API:

```http
Content-Type: application/json
X-API-Key: <client api key>
Authorization: Bearer <access_token>
```

`Authorization` should be required for creating and managing jobs. The public list can be either public or protected depending on product preference; if protected, the frontend will already send the bearer token when available.

## Data Model

Recommended backend fields:

```ts
type JobVacancy = {
  id: string;
  title: string;
  company_name: string;
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  workplace_type: 'remote' | 'hybrid' | 'onsite';
  level: 'entry' | 'mid' | 'senior' | 'lead';
  location: string;
  salary: string;
  application_deadline: string; // YYYY-MM-DD
  tags: string[];
  about_role: string;
  responsibilities: string;
  requirements: string;
  application_mode: 'email' | 'link';
  application_email?: string;
  application_url?: string;
  status: 'published' | 'draft' | 'closed';
  created_by?: string;
  created_at: string;
  updated_at?: string;
};
```

Validation rules:

- `title`, `company_name`, `job_type`, `workplace_type`, `level`, `location`, `salary`, `application_deadline`, `about_role`, `responsibilities`, `requirements`, and `application_mode` are required.
- If `application_mode` is `email`, require `application_email`.
- If `application_mode` is `link`, require `application_url`.
- `tags` should accept an array of strings. Empty array is allowed.
- `status` should default to `published` unless backend moderation requires `draft`.

## Endpoints

### Get job vacancies

```http
POST /api/get_job_vacancies
```

Request body:

```json
{
  "status": "published",
  "limit": 24,
  "offset": 0
}
```

Optional filters:

```json
{
  "search": "designer",
  "job_type": "part-time",
  "workplace_type": "remote",
  "level": "senior",
  "location": "Lagos"
}
```

Success response:

```json
{
  "status": 200,
  "message": "Job vacancies retrieved successfully",
  "jobs": [
    {
      "id": "12",
      "title": "Senior Fashion Designer",
      "company_name": "Tara House",
      "job_type": "part-time",
      "workplace_type": "remote",
      "level": "senior",
      "location": "Ikeja, Lagos",
      "salary": "₦650K/month",
      "application_deadline": "2026-03-20",
      "tags": ["Part time", "Senior Level", "Remote", "Flexible hours"],
      "about_role": "Write a short description about the job.",
      "responsibilities": "Enter the responsibilities involved in this job.",
      "requirements": "Enter the job requirements.",
      "application_mode": "email",
      "application_email": "careers@example.com",
      "status": "published",
      "created_by": "13",
      "created_at": "2026-03-01T09:00:00Z",
      "updated_at": "2026-03-01T09:00:00Z"
    }
  ],
  "pagination": {
    "limit": 24,
    "offset": 0,
    "total": 1
  }
}
```

### Create job vacancy

```http
POST /api/create_job_vacancy
```

Request body:

```json
{
  "title": "Senior Fashion Designer",
  "company_name": "Tara House",
  "job_type": "part-time",
  "workplace_type": "remote",
  "level": "senior",
  "location": "Ikeja, Lagos",
  "salary": "₦650K/month",
  "application_deadline": "2026-03-20",
  "tags": ["Flexible hours", "Fashion", "Senior Level"],
  "about_role": "Write a short description about the job.",
  "responsibilities": "Enter the responsibilities involved in this job.",
  "requirements": "Enter the job requirements.",
  "application_mode": "email",
  "application_email": "careers@example.com",
  "status": "published"
}
```

Alternative application link payload:

```json
{
  "application_mode": "link",
  "application_url": "https://company.com/careers/senior-fashion-designer"
}
```

Success response:

```json
{
  "status": 200,
  "message": "Job vacancy created successfully",
  "job": {
    "id": "12",
    "title": "Senior Fashion Designer"
  }
}
```

### Manage job vacancy

```http
POST /api/manage_job_vacancy
```

Update request body:

```json
{
  "id": "12",
  "function_type": "update",
  "title": "Senior Fashion Designer",
  "status": "published"
}
```

Close request body:

```json
{
  "id": "12",
  "function_type": "close"
}
```

Delete request body:

```json
{
  "id": "12",
  "function_type": "delete"
}
```

Success response:

```json
{
  "status": 200,
  "message": "Job vacancy updated successfully"
}
```

## Frontend Mapping

Frontend display mapping:

- Card date pill: `application_deadline`
- Company label: `company_name`
- Card title: `title`
- Pills: `tags`, plus normalized labels from `job_type`, `level`, and `workplace_type` if tags are empty.
- Footer salary: `salary`
- Footer location: `location`
- Details modal: `about_role`, `responsibilities`, `requirements`, and application destination.

## Error Responses

Recommended errors:

- `400`: Validation error or malformed payload.
- `401`: Missing or invalid API key / bearer token.
- `403`: User is not allowed to create or manage job vacancies.
- `404`: Job vacancy not found.
- `409`: Duplicate active job posting if backend chooses to enforce uniqueness.
- `500`: Server error.
