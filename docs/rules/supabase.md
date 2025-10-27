# Supabase Best Practices

Last updated: 2025-10-26
Client library version: Latest

## Authentication
- Prefer `supabase.auth.getUser()` when validating active sessions. `getSession()` returns cached data without JWT verification, so pair the two (as in the documented `safeGetSession`) before trusting `session.user`.
- In Next.js App Router apps, encapsulate `createServerClient` inside `utils/supabase/server` (or similar) and supply cookie handlers from `next/headers`. Call `auth.getUser()` immediately after creating the client and keep unrelated logic out of the critical section to avoid transient "logged out" flashes.
- Middleware that refreshes sessions must return the original `supabaseResponse` object, copy cookies forward, and restrict matchers to dynamic routes so static assets bypass the auth cost.
- Browser components should bootstrap a singleton via `createBrowserClient`, call `auth.getSession()` on mount, and subscribe to `auth.onAuthStateChange`. Handle the `INITIAL_SESSION`, `SIGNED_IN`, `TOKEN_REFRESHED`, and `SIGNED_OUT` events explicitly, revalidating loaders when the client token diverges from the server copy.
- For OAuth/passwordless callbacks, verify tokens server-side with `auth.verifyOtp()` (or the provider helper), then redirect using the documented `redirect_to` pattern so the session is persisted before the user returns to the client.
- Refresh Realtime credentials after any session update with `supabase.realtime.setAuth('fresh-jwt')` to keep existing WebSocket channels authorized.
- Edge Functions, Route Handlers, and other server utilities should read `Authorization: Bearer <token>`, pass the token to `auth.getUser(token)`, and only then run tenant-scoped queries so RLS enforcement matches the calling user.
- Frameworks with custom cookie APIs (SvelteKit, Astro) must set the cookie `path` when calling `setAll`; omitting it causes the documented silent auth failures.

## Row Level Security
- Enable RLS immediately after table creation and target `TO authenticated` so anonymous requests short-circuit before evaluating policy predicates.
- For per-user isolation, compare `(select auth.uid())` to the owner column; wrapping the helper in a subselect lets Postgres cache the JWT-derived value and avoids invoking `auth.uid()` for every row.
- Add B-tree indexes on frequently filtered columns such as `user_id`, `tenant_id`, or `(tenant_id, created_at)` so RLS-aware queries stay fast even with high cardinality.
- Pull role or tenant context from JWT claims with `auth.jwt()`, e.g., checking `app_metadata.teams` arrays or enforcing MFA with the `aal` claim through restrictive policies.
- Avoid correlated subqueries across RLS-protected tables. Instead, denormalize required flags into the target table or expose them through JWT `app_metadata` to keep policy expressions deterministic.
- Model application roles with a `user_role` enum and stamp the active role into JWT metadata; RLS can then inspect `auth.jwt()->>'role'` without additional lookups.
- Layer security with restrictive policies (e.g., MFA gates). Restrictive policies always run, so keep them lightweight and based on cached claims.
- Lock in behavior with pgTAP tests via `supabase test new <policy>.test`, ensuring future migrations do not erode multi-tenant guarantees.

## Server Client
- Centralize server client creation with `createServerClient` and framework-aware cookie handlers (`cookies()` in Next.js, `event.cookies` in SvelteKit). Wrap `setAll` in `try/catch` to tolerate Server Component contexts that cannot mutate cookies.
- Middleware session refresh should set request cookies before creating a new `NextResponse`, then copy them to the outgoing response to keep browser and server states aligned during redirects.
- Use server clients for SSR data fetching, Server Actions, Route Handlers, edge middleware, and any interaction that must respect the caller's RLS context. Use plain `createClient` with service credentials only for trusted back-office processes.
- Read Supabase environment variables from server-only scopes and never embed service-role keys in browser bundles; supply typed clients with `<Database>` so misuse is a compile-time error.
- When running outside an HTTP request (cron, queues), instantiate a service-role client and pass tenant context explicitly via `supabase-auth-token` headers or function parameters to avoid cross-tenant leakage.
- Follow the SvelteKit example by setting cookie `path: '/'` when mutating auth cookies; the platform rejects writes without an explicit path.
- Share the server helper between middleware, Server Actions, and Route Handlers so behavior stays consistent and session refresh logic lives in one place.

