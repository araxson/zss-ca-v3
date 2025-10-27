# CLAUDE.md

**Guidance for Claude Code when working with this repository.**

> **CRITICAL:** Read `docs/stack-patterns/ui-patterns.md`, `docs/stack-patterns/typescript-patterns.md`, and `docs/rules/` before making ANY changes.

---

## 🎯 Quick Start

### Pre-Flight Checklist

**Architecture:**
- [ ] Pages are thin shells (5-12 lines) - logic in `features/`
- [ ] Features export public API via `index.ts` barrel exports
- [ ] Server Components by default, Client Components only for interactivity
- [ ] Auth checks use `getUser()` NOT `getSession()`
- [ ] Auth/role checks ONLY in Server Components/Route Handlers (NEVER in proxy.ts)

**Code Quality:**
- [ ] Server actions have `'use server'` directive
- [ ] Client components have `'use client'` directive
- [ ] Forms use Zod + React Hook Form + shadcn/ui Form components
- [ ] NO `any` types - use `unknown` with type guards
- [ ] NO `@ts-ignore` or `@ts-expect-error`

**UI Rules (ABSOLUTE):**
- [ ] Use shadcn/ui components ONLY (53 available)
- [ ] NEVER edit `components/ui/*` or `app/globals.css`
- [ ] Design tokens only - NO arbitrary colors (`bg-blue-500`, etc.)
- [ ] Complete component compositions (use all slots: Card → CardHeader → CardTitle, etc.)

**Data & Security:**
- [ ] Database types from `Database['public']['Tables'][...]`
- [ ] All queries filter by `user.id` for multi-tenancy
- [ ] Server actions return `{ success: true }` or `{ error: string }`
- [ ] Verify field names in `lib/types/database.types.ts` (e.g., `contact_email` NOT `email`)

### Commands

```bash
npm run dev              # Development server (localhost:3000)
npm run build            # Production build + type check
npm run lint             # ESLint
npx tsc --noEmit        # Type check only
```

---

## 📋 Project Overview

**SaaS platform for a Canadian web design agency.** Small businesses subscribe to website plans; agency builds and deploys static Next.js sites for clients.

**Stack:** Next.js 16.0 • React 19.2 • Supabase • Stripe • TypeScript 5 • shadcn/ui • Tailwind CSS 4

---

## 🏗️ Architecture

### App Structure

Four route groups organize the application:

```
app/
├── (marketing)/              # Public pages → /, /[page]
│   ├── page.tsx              # Home page
│   └── [page]/page.tsx       # Static pages (about, pricing, contact)
│
├── (admin)/                  # Admin portal → /admin/*
│   └── admin/
│       ├── layout.tsx        # Auth guard + sidebar
│       ├── [page]/page.tsx   # Static pages (dashboard, profile, notifications)
│       ├── [resource]/       # Resource pages (clients, sites, support, audit-logs)
│       │   ├── page.tsx      # List view
│       │   ├── [id]/page.tsx # Detail view
│       │   └── new/page.tsx  # Create view (where applicable)
│
├── (client)/                 # Client portal → /client/*
│   └── client/
│       ├── layout.tsx        # Auth guard + sidebar
│       ├── [page]/page.tsx   # Static pages (dashboard, subscription, profile, notifications)
│       ├── [resource]/       # Resource pages (sites, support)
│       │   ├── page.tsx      # List view
│       │   ├── [id]/page.tsx # Detail view
│       │   └── new/page.tsx  # Create view (where applicable)
│
├── (auth)/                   # Auth pages → /auth/*
│   └── auth/
│       ├── [flow]/page.tsx   # Auth flows (login, signup, reset-password, etc.)
│       └── callback/route.ts # OAuth callback
│
├── api/                      # API routes
│   └── [service]/            # Services (stripe, etc.)
│       └── [endpoint]/route.ts
│
└── layout.tsx                # Root layout

proxy.ts                      # Next.js 16 Proxy (session refresh only)
```

### Feature Organization

