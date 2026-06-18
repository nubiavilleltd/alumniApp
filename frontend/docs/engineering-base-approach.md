# Engineering Base Approach

This app has stayed fast to build on because the architecture keeps each concern in a predictable place. New features should follow the same shape: normalize backend data at the edge, keep services thin, let React Query own server state, keep UI components focused on rendering, and centralize cross-cutting behavior.

Use this guide as the default approach for new features, refactors, and backend integration work.

## Core Principles

1. Keep backend contract changes isolated.
   Backend responses often use legacy names, mixed types, wrapper keys, or endpoint-specific shapes. Do not leak those details into pages or components. Put all inbound and outbound mapping in feature adapters.

2. Make features self-contained.
   A feature should carry its own pages, components, hooks, services, adapters, types, schemas, constants, and utilities. Shared code belongs in `src/shared` or `src/lib` only when multiple features actually use it.

3. Centralize infrastructure.
   API setup, endpoint paths, error handling, query defaults, route constants, and low-level utilities should live in one place. This is why backend URL changes, auth header behavior, and retry behavior do not ripple through the app.

4. Prefer boring build tools.
   Vite, TypeScript, Tailwind, React Query, Zustand, React Hook Form, Zod, Axios, and Firebase are enough for the current app shape. Add libraries only when they remove real complexity and are likely to stay stable on Vercel.

5. Keep the UI consuming domain objects.
   Components should receive frontend-friendly types like `Business`, `AuthSessionUser`, or project/event models. They should not know whether the backend used `user_id`, `seller_name`, `function_type`, or nested `profile` data.

## Project Shape

The current structure is feature-first:

```text
src/
  features/
    marketplace/
      api/adapters/
      components/
      hooks/
      pages/
      services/
      types/
    authentication/
    events/
    announcements/
    user/
  lib/
    api/
    errors/
    react-query/
    utils/
  shared/
    components/
    constants/
    hooks/
    stores/
    utils/
  pages/
  data/
```

Use `src/features/<feature-name>` for app domains. Use `src/shared` for reusable UI and app-level primitives. Use `src/lib` for framework-level plumbing such as API clients, error handling, React Query setup, and generic adapter helpers.

## Feature Module Template

Most new API-backed features should look like this:

```text
src/features/example/
  api/
    adapters/example.adapter.ts
  components/
    ExampleCard.tsx
    ExampleEditorModal.tsx
  hooks/
    useExample.ts
  pages/
    ExamplePage.tsx
  services/
    example.service.ts
  types/
    example.types.ts
  schemas/
    exampleSchema.ts
  routes.ts
```

Not every feature needs every folder. Start with the smallest useful version, but keep the same boundaries.

## API Flow

The preferred flow is:

```text
Page / Component
  -> feature hook
  -> feature service
  -> apiClient + API_ENDPOINTS
  -> feature adapter
  -> typed frontend model
```

### 1. Endpoints

All endpoint paths belong in `src/lib/api/endpoints.ts`.

Do this:

```ts
export const API_ENDPOINTS = {
  MARKETPLACE: {
    GET_LISTINGS: '/api/get_listings',
    CREATE_LISTING: '/api/create_listing',
    MANAGE_LISTING: '/api/manage_listing',
  },
} as const;
```

Avoid local endpoint objects inside services. When the backend changes a route, the update should happen in one file.

### 2. API Client

Use `src/lib/api/client.ts` for HTTP requests. It already handles:

- `VITE_API_BASE_URL`
- JSON defaults
- `FormData` content-type handling
- API token header
- bearer token injection
- token refresh on eligible `401` responses
- auth cleanup and redirect on expired sessions
- shared timeout
- consistent response error logging

Do not create feature-specific Axios instances unless the feature talks to a completely different backend with different auth behavior.

### 3. Adapters

Adapters are the edge of the system. They translate backend data into frontend data and frontend form values back into backend payloads.

Example responsibilities:

- convert `user_id` to `ownerId`
- convert `"0"` / `"1"` to booleans
- parse image fields that might be arrays, JSON strings, comma-separated strings, or missing
- provide safe defaults for missing fields
- build `FormData` only when files are present
- hide backend flags like `function_type`

Use shared helpers from `src/lib/utils/adapters.ts`:

- `safeParseInt`
- `stringToBoolean`
- `safeParseDate`
- `generateSlug`
- `extractList`
- `extractObject`
- `parseImages`

Adapter rule: if a page or component needs to know a backend field name, the adapter is missing work.

### 4. Services

Services own the backend call and the user-facing fallback error message.

Good service shape:

```ts
async getAll(params?: GetExampleParams): Promise<Example[]> {
  try {
    const payload = mapExampleFiltersToPayload(params);
    const { data } = await apiClient.post(API_ENDPOINTS.EXAMPLE.LIST, payload);
    return mapBackendExampleList(data);
  } catch (error) {
    throw handleApiError(
      error,
      'Unable to load examples. Please try again.',
      'exampleService.getAll',
    );
  }
}
```

Keep services thin. They should not contain rendering logic, cache invalidation, form state, or large backend normalization blocks.

