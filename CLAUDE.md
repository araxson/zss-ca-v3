# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
**Never edit:** `components/ui/*`, `app/globals.css`, `lib/types/database.types.ts`
> **CRITICAL:** Read `docs/ruls/*.md` before making ANY changes.

---

## ⚡ Quick Reference

**What:** SaaS platform for Canadian web agency. Clients subscribe; agency builds/deploys Next.js sites.

**Stack:** Next.js 16 • React 19 • Supabase • Stripe • TypeScript 5 (strict) • shadcn/ui (53 components) • Tailwind 4

**Commands:**
```bash
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build + type check (MUST PASS)
npm run lint         # ESLint
npx tsc --noEmit     # Type check only
```

---

## 🔴 Critical Rules (Non-Negotiable)

### Architecture
- **Pages = thin shells** (5-12 lines) → All logic in `features/`
- **Barrel exports required** → Import from `features/[name]` NOT deep paths
- **Server Components default** → Client Components only for interactivity
- **Auth: `getUser()` ONLY** → Never use `getSession()`
- **Auth checks in Server Components** → NEVER in `proxy.ts`

### TypeScript
- **NO `any` types** → Use `unknown` with type guards
- **NO suppressions** → No `@ts-ignore` or `@ts-expect-error`
- **Strict mode required** → `npm run build` must pass
- **Generated DB types** → From `lib/types/database.types.ts`
- **Infer from Zod** → `z.infer<typeof schema>` for forms

### UI (shadcn/ui)
- **Use ONLY shadcn components** → 53 available (check MCP)
- **NEVER edit** `components/ui/*` or `app/globals.css`
- **Design tokens ONLY** → NO arbitrary colors (`bg-blue-500`)
- **Complete compositions** → Use all slots (CardHeader → CardTitle, etc.)
- **Plain text in slots** → NO custom classes on CardTitle/AlertDescription

### Database
- **Multi-tenancy required** → All queries filter by `user.id`
- **Verify field names** → Profile uses `contact_email` NOT `email`
- **RLS enforced** → All tables have Row Level Security
- **Server actions return** → `{ success: true }` or `{ error: string }`

---

## 📁 Project Structure

```
app/
├── (marketing)/        # Public (/, /pricing, /about)
├── (admin)/           # Admin portal (/admin/*)
├── (client)/          # Client portal (/client/*)
├── (auth)/            # Auth flows (/login, /signup, etc.)
└── api/               # API routes (Stripe webhooks, etc.)

features/              # Business logic (barrel exports)
├── marketing/         # Home, pricing, about pages
├── admin/            # Admin features
├── client/           # Client features
├── auth/             # Login, signup, password reset
└── shared/           # Subscription, support, analytics

lib/
├── supabase/         # DB client (server.ts, client.ts)
├── stripe/           # Payment integration
├── types/            # database.types.ts (generated)
├── config/           # Site, nav, SEO config
└── constants/        # routes.ts (type-safe)

components/
├── ui/               # shadcn/ui (DO NOT EDIT - 53 components)
├── layout/           # Header, footer
└── providers/        # Theme provider

proxy.ts              # Session refresh ONLY (Next.js 16)
```

### Marketing Feature Pattern

```
features/
  marketing/page-name
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

---

## ⚠️ Common Gotchas

### 1. Database Field Names
```typescript
// ❌ WRONG
profile.email, profile.full_name, profile.phone

// ✅ CORRECT
profile.contact_email, profile.contact_name, profile.contact_phone
```

### 2. Stripe Customer ID
```typescript
// ❌ WRONG - Not in subscription table
subscription.stripe_customer_id

// ✅ CORRECT - In profile table
profile.stripe_customer_id
```

### 3. Authentication
```typescript
// ❌ WRONG
const { data: { session } } = await supabase.auth.getSession()

// ✅ CORRECT
const { data: { user } } = await supabase.auth.getUser()
```

### 4. Multi-Tenancy
```typescript
// ❌ WRONG - Security issue!
const { data } = await supabase.from('subscription').select('*')

// ✅ CORRECT
const { data } = await supabase
  .from('subscription')
  .select('*')
  .eq('profile_id', user.id)
```

### 5. Component Slots
```tsx
// ❌ WRONG
<CardTitle className="text-3xl font-bold">Title</CardTitle>

// ✅ CORRECT
<CardTitle>Title</CardTitle>
```

### 6. Barrel Exports
```typescript
// ❌ WRONG
import { getData } from '@/features/client/support/api/queries'