features/
  marketing/
    sections/
      [section-name]/
        [section-name].tsx
        [section-name].data.ts
        [section-name].types.ts     ← section-specific types (optional)
        index.ts                    ← export component + data
    [page-name]-page.tsx
    [page-name].seo.ts              ← SEO metadata
    [page-name].types.ts            ← feature-wide types (optional)
    index.ts                        ← export page + sections


```
features/[name]/
├── api/
│   ├── queries.ts        # Server-only data fetching (mark 'server-only')
│   └── mutations.ts      # Server actions ('use server')
├── components/           # UI (mark 'use client' if needed)
├── schema.ts             # Zod validation
├── types.ts              # Feature types (optional)
└── index.ts              # ⭐ Barrel export (public API only)
```

**Barrel Export Pattern (REQUIRED):**

Each feature MUST have `index.ts` that exports only the public API:

```tsx
// features/[portal]/[feature]/index.ts
export { getData } from './api/queries'
export { createAction } from './api/mutations'
export { FeatureView } from './components/feature-view'
export { formSchema } from './schema'
// Internal components NOT exported
```

**Page imports features from single path:**

```tsx
// ✅ CORRECT - Single import from feature
import { getData, FeatureView } from '@/features/[portal]/[feature]'

// ❌ WRONG - Deep imports
import { getData } from '@/features/[portal]/[feature]/api/queries'
import { FeatureView } from '@/features/[portal]/[feature]/components/feature-view'
```

**Why:**
- Pages stay thin (5-12 lines)
- Clear public API per feature
- Easy refactoring (internal changes isolated)
- Better encapsulation

### Shared Libraries

```
lib/
├── supabase/
│   ├── server.ts         # Server Components
│   ├── client.ts         # Client Components
│   └── middleware.ts     # Session refresh helper (used by proxy.ts)
├── config/
│   ├── site.config.ts
│   ├── nav.config.ts
│   └── seo.config.ts
├── constants/
│   ├── routes.ts         # Type-safe routes
│   └── breakpoints.ts
├── types/
│   ├── database.types.ts # Generated (DO NOT EDIT)
│   └── global.types.ts
└── utils/
    ├── cn.ts
    └── format.ts

components/
├── providers/
│   └── theme-provider.tsx
└── ui/                   # shadcn (DO NOT EDIT - 53 components)
```

### Authentication Flow

