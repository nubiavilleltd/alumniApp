# Next.js Engineering Base Approach

This guide adapts the app's current engineering style to a Next.js App Router codebase. The core philosophy stays the same: normalize backend data at the edge, keep features self-contained, centralize infrastructure, and make the build boring. The mechanics change because Next.js gives us Server Components, layouts, middleware, route handlers, server actions, and first-class server-side data fetching.

Use this as the default base approach for a new Next.js version of this app or for future products that should feel as easy to extend as the current React/Vite app.

## Core Principles

1. Backend weirdness stops at adapters.
   Components should render clean frontend models. Legacy backend names, mixed booleans, wrapped response arrays, file upload shape, and `function_type` flags belong in adapters.

2. Server-only work stays on the server.
   Tokens, private API keys, privileged Firebase/Admin SDK work, and backend-to-backend calls should live in server services, route handlers, server actions, or middleware.

3. Client Components are for interactivity.
   Use Client Components for forms, modals, optimistic UI, browser APIs, live updates, and React Query. Keep static or data-loaded page structure in Server Components where possible.

4. Features own their domain.
   Each feature should carry its own components, adapters, services, actions, hooks, schemas, and types. Shared code moves to `shared` or `lib` only when it is actually reused.

5. Routing and access rules should be visible.
   Use route groups, layouts, middleware, and server redirects to make public, auth, admin, and dashboard surfaces obvious.

6. Keep deployment simple.
   Prefer standard Next.js/Vercel behavior over custom build hacks. Use environment variables correctly, avoid unnecessary runtime configuration, and keep Node-only code out of Edge routes unless it is compatible.

## Recommended Project Shape

For a Next.js App Router app, use this structure:

```text
src/
  app/
    (public)/
      page.tsx
      about/page.tsx
      layout.tsx
    (auth)/
      login/page.tsx
      register/page.tsx
      layout.tsx
    (dashboard)/
      dashboard/page.tsx
      marketplace/page.tsx
      settings/page.tsx
      layout.tsx
    admin/
      page.tsx
      members/page.tsx
    api/
      webhooks/
        route.ts
  features/
    marketplace/
      adapters/
        marketplace.adapter.ts
      actions/
        marketplace.actions.ts
      components/
      hooks/
        useMarketplace.ts
      services/
        marketplace.server.ts
        marketplace.client.ts
      types/
        marketplace.types.ts
      schemas/
        marketplace.schema.ts
    authentication/
    events/
    announcements/
    user/
  lib/
    api/
      endpoints.ts
      serverClient.ts
      browserClient.ts
    auth/
      session.ts
      permissions.ts
    errors/
    react-query/
    utils/
  shared/
    components/
    constants/
    hooks/
    stores/
    utils/
```

Use `src/app` only for routing, layouts, loading states, error boundaries, metadata, and page composition. Put domain logic in `src/features`.

## App Router Rules

Use route groups to express product areas:

- `(public)` for marketing/public pages
- `(auth)` for login, register, password reset, verification
- `(dashboard)` for signed-in member pages
- `admin` for admin-only surfaces

Use colocated App Router files intentionally:

- `page.tsx` for route entry points
- `layout.tsx` for section shell and shared data
- `loading.tsx` for route-level pending states
- `error.tsx` for route-level recoverable errors
- `not-found.tsx` for missing records
- `route.ts` for API route handlers

Keep route files thin. A `page.tsx` should usually fetch or compose, then hand off to feature components.

## Server and Client Boundaries

Next.js works best when the boundary is explicit.

Use Server Components for:

- initial page data
- SEO-friendly pages
- authenticated redirects
- reading server cookies
- calling server services
- rendering mostly static UI

Use Client Components for:

- forms
- modals and drawers
- tabs and filters that update immediately
- file uploads
- browser storage
- toast feedback
- React Query hooks
- Zustand stores

Add `'use client'` only at the leaf component that needs it. Do not mark entire route trees as client-rendered unless the whole screen is genuinely interactive.

## API Flow

Prefer this flow:

```text
Server Component or Server Action
  -> server service
  -> server API client / Firebase Admin / database
  -> adapter
  -> typed frontend model

Client Component
  -> feature hook or server action
  -> client service when browser fetch is required
  -> adapter
  -> typed frontend model
```

The rule is simple: if a request needs secrets, cookies, admin privileges, or private credentials, do it server-side.

## Endpoints

Keep backend paths centralized in `src/lib/api/endpoints.ts`.

```ts
export const API_ENDPOINTS = {
  MARKETPLACE: {
    GET_LISTINGS: '/api/get_listings',
    CREATE_LISTING: '/api/create_listing',
    MANAGE_LISTING: '/api/manage_listing',
  },
} as const;
```

Do not scatter backend URLs across pages, actions, hooks, and services. If a backend route changes, the app should need one endpoint update and possibly one adapter update.

