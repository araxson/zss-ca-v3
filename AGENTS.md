Quick reference. **For comprehensive patterns, read `docs/rules/`**

**Never edit:** `components/ui/*`, `app/globals.css`, `lib/types/database.types.ts`

---

## Essential Commands

```bash
# Development
npm dev              # Start dev server
npm build            # Production build
npm typecheck        # MUST pass before commits

# Database
npm db:types         # Generate types from Supabase

# Validation
npm lint:shadcn      # Check shadcn/ui compliance
```

---

## Critical Rules

### 1. NEVER Edit These Files
- ❌ `lib/types/database.types.ts` - Auto-generated
- ❌ `components/ui/*` - shadcn/ui primitives (import only)
- ❌ `app/globals.css` - Locked

### 2. NEVER Create Bulk Fix Scripts
Always make targeted, specific changes.

### 3. Pages Are Thin Shells (5-15 Lines)
```tsx
// ✅ CORRECT
import { Suspense } from 'react'
import { DashboardFeature } from '@/features/client/dashboard'

export default async function Page() {
  return (
    <Suspense fallback={null}>
      <DashboardFeature />
    </Suspense>
  )
}
```

### 4. Server Directives Required
```ts
import 'server-only'  // queries.ts
'use server'          // mutations.ts
'use client'          // client components
```

### 5. Always Use getUser() for Auth
```ts
const { data: { user } } = await supabase.auth.getUser()
if (!user) throw new Error('Unauthorized')
```

### Pattern 1: Portal Features (admin, client)

```
features/{portal}/[feature]/
├── api/
│   ├── queries/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   ├── [domain].ts                 # Query functions (< 300 lines)
│   │   └── helpers.ts                  # Query helpers (< 200 lines)
│   ├── mutations/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   ├── [action].ts                 # Mutation functions (< 300 lines)
│   │   └── helpers.ts                  # Mutation helpers (< 200 lines)
│   ├── types.ts                        # API types (< 200 lines)
│   ├── schema.ts                       # Zod schemas (< 250 lines)
│   └── constants.ts                    # Constants (< 100 lines)
├── components/
│   ├── index.ts                         # Re-exports ALL components (< 50 lines)
│   ├── [feature]-[component].tsx       # Components (< 200 lines)
│   └── [component-name].tsx            # Components (< 200 lines)
├── hooks/
│   └── use-[hook-name].ts              # Hooks (< 150 lines)
├── utils/
│   └── [utility-name].ts               # Utils (< 150 lines)
└── index.tsx                           # Feature export (< 50 lines)
```

**File Limits:**
- Index files: < 50 lines
- Components: < 200 lines
- Query/Mutation files: < 300 lines
- Helpers: < 200 lines
- Hooks/Utils: < 150 lines
- Types: < 200 lines
- Schemas: < 250 lines
- Constants: < 100 lines

---

### Pattern 2: Marketing Features

```
features/marketing/[page-name]/
├── sections/
│   └── [section-name]/
│       ├── [section-name].tsx         # Section component (< 150 lines)
│       ├── [section-name].data.ts     # Section data/content (< 200 lines)
│       ├── [section-name].types.ts    # Section types (optional, < 100 lines)
│       └── index.ts                   # Export component + data (< 20 lines)
├── [page-name]-page.tsx               # Main page component (< 100 lines)
├── [page-name].seo.ts                 # SEO metadata (< 50 lines)
├── [page-name].types.ts               # Feature-wide types (optional, < 150 lines)
└── index.ts                           # Export page + sections (< 30 lines)
```

**File Limits:**
- Page files: < 100 lines
- Section components: < 150 lines
- Data files: < 200 lines
- SEO files: < 50 lines
- Index files: < 30 lines

---

### Pattern 3: Auth Features

```
features/shared/auth/
├── api/
│   ├── queries/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   └── [query].ts                  # Query functions (< 300 lines)
│   ├── mutations/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   └── [action].ts                 # Mutation functions (< 300 lines)
│   └── schema.ts                       # Auth schemas (< 250 lines)
├── components/
│   ├── login-form.tsx                  # Form component (< 200 lines)
│   ├── signup-form.tsx                 # Form component (< 200 lines)
│   └── [auth-component].tsx            # Auth component (< 200 lines)
├── hooks/
│   └── use-[auth-hook].ts              # Auth hooks (< 150 lines)
└── index.tsx                           # Feature export (< 50 lines)
```