// ✅ CORRECT
import { getData } from '@/features/client/support'
```

---

## 🎯 Essential Patterns

### Feature Module Structure
```
features/[name]/
├── api/
│   ├── queries.ts      # 'server-only' - data fetching
│   └── mutations.ts    # 'use server' - actions
├── components/         # 'use client' if needed
├── schema.ts           # Zod validation
└── index.ts            # ⭐ Barrel export (public API)
```

### Server Component (Default)
```typescript
export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(ROUTES.LOGIN)

  const { data } = await supabase
    .from('table')
    .select('*')
    .eq('profile_id', user.id)  // Multi-tenancy

  return <View data={data} />
}
```

### Server Action
```typescript
'use server'

export async function createAction(input: Input) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('table')
    .insert({ ...input, profile_id: user.id })

  if (error) return { error: error.message }

  revalidatePath('/path', 'page')
  return { success: true }
}
```

### Form Pattern
```typescript
'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

// 1. Schema
const schema = z.object({ name: z.string().min(1) })
type FormData = z.infer<typeof schema>

// 2. Component
export function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(async (data) => {
        const result = await serverAction(data)
        if (result.error) form.setError('root', { message: result.error })
      })}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

---

## 🔧 Development Workflows

### Add New Feature
1. Create `features/[portal]/[feature]/` structure
2. Define Zod schema in `schema.ts`
3. Create server action in `api/mutations.ts`
4. Build form component in `components/`
5. Export via `index.ts` barrel
6. Import in page from single path

### Database Migration
1. Create `supabase/migrations/[timestamp]_[name].sql`
2. Apply via Supabase dashboard or MCP
3. Regenerate types: `mcp__supabase__generate_typescript_types()`

### Install shadcn Component
```bash
npx shadcn@latest add [component-name]
# Or: mcp__shadcn__install_component({ component: 'name' })
```

---

## 🚨 Pre-Commit Checklist

**Run these commands (MUST return 0 results):**
```bash
# 1. Arbitrary colors
rg "(bg|text|border)-(blue|red|green|gray|slate)-[0-9]+" --type tsx features/

# 2. Custom sizing on slots
rg "(CardTitle|AlertDescription).*className.*(text-[0-9]|font-)" --type tsx features/

# 3. Any types
rg "\bany\b" --type ts --type tsx | grep -v "node_modules"

# 4. Type suppressions
rg "@ts-ignore|@ts-expect-error" --type ts --type tsx

# 5. Build must pass
npm run build
```

---

## 📚 Key Files to Know

**Database Schema:**
- 9 tables: `profile`, `plan`, `subscription`, `client_site`, `support_ticket`, `ticket_reply`, `notification`, `audit_log`, `site_analytics`
- All have RLS policies
- Critical fields: `profile.contact_email`, `profile.stripe_customer_id`, `ticket_reply.author_profile_id`

**Auth Flow:**
- `proxy.ts` → Session refresh ONLY (runs on every request)
- `app/(client)/client/layout.tsx` → Auth checks + role verification
- `app/(admin)/admin/layout.tsx` → Auth checks + role verification
- `features/auth/api/mutations.ts` → Login/signup actions with role detection

**Stripe:**
- `lib/stripe/server.ts` → Server-side client
- `app/api/stripe/webhook/route.ts` → Handle events
- Customer IDs stored in `profile.stripe_customer_id`

**Documentation:**
- `docs/rules/ui-patterns.md` → shadcn/ui rules (CRITICAL)
- `docs/rules/typescript-patterns.md` → TypeScript rules
- `docs/shadcn-components/` → Component docs

---

## 🐛 Quick Troubleshooting

**Build fails:**
- Run `npx tsc --noEmit` to see type errors
- Check for `any` types or missing imports
- Verify all field names in queries

**Auth issues:**
- Ensure `proxy.ts` exists at root
- Check using `getUser()` not `getSession()`
- Verify role checks in layouts, not proxy

**Type errors:**
- Regenerate: `mcp__supabase__generate_typescript_types()`
- Use `z.infer<typeof schema>` for form types

**UI violations:**
- Run detection commands above
- Check `docs/rules/ui-patterns.md`
- Use MCP: `mcp__shadcn__get_component_docs({ component: 'name' })`

---

## 🎯 MCP Tools Available

- **Supabase:** `list_tables`, `execute_sql`, `apply_migration`, `generate_typescript_types`, `get_advisors`
- **shadcn:** `list_components`, `get_component_docs`, `install_component`
- **GitHub:** Repository operations
- **Stripe:** Search docs, create resources
- **Context7:** Library documentation

---

**Last Updated:** 2025-10-26
**Next.js Version:** 16.0
**TypeScript:** 5.9 (strict mode)
**shadcn/ui:** 53 components installed
