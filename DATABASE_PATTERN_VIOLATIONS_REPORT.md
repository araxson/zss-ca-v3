# Database Pattern Violations Report

**Generated:** 2025-10-29
**Severity:** CRITICAL

## Executive Summary

Comprehensive audit reveals **SYSTEMATIC violations** of Pattern 6 database patterns throughout the entire codebase. All query and mutation functions violate the view/schema separation architecture.

---

## Critical Violations

### 1. Queries Reading from Base Tables (NOT Views)

**Violation:** ALL query functions read from base tables instead of views.

**Pattern 6 Requirement:**
- ✅ READ from views: `view_profiles`, `view_client_sites`, `view_support_tickets`, `view_subscriptions`, `view_notifications`
- ❌ NEVER read from base tables: `profile`, `client_site`, `support_ticket`, `subscription`, `notification`

**Files Fixed:**
- `/features/admin/clients/api/queries/clients.ts` - Changed `profile` → `view_profiles`
- `/features/admin/sites/api/queries/sites.ts` - Changed `client_site` → `view_client_sites`
- `/features/shared/support/api/queries/tickets.ts` - Changed `support_ticket` → `view_support_tickets`, `ticket_reply` → `view_ticket_replies`
- `/features/client/profile/api/queries/profile.ts` - Changed `profile` → `view_profiles`

**Files STILL NEED FIXING:**
- `/features/shared/subscription/api/queries/subscription.ts` - Using `subscription` instead of `view_subscriptions`
- `/features/shared/notifications/api/queries/notifications.ts` - Using `notification` instead of `view_notifications`
- `/features/admin/dashboard/api/queries/dashboard.ts` - Multiple base table accesses
- `/features/client/dashboard/api/queries/dashboard.ts` - Using base tables
- `/features/client/sites/api/queries/sites.ts` - Needs view access
- `/features/marketing/pricing/api/queries/plans.ts` - Check pattern compliance

---

### 2. Mutations NOT Using Schema Pattern

**Violation:** ALL mutations write directly to public tables instead of using `schema('organization').from('table_name')`.

**Pattern 6 Requirement:**
```ts
// ❌ WRONG
await supabase.from('profile').update(data)

// ✅ CORRECT
await supabase.schema('organization').from('profiles').update(data)
```

**Files Fixed:**
- `/features/admin/clients/api/mutations/update-client.ts` - Added schema pattern
- `/features/admin/sites/api/mutations/create.ts` - Added schema pattern
- `/features/admin/sites/api/mutations/update.ts` - Added schema pattern
- `/features/shared/support/api/mutations/tickets.ts` - Added schema pattern for all mutations
- `/features/client/profile/api/mutations/profile.ts` - Added schema pattern
- `/features/shared/subscription/api/mutations/subscription.ts` - Partial fix
- `/features/shared/notifications/api/mutations/create.ts` - Added schema pattern

**Files STILL NEED FIXING:**
- `/features/shared/notifications/api/mutations/bulk-create.ts`
- `/features/shared/notifications/api/mutations/mark-read.ts`
- `/features/shared/notifications/api/mutations/delete.ts`
- `/features/shared/audit-log/api/mutations/audit-logs.ts`
- `/features/admin/sites/api/mutations/deploy.ts`
- `/features/admin/sites/api/mutations/delete.ts`
- `/features/auth/**/api/mutations/*.ts` - All auth mutations

---

### 3. Inconsistent Auth Guards

**Violation:** Mix of auth helper patterns.

**Pattern 6 Requirement:**
```ts
// ✅ CORRECT - Use helper
const user = await requireAuth(supabase)
await requireAdminRole(supabase, user.id)

// ❌ WRONG - Inline auth check
const { data: { user } } = await supabase.auth.getUser()
if (!user) throw new Error('Unauthorized')
```

**Status:** Some files use helpers, many still use inline checks.

---

### 4. Missing Revalidation

**Pattern 6 Requirement:** ALL mutations MUST call `revalidatePath()` or `revalidateTag()`.

**Good Examples (Already Fixed):**
```ts
revalidatePath('/admin/clients', 'page')
revalidatePath(`/admin/clients/${data.profileId}`, 'page')
```

**Status:** Most mutations have revalidation, some may be missing secondary paths.

---

## Required Table/View Mapping

| Base Table (write only) | View (read only) | Schema |
|--------------------------|------------------|--------|
| `profile` | `view_profiles` | `organization` |
| `client_site` | `view_client_sites` | `organization` |
| `support_ticket` | `view_support_tickets` | `organization` |
| `ticket_reply` | `view_ticket_replies` | `organization` |
| `subscription` | `view_subscriptions` | `organization` |
| `notification` | `view_notifications` | `organization` |
| `plan` | `view_plans` | `organization` |
| `audit_log` | `view_audit_logs` | `organization` |

---

## Fix Pattern

### For Queries (Read Operations)

```ts
// ❌ BEFORE
const { data } = await supabase
  .from('profile')
  .select('*')
  .eq('id', userId)

// ✅ AFTER
const { data } = await supabase
  .from('view_profiles')
  .select('*')
  .eq('id', userId)
```

### For Mutations (Write Operations)

```ts
// ❌ BEFORE
const { error } = await supabase
  .from('profile')
  .update(data)
  .eq('id', userId)

// ✅ AFTER
const { error } = await supabase
  .schema('organization')
  .from('profiles')
  .update(data)
  .eq('id', userId)

// MUST add revalidation
revalidatePath('/relevant/path', 'page')
```

---

## Immediate Action Required

1. **Fix all remaining query files** to use views
2. **Fix all remaining mutation files** to use schema pattern
3. **Standardize auth guards** to use helper functions
4. **Verify revalidation** in all mutations
5. **Test database access** after changes

---

## Risk Assessment

**Current State:** CRITICAL
**Security Impact:** HIGH - Direct table access bypasses view-level RLS
**Data Integrity Impact:** HIGH - Inconsistent patterns across codebase
**Performance Impact:** MEDIUM - Suboptimal query patterns

---

## Next Steps

1. Run comprehensive grep to find all remaining violations
2. Fix systematically by feature area
3. Run typecheck to ensure no breaking changes
4. Update architecture.md with Pattern 6 database documentation
5. Add detection commands to catch future violations

---

**Report End**