**Next.js 16 + Supabase SSR Architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│  PROXY (proxy.ts) - Node.js Runtime                          │
│  ✅ Session token refresh ONLY                              │
│  ✅ NO authorization, NO role checks, NO database queries   │
│  📖 Required per Supabase SSR docs                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  SERVER COMPONENTS (Layouts, Pages)                          │
│  ✅ Auth checks (getUser())                                 │
│  ✅ Role verification (admin vs client)                     │
│  ✅ Database queries                                         │
│  ✅ Redirect logic                                           │
└─────────────────────────────────────────────────────────────┘
```

**User Flow:**
- **Unauthenticated** → Marketing pages or `/auth/*`
- **Client** → `/client/dashboard` (redirected if admin)
- **Admin** → `/admin/dashboard` (redirected if accessing client portal)
- **Auth checks** → Portal layouts handle role verification
- **Session refresh** → `proxy.ts` (runs on every request)

**CRITICAL - Authentication Best Practices:**

Per Next.js 16 and Supabase SSR official documentation:

1. **Proxy (proxy.ts):**
   - ONLY handles session token refresh via `getUser()`
   - Runs on Node.js runtime
   - NO authorization, NO role checks, NO database queries
   - Replaces deprecated `middleware.ts` pattern
   - Required for automatic token refresh

2. **Server Components (Layouts/Pages):**
   - Authentication checks: `await supabase.auth.getUser()`
   - Authorization checks: role verification, permissions
   - Database queries for user data
   - Redirect logic based on auth state

3. **Route Handlers (API Routes):**
   - Same auth/authorization pattern as Server Components
   - Business logic and data mutations
   - Return appropriate HTTP status codes

**Common Pitfalls to Avoid:**
- ❌ Adding role checks in proxy.ts
- ❌ Making database queries in proxy.ts
- ❌ Using `getSession()` instead of `getUser()`
- ❌ Not checking user role before redirecting after login/OAuth
- ❌ Not preserving user intent (e.g., plan selection) through auth flow

**See:**
- https://nextjs.org/blog/next-16
- https://supabase.com/docs/guides/auth/server-side/nextjs

---

## 🔐 Authentication Implementation Details

### Session Refresh Flow (proxy.ts)

**File:** `proxy.ts` (root level)

```typescript
// This proxy runs on every request to refresh tokens
export default async function proxy(request: NextRequest) {
  return await updateSession(request)  // Calls lib/supabase/middleware.ts
}
```

**What happens:**
1. Every request passes through proxy
2. `updateSession()` creates Supabase client with cookie management
3. Calls `getUser()` which triggers auto token refresh if expired
4. Updates response cookies with new tokens
5. Request continues to destination

**Important:** This ONLY refreshes tokens. NO auth checks here!

### Authentication in Layouts

**Example:** `app/(client)/client/layout.tsx`

```typescript
export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 1. Check if authenticated
  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  // 2. Get user profile and role
  const { data: profile } = await supabase
    .from('profile')
    .select('*')
    .eq('id', user.id)
    .single()

  // 3. Check authorization (role-based)
  if (profile?.role === 'admin') {
    redirect(ROUTES.ADMIN_DASHBOARD)  // Admins can't access client portal
  }

  // 4. Render layout with user data
  return <SidebarProvider>...</SidebarProvider>
}
```

**Pattern:**
1. Always call `getUser()` not `getSession()`
2. Redirect if not authenticated
3. Query profile for role/permissions
4. Redirect if wrong role
5. Pass profile data to components

### Login with Role Detection

**File:** `features/auth/api/mutations.ts`

```typescript
export async function loginAction(data: LoginInput) {
  const supabase = await createClient()

  // 1. Authenticate user
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error) {
    return { error: error.message }
  }

  // 2. Get user and check role
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profile')
      .select('role')
      .eq('id', user.id)
      .single()

    // 3. Redirect based on role
    const redirectUrl = profile?.role === 'admin'
      ? ROUTES.ADMIN_DASHBOARD
      : ROUTES.CLIENT_DASHBOARD

    redirect(redirectUrl)
  }

  redirect(ROUTES.CLIENT_DASHBOARD)  // Fallback
}
```

**Why this matters:**
- Prevents double redirects (login → client → admin)
- Better UX (one redirect instead of two)
- Cleaner logs

### OAuth Callback with Role Detection

**File:** `app/(auth)/callback/route.ts`

```typescript
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)

    // Get user and check role
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: profile } = await supabase
        .from('profile')
        .select('role')
        .eq('id', user.id)
        .single()

      // Redirect based on role
      const redirectUrl = profile?.role === 'admin'
        ? ROUTES.ADMIN_DASHBOARD
        : ROUTES.CLIENT_DASHBOARD

      return NextResponse.redirect(new URL(redirectUrl, requestUrl.origin))
    }
  }

  return NextResponse.redirect(new URL(ROUTES.LOGIN, requestUrl.origin))
}
```

### Plan Preservation Through Signup

**Problem:** User clicks "Get Started" for Business plan, but after signup/OTP, loses context.

**Solution:** Preserve plan ID through entire flow.

**Flow:**
1. Pricing page: `/signup?plan=business-plan-id`
2. Signup form: Reads `plan` param
3. After signup: `/verify-otp?email=...&type=email_confirmation&plan=business-plan-id`
4. After OTP: `/pricing?selected=business-plan-id`
5. User clicks "Get Started" again → Goes to checkout

**Files:**
- `features/shared/subscription/components/checkout-button.tsx` - Passes plan
- `features/auth/components/signup-form.tsx` - Preserves plan
- `features/auth/components/otp-verification-form.tsx` - Smart redirect

### Suspense Boundaries for useSearchParams

**Issue:** Next.js 16 requires Suspense when using `useSearchParams()` in Client Components.

**Solution:**

```typescript
// app/(auth)/signup/page.tsx
export default function SignupPage() {
  return (
    <Card>
      <CardContent>
        <Suspense fallback={<div>Loading...</div>}>
          <SignupForm />  {/* Uses useSearchParams internally */}
        </Suspense>
      </CardContent>
    </Card>
  )
}
```

**When needed:**
- Any Client Component using `useSearchParams()`
- Any Client Component using `usePathname()` for dynamic behavior
- Always wrap at the page level, not deep in components

---

## 📐 Coding Standards

### TypeScript Rules

**5 Non-Negotiable Rules:**

1. **NO `any` types** - Use `unknown` with type guards
2. **NO type suppressions** - No `@ts-ignore` / `@ts-expect-error`
3. **Generated database types** - Never hand-write DB types
4. **Infer from Zod** - `z.infer<typeof schema>` for forms
5. **Strict mode enabled** - Required in `tsconfig.json`

**Configuration:** ES2017 target, strict mode, `@/*` path alias

### UI Development Rules

**shadcn/ui Component Requirements:**

```tsx
// ✅ CORRECT - Complete Card composition
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>

// ❌ WRONG - Incomplete structure
<Card>
  <h2>Title</h2>
  <p>Content</p>
</Card>

// ✅ CORRECT - Design tokens
className="bg-primary text-foreground"

// ❌ WRONG - Arbitrary colors
className="bg-blue-500 text-gray-700"
```

**Component Mapping:**
- Content blocks → `Card`
- Notices → `Alert`
- Modals → `Dialog`
- Side panels → `Sheet`
- Forms → `Form` + `FormField` + React Hook Form + Zod
- Status → `Badge`
- Tables → `Table`

**Forbidden:**
- Editing `components/ui/*` files
- Editing `app/globals.css`
- Creating custom typography wrappers
- Using arbitrary color values

### Data Patterns

**Server Components (default):**
```tsx
// app/(client)/client/[page]/page.tsx
export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(ROUTES.LOGIN)

  const { data } = await supabase
    .from('subscription')
    .select('*, plan:plan_id(*)')
    .eq('profile_id', user.id)  // Always filter by user.id
    .is('deleted_at', null)
    .single()

  return <Dashboard data={data} />
}
```

**Server Actions:**
```tsx
'use server'

export async function createAction(input: Input) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('table').insert({ ...input, profile_id: user.id })

  if (error) return { error: error.message }

  revalidatePath('/path', 'page')
  return { success: true }
}
```

**Forms:**
```tsx
'use client'

export function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),  // From schema.ts
  })

  async function onSubmit(data: FormData) {
    const result = await serverAction(data)
    if (result.error) {
      // Handle error
      return
    }
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="field"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
```

**Type Inference from Zod:**
```tsx
// schema.ts
export const createSchema = z.object({
  subject: z.string().min(5),
  message: z.string().min(20),
})

export type CreateInput = z.infer<typeof createSchema>

// mutations.ts
'use server'
import type { CreateInput } from '../schema'

export async function createAction(data: CreateInput) {
  // TypeScript knows exact shape
}
```

---

## 🔧 Development Workflows

### Add a New Feature

**Example: Support ticket system for client portal**

1. **Create structure:**
   ```
   features/[portal]/[feature]/
   ├── api/mutations.ts
   ├── components/
   │   ├── [feature]-form.tsx
   │   └── [feature]-list.tsx
   └── schema.ts
   ```

2. **Define schema** (`schema.ts`):
   ```tsx
   export const createSchema = z.object({
     subject: z.string().min(5),
     message: z.string().min(20),
     category: z.enum(['technical', 'content_change', 'billing']),
   })

   export type CreateInput = z.infer<typeof createSchema>
   ```

3. **Create action** (`api/mutations.ts`):
   ```tsx
   'use server'

   export async function createAction(data: CreateInput) {
     const supabase = await createClient()
     const { data: { user } } = await supabase.auth.getUser()

     if (!user) return { error: 'Unauthorized' }

     const { error } = await supabase.from('[table]').insert({
       ...data,
       profile_id: user.id,
     })

     if (error) return { error: error.message }
     return { success: true }
   }
   ```

4. **Create component** (`components/[feature]-form.tsx`):
   ```tsx
   'use client'

   export function FeatureForm() {
     const form = useForm({
       resolver: zodResolver(createSchema),
     })

     return <Form {...form}>...</Form>
   }
   ```

5. **Create barrel export** (`index.ts`):
   ```tsx
   export { createAction } from './api/mutations'
   export { FeatureForm } from './components/[feature]-form'
   export { createSchema } from './schema'
   ```

6. **Create page** (`app/([portal])/[portal]/[resource]/page.tsx`):
   ```tsx
   import { FeatureForm } from '@/features/[portal]/[feature]'

   export default function Page() {
     return <FeatureForm />
   }
   ```

### Add a New Page

1. Choose route group: `(marketing)`, `(admin)`, `(client)`, or `(auth)`
2. Create Server Component by default
3. Inherit layout (auth checks automatic in portals)
4. Fetch data directly in Server Component
5. Pass data to Client Components via props

### Database Migration

1. **Create file:** `supabase/migrations/[timestamp]_[description].sql`
2. **Write SQL with RLS:**
   ```sql
   ALTER TABLE [table] ADD COLUMN [column] [type] DEFAULT [value];

   CREATE POLICY "[description]"
     ON [table] FOR [operation]
     USING (auth.uid() = id);
   ```
3. **Apply migration** (use Supabase MCP or dashboard)
4. **Regenerate types:**
   ```bash
   # Via MCP: mcp__supabase__generate_typescript_types()
   # Or CLI:
   npx supabase gen types typescript --project-id [id] > lib/types/database.types.ts
   ```

### Install shadcn Component

```bash
npx shadcn@latest add [component-name]
# Or via MCP: mcp__shadcn__install_component({ component: '[component-name]' })
```

### Pre-Commit Validation

**UI violations (MUST be 0):**
```bash
rg "from ['\"]@/components/ui/typography['\"]" --type tsx [path]
rg "(bg|text|border)-(blue|red|green|gray|slate)-[0-9]+" --type tsx [path]
rg "<(CardTitle|AlertTitle)>.*<(span|p|div)" --type tsx [path]
rg "style=\{\{" --type tsx [path]
```

**Type safety (MUST be 0):**
```bash
rg "\bany\b" --type ts --type tsx | grep -v "[exclude-pattern]"
rg "@ts-ignore|@ts-expect-error" --type ts --type tsx
npm run build
```

---

## 📚 Reference

### Database Schema

**9 Core Tables (all have RLS):**

- **`profile`** - User profiles (extends auth.users)
  - Fields: `contact_email`, `contact_name`, `contact_phone`, `company_name`, `stripe_customer_id`
  - ⚠️ Uses `contact_*` prefix, NOT `email`/`full_name`/`phone`

- **`plan`** - Subscription plan catalog (4 tiers: Starter, Business, Professional, Enterprise)
  - Fields: `price_monthly_cad`, `price_yearly_cad`, `stripe_price_id_monthly`, `stripe_price_id_yearly`, `features` (JSONB)

- **`subscription`** - Active subscriptions
  - ⚠️ Does NOT store `stripe_customer_id` (stored in profile)

- **`client_site`** - Website deployment tracking

- **`support_ticket`** - Support system

- **`ticket_reply`** - Ticket conversations
  - ⚠️ Uses `author_profile_id` NOT `profile_id`

- **`notification`** - In-app notifications

- **`audit_log`** - Compliance audit trail

- **`site_analytics`** - Site metrics

**Database Features:**
- 7 enums (user_role, subscription_status, site_status, etc.)
- 14 functions (triggers, helpers, utilities)
- 5 monitoring views for admins
- Complete RLS policies on all tables

**Critical Field Names:**
- Always verify in `lib/types/database.types.ts` before querying
- Profile: `contact_email`, `contact_name`, `contact_phone`, `company_name`, `company_website`
- Ticket replies: `author_profile_id`, `support_ticket_id`

### Stripe Integration

**Files:**
- `lib/stripe/server.ts` - Server-side client
- `lib/stripe/client.ts` - Client-side client
- `lib/stripe/webhooks.ts` - Signature verification
- `app/api/[service]/[endpoint]/route.ts` - API routes (webhook, checkout)

**Key Patterns:**
- Customer IDs stored in `profile.stripe_customer_id` (NOT subscription table)
- Handle events: `checkout.session.completed`, `customer.subscription.*`, `invoice.*`
- Billing portal: `stripe.billingPortal.sessions.create()`
- Always include `plan_id` and `profile_id` in checkout metadata

### User Roles

- **Admin:** Full access (all dashboards, client mgmt, support, analytics)
- **Client:** Own dashboard, subscription mgmt, support, deployed site

### Environment & Security

**Environment Variables (`.env.local`):**
- Supabase URL and keys
- Stripe keys (test mode)
- Database URLs (pooler + direct)

**Never Commit:**
- `.env.local`
- Supabase credentials
- Stripe secret keys

**Security:**
- RLS on all tables
- Role-based access control
- Stripe webhook signature verification
- HTTPS enforcement

### Deployment

- **Platform:** Vercel
- **Client sites:** Manual (MVP), semi-automated (Phase 2)
- **Custom domains:** Via hosting platform

### Documentation

- Full overview: `PROJECT_OVERVIEW.md`
- UI patterns: `docs/stack-patterns/ui-patterns.md`
- TypeScript patterns: `docs/stack-patterns/typescript-patterns.md`
- shadcn docs: `docs/shadcn-components/`

### MCP Tools

- **Supabase:** DB operations, migrations, logs, advisors
- **shadcn:** Component docs, installation
- **GitHub:** Repository operations
- **Filesystem:** File operations
- **Context7:** Library documentation

---

## ✅ Implementation Status

**Completed:**
- ✅ Authentication (login, signup, password reset, OTP)
  - Role-based redirects (admin → /admin/dashboard, client → /client/dashboard)
  - OAuth callback with role detection
  - Plan preservation through signup flow
  - Smart OTP redirect (to checkout if plan selected)
- ✅ Next.js 16 proxy pattern (session refresh)
- ✅ Client portal (layout, dashboard, sidebar, subscription mgmt)
- ✅ Admin portal (layout, dashboard, sidebar, client mgmt)
- ✅ Marketing pages (home, pricing, about, contact)
- ✅ Support ticket system (full CRUD)
- ✅ Stripe integration (checkout, webhooks, billing portal)
- ✅ Database types generation
- ✅ Theme provider with dark mode
- ✅ Form validation patterns (Zod + React Hook Form)

**Architecture Compliance:**
- ✅ Next.js 16 patterns (proxy instead of middleware)
- ✅ Supabase SSR best practices (session refresh in proxy only)
- ✅ TypeScript strict mode (no `any` types)
- ✅ shadcn/ui patterns (design tokens only)

**Next Steps:**
- Site deployment tracking UI
- Email notifications (Resend/SendGrid)
- Profile management UI (full CRUD)
- Client site management interface
- Analytics dashboard

---

## 🐛 Troubleshooting & Common Issues

### Authentication Issues

**Problem:** Users getting logged out unexpectedly

**Solution:** Ensure `proxy.ts` exists and is calling `getUser()`:
```bash
# Check if proxy exists
ls -la proxy.ts

# Verify it's running in build
npm run build | grep -i proxy
```

**Problem:** Double redirects after login (login → client → admin)

**Solution:** Check that login/OAuth callback queries user role before redirecting. See `features/auth/api/mutations.ts:21-40` and `app/(auth)/callback/route.ts:13-29`.

**Problem:** Plan context lost after signup

**Solution:** Verify plan parameter is preserved:
1. Check `CheckoutButton` passes `?plan=<id>` to signup
2. Check `SignupForm` preserves plan in OTP redirect
3. Check `OTPVerificationForm` redirects to pricing with plan

**Problem:** Build warning about middleware deprecation

**Solution:** Ensure file is named `proxy.ts` (not `middleware.ts`) and function is `export default async function proxy()`.

### Type Errors

**Problem:** TypeScript errors about database types

**Solution:** Regenerate types:
```bash
# Via Supabase MCP
mcp__supabase__generate_typescript_types()

# Or manually
npx supabase gen types typescript --project-id <id> > lib/types/database.types.ts
```

**Problem:** `any` type errors in lint

**Solution:** Replace with proper types:
```typescript
// ❌ Wrong
const data: any = await fetch(...)

// ✅ Correct
const data: unknown = await fetch(...)
if (isValidData(data)) {
  // Use type guard
}
```

### Build Errors

**Problem:** Suspense boundary errors

**Solution:** Wrap components using `useSearchParams()` in `<Suspense>`:
```typescript
<Suspense fallback={<div>Loading...</div>}>
  <ComponentUsingSearchParams />
</Suspense>
```

**Problem:** Module not found errors

**Solution:** Check imports use `@/*` path alias and barrel exports from features.

---

## 🧪 Testing Authentication Flow

### Manual Test Checklist

**Login Flow:**
- [ ] Client login → `/client/dashboard`
- [ ] Admin login → `/admin/dashboard`
- [ ] Invalid credentials → Error message shown
- [ ] Authenticated user visiting `/login` → Redirected to dashboard

**Signup Flow:**
- [ ] Signup → Email sent with OTP
- [ ] OTP verification → Success
- [ ] After verification → Redirected to dashboard
- [ ] Signup from pricing → Plan preserved → Redirected to pricing

**OAuth Flow:**
- [ ] OAuth provider login → Callback processes
- [ ] Admin via OAuth → `/admin/dashboard`
- [ ] Client via OAuth → `/client/dashboard`

**Session Management:**
- [ ] Token expires → Auto-refresh (no logout)
- [ ] Valid session → No unnecessary refreshes
- [ ] Logout → Session cleared → Redirected to login

**Portal Access:**
- [ ] Unauthenticated → `/admin/dashboard` → Redirected to login
- [ ] Unauthenticated → `/client/dashboard` → Redirected to login
- [ ] Admin → `/client/*` → Redirected to admin dashboard
- [ ] Client → `/admin/*` → Redirected to client dashboard

### Testing Commands

```bash
# Build check (must pass with no errors)
npm run build

# Type check
npx tsc --noEmit

# Lint check
npm run lint

# Check for auth pattern violations
rg "getSession" --type ts --type tsx  # Should return 0 results
rg "middleware" --type ts  # Should only return lib/supabase/middleware.ts

# Verify proxy exists
ls -la proxy.ts
```

---

## 📝 Recent Fixes & Changes (October 2024)

### 1. Next.js 16 Migration
- ✅ Renamed `middleware.ts` → `proxy.ts`
- ✅ Updated function name to `proxy()`
- ✅ Added documentation about proxy vs middleware
- ✅ Zero build warnings

### 2. Authentication Role-Based Redirects
- ✅ Fixed OAuth callback to check user role before redirect
- ✅ Fixed login action to check user role before redirect
- ✅ Prevents double redirects (better UX)

### 3. Plan Preservation
- ✅ Pricing page passes plan ID to signup
- ✅ Signup form preserves plan through OTP flow
- ✅ OTP verification redirects to pricing with plan
- ✅ User can complete checkout after email verification

### 4. Suspense Boundaries
- ✅ Added Suspense wrapper to signup page
- ✅ Fixed Next.js 16 useSearchParams requirement
- ✅ Clean build with no warnings

### 5. Type Safety Improvements
- ✅ Removed `any` types from `lib/constants/stripe.ts`
- ✅ Proper type assertions with string arrays
- ✅ All TypeScript strict mode rules passing

---

**CRITICAL:** Read pattern docs before making changes. Zero violations before commit.