### 5. Hooks

Hooks own React Query integration:

- stable query keys
- `enabled` conditions
- `staleTime`
- mutation success handling
- invalidation
- toast feedback
- selecting or slicing query results

Keep query keys in the feature hook file:

```ts
export const exampleKeys = {
  all: ['example'] as const,
  list: (params?: object) => [...exampleKeys.all, 'list', params] as const,
  detail: (id: string) => [...exampleKeys.all, 'detail', id] as const,
};
```

When mutating data, invalidate the narrow detail key and the broad feature key when needed. This keeps screens fresh without forcing full-page reloads.

## Error Handling

Use `handleApiError` from `src/lib/errors/apiErrorHandler.ts` in services. It preserves backend messages when available, falls back to friendly user messages, and keeps context for development logs.

Use `toast.fromError(error)` in mutations and UI actions. Avoid hand-parsing Axios errors inside components.

The goal is:

- backend details are preserved for debugging
- users see useful messages
- services remain consistent
- pages do not duplicate error handling

## Server State, Client State, and Forms

Use React Query for server state:

- API lists
- detail records
- create/update/delete mutations
- cached dropdown data

Use Zustand for client/session state:

- auth identity
- access token persistence
- UI state that is not owned by the server

Use React Hook Form and Zod for forms:

- field validation
- typed form values
- predictable submit payloads

Do not put server records into Zustand just to share them across pages. Fetch them with React Query and share query keys.

## Routing

Routes are centralized through shared or feature route constants:

- `src/shared/constants/routes.ts`
- `src/features/<feature>/routes.ts`

`App.tsx` composes pages with:

- `RootLayout`
- `ProtectedRoute`
- `GuestRoute`
- `AdminRoute`
- `LogoutGate`
- `ErrorBoundary`

When adding a route, prefer adding the path constant first, then wiring the route in `App.tsx`. Keep route guards close to the route declaration so access rules are obvious.

## Backend Functions

Firebase Functions live under `functions/` and are intentionally separate from the Vite client build.

Use the existing function pattern:

- export functions from `functions/src/index.ts`
- keep request handling shared in `functions/src/utils/http.ts`
- validate App Check and bearer tokens in middleware
- use typed request bodies and result shapes
- place validators close to the domain
- use `HttpError` for expected failures
- keep admin-only behavior explicit with handler options

For survey-style HTTP functions, `handleSurveyHttpRequest` already handles:

- CORS
- `OPTIONS`
- POST-only enforcement
- JSON body parsing
- App Check
- bearer verification
- admin checks
- structured error responses

Do not copy this logic into individual function files.

## Build and Deployment Stability

The Vercel build stays calm because the app keeps the setup simple:

- Vite owns the frontend build
- TypeScript uses `moduleResolution: "Bundler"`
- the `@` alias is configured in both Vite and TypeScript
- Vercel rewrites all routes to `index.html` for React Router
- Firebase Functions build separately under `functions/`
- environment variables are read through `import.meta.env`

Before merging meaningful changes, run:

```bash
npm run build
```

For Functions changes, also run:

```bash
cd functions
npm run build
```

## Adding a New Feature Checklist

1. Create `src/features/<feature-name>`.
2. Add frontend domain types in `types/`.
3. Add API endpoints to `src/lib/api/endpoints.ts`.
4. Create adapters for inbound and outbound data.
5. Create a service that uses `apiClient`, `API_ENDPOINTS`, adapters, and `handleApiError`.
6. Create hooks with query keys, queries, mutations, invalidation, and toast handling.
7. Build pages and components against frontend types only.
8. Add route constants and wire routes through `App.tsx`.
9. Add schemas for complex forms.
10. Run the relevant build command.

## Code Review Checklist

Ask these questions before merging:

- Did backend field names stay inside adapters?
- Did endpoint paths go into `API_ENDPOINTS`?
- Does the service use `apiClient` and `handleApiError`?
- Are query keys stable and feature-scoped?
- Are mutations invalidating the correct queries?
- Is server state kept out of Zustand?
- Are route guards explicit?
- Are forms validated with schemas when validation is non-trivial?
- Does the feature build on Vercel without custom build hacks?
- Is shared code actually shared by more than one feature?

## Dependency Guidelines

Default to the existing stack:

- React for UI
- Vite for build/dev
- TypeScript for type safety
- Tailwind for styling
- React Router for routing
- React Query for server state
- Axios for HTTP
- Zustand for small client stores
- React Hook Form and Zod for forms
- Firebase/Firebase Functions for Firebase-backed backend work
- Lucide/Iconify for icons

Add a new package only when:

- it solves a real repeated problem
- it is maintained and compatible with Vite/Vercel
- it does not duplicate something already in the stack
- the feature would be meaningfully worse without it

## The Short Version

When building anything new, keep this mental model:

```text
Backend weirdness stops at adapters.
Services talk to APIs.
Hooks manage server state.
Components render typed frontend models.
Shared infrastructure stays centralized.
The build remains boring.
```

trim(first(split(outputs('Email_Subject'), ' has signed')))