## Client-Side Usage
- Keep a browser singleton (module-level variable or memoized hook) so `createBrowserClient` is invoked once per tab, limiting duplicate auth listeners and WebSocket connections.
- Subscribe to Realtime channels with scoped filters, e.g., `channel('tenant:123', { config: { private: true } }).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'locations', filter: 'tenant_id=eq.123' }, handler)`, and call `removeChannel` during cleanup.
- Refresh Realtime auth tokens whenever `onAuthStateChange` emits `TOKEN_REFRESHED`, and enable telemetry log levels (`log_level: 'info'`) during debugging to trace joins and reconnects.
- Pair the Supabase browser client with caching libraries (React Query, SWR) that can hydrate SSR payloads and respect stale times. Trigger loader revalidation when access tokens change so stale data cannot bleed across tenants.
- Short-circuit protected UI by gating routes on `session` before rendering to avoid exposing flickering tenant data during transitions.
- Use Presence helpers (`channel.presenceState()` inside `sync`) to hydrate collaborative UI without additional reads; broadcast metadata only from authorized tenants.
- When integrating with React Query, keep queries idempotent and rely on typed helpers (`Tables<'table'>`) so cache keys map cleanly to multi-tenant resources.

## Type Generation
- Regenerate types with `supabase gen types typescript --project-id <PROJECT_REF> --schema public > path/to/database.types.ts` (or `--local` for local dev databases) whenever a migration changes schema or policies.
- Import the generated `Database` type into every Supabase client (`createClient<Database>(url, key)`) so `Tables<'todos'>` and `Enums<'user_role'>` are available throughout the codebase.
- Infer complex query responses with `QueryData<typeof query>` to keep joins, nested selects, and RPC outputs aligned with schema changes.
- Override generated shapes when necessary using `MergeDeep` or `overrideTypes()` to fix nullable view columns or refine `single()` payloads without editing the generated file directly.
- Export a shared `TypedSupabaseClient = SupabaseClient<Database>` type and reuse it across middleware, hooks, and tests for consistency.
- Add an `update-types` npm script (`npx supabase gen types --lang=typescript --project-id "$PROJECT_REF" > src/lib/database.types.ts`) and require it in CI so drift fails fast.
- Lean on helper aliases `Tables`, `Views`, and `Enums` to simplify domain models and avoid brittle nested type paths.
- Document manual overrides alongside migrations so maintainers understand why a generated field differs from Postgres defaults.

## Migrations
- Commit every schema and policy change to `supabase/migrations/`, using `supabase migration new <slug>` for descriptive filenames that sort chronologically.
- Capture dashboard changes with `supabase db diff -f <summary>` (or add `--use-migra` for concise SQL) and check the output into version control instead of editing schema manually in production.
- Pull supporting schemas (`auth`, `storage`, or custom) with `supabase db pull --schema auth,storage` when their triggers or policies change, ensuring local development mirrors production.
- Validate reproducibility with `supabase db reset` (or `supabase start && supabase migration up`) so a clean clone can rebuild the database without manual steps.
- Promote changes using `supabase link` followed by `supabase db push`, and verify applied versions via `supabase migration list` in CI/CD.
- Embrace branching workflows: generate preview diffs, squash noisy iterations with `supabase migration squash`, and document merge order so Supabase preview branches replay migrations deterministically.
- Keep backfills and policy adjustments in the same migration so existing rows satisfy new `WITH CHECK` clauses before RLS enforcement tightens.
- Add pgTAP policy/spec tests to the migration folder (via `supabase test new`) to guard against regressions in future diffs.

## Query Patterns
- Select only required columns and leverage nested selects (`supabase.from('countries').select('id,name,cities(id,name)')`) so PostgREST handles joins while payloads stay lean.
- Combine filters with the query builder helpers (`eq`, `gt`, `in`, `like`) or channel syntax (`.or('status.eq.active,status.eq.pending')`) to express tenant and user constraints consistently with your RLS policies.
- Always apply an `.order(...)` before paginating, then use `.range(from, to)` or `.limit(pageSize)` so users see deterministic windows even as data mutates.
- Use `maybeSingle()`/`single()` for unique lookups and surface problems early by throwing when `{ error }` is truthy; logging the code/message/hint trio gives actionable telemetry.
- Align query predicates with supporting indexes (e.g., `tenant_id, created_at`) to avoid full scans that become visible as PostgREST timeouts on larger tenants.
- Fetch counts alongside pages via `.select('*', { count: 'exact', head: true })` to drive pagination UIs without loading entire result sets.
- Wrap advanced reporting or search logic in Postgres functions and call them with `supabase.rpc`, letting SQL own complex joins while TypeScript still infers response types.
- Treat `204` responses from `update`/`delete` as potential RLS blocks—if `data`, `count`, and `error` are all null, log the attempted filter so tenant audits remain transparent.
- Retry-idempotent reads when `postgrest-js` surfaces network errors, but never blindly retry writes; prefer `upsert` with conflict targets when idempotency is required.
- Bubble query errors through centralized handlers that tag the tenant, route, and Supabase error payload so on-call responders can trace multi-tenant impact quickly.