## API Clients

Use separate clients for server and browser work.

`serverClient.ts` should:

- run only on the server
- read server-only environment variables
- attach private API keys
- read cookies when needed
- support `cache`, `next.revalidate`, or `next.tags` when using `fetch`
- never be imported by Client Components

`browserClient.ts` should:

- use only `NEXT_PUBLIC_` variables
- send safe browser requests
- avoid private tokens or secrets
- support upload cases where browser `FormData` is needed

Prefer native `fetch` for server services unless Axios is clearly needed. Next.js integrates caching, revalidation, and request memoization with `fetch`.

## Adapters

Adapters remain the most important portability layer.

Use adapters to:

- map backend field names to frontend field names
- coerce strings/numbers/booleans safely
- unwrap arrays from inconsistent response keys
- parse dates consistently
- resolve image URLs
- build create/update/delete payloads
- choose `FormData` only when files are present

Adapter example:

```ts
export function mapBackendListingToBusiness(raw: unknown): Business {
  const data = raw as Record<string, unknown>;

  return {
    businessId: String(data.id ?? ''),
    ownerId: String(data.user_id ?? ''),
    owner: String(data.seller_name ?? 'Unknown'),
    name: String(data.title ?? 'Untitled'),
    description: String(data.description ?? ''),
    images: parseImages(data.images),
  };
}
```

Page and component rule: if UI code is checking `user_id`, `seller_name`, or backend wrapper keys, move that logic into an adapter.

## Services

Use two service styles when needed.

Server services:

```ts
export async function getMarketplaceListings(params?: GetMarketplaceParams): Promise<Business[]> {
  try {
    const response = await serverApi.post(API_ENDPOINTS.MARKETPLACE.GET_LISTINGS, params);
    return mapBackendListingList(response);
  } catch (error) {
    throw handleApiError(error, 'Unable to load marketplace businesses.');
  }
}
```

Client services:

```ts
export async function createListing(input: CreateListingFormData): Promise<Business> {
  const payload = mapBusinessToCreatePayload(input);
  const response = await browserApi.post(API_ENDPOINTS.MARKETPLACE.CREATE_LISTING, payload);
  return mapBackendListingToBusiness(response);
}
```

Prefer server services by default. Add client services only when the browser must own the interaction.

## Server Actions

Use server actions for mutations that benefit from server-side auth, validation, and revalidation.

Good server action responsibilities:

- validate input with Zod
- read the current session
- call server services
- map expected errors into action results
- call `revalidatePath` or `revalidateTag`
- redirect after successful flows when appropriate

Avoid making server actions huge. They should orchestrate validation, permissions, service calls, and revalidation.

Typical action shape:

```ts
'use server';

export async function createMarketplaceListingAction(input: unknown) {
  const parsed = createListingSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const user = await requireCurrentUser();
    const listing = await createMarketplaceListing(parsed.data, user.id);
    revalidateTag('marketplace');
    return { ok: true, listing };
  } catch (error) {
    return { ok: false, message: getActionErrorMessage(error) };
  }
}
```

## React Query in Next.js

Use React Query for highly interactive client state:

- dashboards with filters
- polling or realtime-like refresh
- optimistic updates
- forms that update lists without navigation
- user-owned resource management screens

Do not use React Query for every Server Component page. If the page can be fetched on the server and rendered directly, keep it server-rendered.

Keep query keys feature-scoped:

```ts
export const marketplaceKeys = {
  all: ['marketplace'] as const,
  list: (params?: object) => [...marketplaceKeys.all, 'list', params] as const,
  detail: (id: string) => [...marketplaceKeys.all, 'detail', id] as const,
};
```

Use a `QueryProvider` only around route groups that need client-side queries. Avoid turning the whole app into a Client Component just to mount providers.

## Auth and Route Protection

Use layered protection:

- middleware for broad route access checks
- server helpers like `requireCurrentUser()` for sensitive data access
- layout-level redirects for dashboard/admin shells
- permission helpers for role-specific checks
- server actions and route handlers must re-check permissions

Do not rely only on client-side guards. Client guards improve user experience, but server checks protect data.

Suggested auth helpers:

```text
src/lib/auth/session.ts
  getCurrentUser()
  requireCurrentUser()
  requireAdmin()

src/lib/auth/permissions.ts
  canManageListing()
  canViewAdmin()
```

Middleware should stay lightweight. Avoid database-heavy permission checks in middleware unless the deployment/runtime supports it cleanly.

## Route Handlers

Use `app/api/**/route.ts` for:

- webhooks
- internal BFF endpoints
- upload signing
- integrations that require secrets
- proxying legacy APIs when needed

Route handlers should:

- validate methods and input
- check auth when required
- call services
- return consistent JSON
- avoid duplicating adapter logic

Use `runtime = 'nodejs'` for handlers that need Node APIs, Firebase Admin, or libraries that are not Edge-compatible.