**File Limits:**
- Index files: < 50 lines
- Components: < 200 lines
- Query/Mutation files: < 300 lines
- Schema files: < 250 lines
- Hooks: < 150 lines

---

### Pattern 4: Shared Features

```
features/shared/[feature]/
├── api/
│   ├── queries/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   └── [query].ts                  # Query functions (< 300 lines)
│   ├── mutations/
│   │   ├── index.ts                    # Re-exports (< 50 lines)
│   │   └── [action].ts                 # Mutation functions (< 300 lines)
│   └── types.ts                        # Shared types (< 200 lines)
├── components/
│   └── [component].tsx                 # Shared component (< 200 lines)
├── hooks/
│   └── use-[hook].ts                   # Shared hooks (< 150 lines)
└── index.tsx                           # Feature export (< 50 lines)
```

**File Limits:**
- Index files: < 50 lines
- Components: < 200 lines
- Query/Mutation files: < 300 lines
- Types: < 200 lines
- Hooks: < 150 lines

---

## Database Pattern

### Read from Views
```ts
import 'server-only'
import { createClient } from '@/lib/supabase/server'

export async function getData(userId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  return supabase.from('view_name').select('*')  // ✅ View
}
```

### Write to Schema Tables
```ts
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function create(data: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await supabase.schema('organization').from('salons').insert(data)
  revalidatePath('/salons')
}
```
---

## Next.js 16 Patterns

### Async Params
```tsx
export default async function Page({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ query?: string }>
}) {
  const { id } = await params
  const { query } = await searchParams
  return <Feature id={id} query={query} />
}
```

### Async Request APIs
```ts
const cookieStore = await cookies()
const headersList = await headers()
```

---

## UI Patterns (shadcn/ui)

**Pattern:** shadcn/ui composite components MUST include all required subcomponents for proper semantics.

**Why:** Subcomponents wire ARIA attributes; omitting them breaks accessibility and theming.


**Fix Pattern:**
```tsx
// ❌ WRONG - Missing required subcomponents
<Dialog>
  <DialogContent>
    <p className="text-sm text-muted-foreground">Are you sure?</p>
  </DialogContent>
</Dialog>

// ✅ CORRECT - Complete composition
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>

---

## Pre-Commit Checklist

1. ✅ `npm typecheck` - Must pass
2. ✅ Auth guards with `getUser()`
3. ✅ Server directives present
4. ✅ Pages < 15 lines
5. ✅ No `any` types
6. ✅ Revalidate paths after mutations

---

## Comprehensive Documentation

Read `docs/rules/` for detailed patterns:

| File | Topic |
|------|-------|
| `architecture.md` | Naming, structure, file limits |
| `architecture.md` | architecture patterns |
| `architecture.md` | File splitting strategies |
| `nextjs.md` | Next.js 16 patterns |
| `react.md` | React hooks, Server Components |
| `typescript.md` | Type safety, strict mode |
| `supabase.md` | Auth, database, RLS |
| `ui.md` | shadcn/ui patterns |
| `forms.md` | React Hook Form + Zod |
| `stripe.md` | Stripe rules |

---

## Available Agents

Specialized agents in `.claude/agents/`:
- `performance-fixer` - Performance bottlenecks
- `security-fixer` - Security audit
- `type-safety-fixer` - Type issues
- `ui-pattern-enforcer` - shadcn/ui compliance
- `architecture-fixer` - Architecture violations
- `form-validation-fixer` - Form patterns
- `accessibility-fixer` - A11y issues
- `dead-code-fixer` - Unused code
- `import-dependency-fixer` - Import cleanup

---

## Tech Stack

- Next.js 16.0.0 + Turbopack
- React 19.2.0
- TypeScript 5.x (strict mode)
- Supabase 2.47.15
- npm