## Caching and Revalidation

Choose caching deliberately.

Use static or cached server fetches for:

- public content
- announcements/blog lists
- leadership pages
- mostly stable resources

Use `no-store` for:

- user dashboards
- authenticated profile data
- admin screens
- frequently changing private data

Use tags for feature-level revalidation:

```ts
await fetch(url, {
  next: { tags: ['marketplace'] },
});
```

After mutations, use:

- `revalidateTag('marketplace')` for feature lists
- `revalidatePath('/dashboard/marketplace')` for specific pages
- React Query invalidation for client-managed screens

Do not mix caching strategies randomly inside the same feature. Document the default per feature.

## Forms

Use React Hook Form and Zod for client-heavy forms. Use Zod again in server actions. Client validation improves UX; server validation protects the system.

Form flow:

```text
Form component
  -> Zod resolver
  -> server action or mutation
  -> adapter builds payload
  -> service calls backend
  -> action/mutation returns user-friendly result
```

For file uploads, prefer browser-owned `FormData`, then pass it to a server action or upload endpoint depending on file size and hosting constraints.

## Error Handling

Keep error handling centralized:

- `handleApiError` for services
- `getActionErrorMessage` for server actions
- `error.tsx` for route-level UI recovery
- `not-found.tsx` for missing resources
- toast feedback for client mutations

Expected errors should become user-friendly messages. Unexpected errors should be logged and allowed to hit the nearest error boundary.

## Metadata and SEO

Use Next.js metadata APIs instead of client-side SEO components.

For static routes:

```ts
export const metadata = {
  title: 'Marketplace',
  description: 'Discover alumni businesses and services.',
};
```

For detail routes:

```ts
export async function generateMetadata({ params }: Props) {
  const listing = await getMarketplaceListing(params.id);

  return {
    title: listing?.name ?? 'Business',
    description: listing?.description,
  };
}
```

Keep public pages server-rendered when SEO matters.

## Environment Variables

Use server variables for secrets:

```text
API_BASE_URL=
API_TOKEN=
FIREBASE_ADMIN_PROJECT_ID=
```

Use `NEXT_PUBLIC_` only for values that are safe in the browser:

```text
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY=
```

Never expose private API tokens through `NEXT_PUBLIC_`.

## Build and Deployment Stability

For Vercel:

- use the standard Next.js build
- keep Node-only code out of Edge middleware and Edge route handlers
- set `runtime = 'nodejs'` where Firebase Admin or Node APIs are required
- keep environment variables configured per environment
- run type checks during build
- avoid custom rewrites unless they solve a real routing need

Before merging meaningful changes, run:

```bash
npm run build
```

Also run lint/type/test commands if the target repo defines them.

## Adding a New Feature Checklist

1. Create `src/features/<feature-name>`.
2. Add frontend domain types.
3. Add Zod schemas for forms and server action inputs.
4. Add endpoint constants in `src/lib/api/endpoints.ts`.
5. Create adapters for backend-to-frontend and frontend-to-backend mapping.
6. Create server services first.
7. Add client services only when browser fetch is required.
8. Add server actions for mutations that need auth, validation, and revalidation.
9. Add React Query hooks only for interactive client-managed screens.
10. Add route files under `src/app`, keeping them thin.
11. Add route protection in middleware, layouts, or server helpers as appropriate.
12. Add `loading.tsx`, `error.tsx`, and `not-found.tsx` where the route needs them.
13. Define caching and revalidation behavior.
14. Run the build.

## Code Review Checklist

Ask these questions before merging:

- Did backend field names stay inside adapters?
- Is secret or authenticated work happening on the server?
- Are Client Components limited to interactive leaves?
- Are route files thin and domain logic kept in features?
- Are server actions validating input and checking permissions?
- Are route handlers using consistent responses and auth checks?
- Is caching intentional and documented by feature?
- Are React Query hooks used only where client interactivity needs them?
- Are metadata and SEO handled server-side?
- Are environment variables correctly split between server-only and `NEXT_PUBLIC_`?
- Does the feature build on Vercel without custom hacks?

## Dependency Guidelines

Default stack:

- Next.js App Router
- React
- TypeScript strict mode
- Tailwind CSS
- React Query for interactive server state
- React Hook Form and Zod for forms
- Zustand for small client-only state
- Firebase/Firebase Admin where needed
- Lucide/Iconify for icons

Add libraries only when:

- the platform does not already solve the problem
- the package is compatible with the intended runtime
- it removes real repeated complexity
- it will not make Vercel builds fragile

## The Short Version

Use this mental model:

```text
Backend weirdness stops at adapters.
Server-only work stays on the server.
Client Components handle interaction.
Server Components load and compose pages.
Hooks manage client-side server state only when needed.
Route protection lives in middleware, layouts, and server helpers.
The build remains boring.
```
