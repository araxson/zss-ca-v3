# Type A Schema Mismatches (CRITICAL)

**Generated:** 2025-10-26
**Total Issues:** 1
**Status:** ✅ ALL ISSUES FIXED
**Last Updated:** 2025-10-26

---

## Overview

Type A mismatches are **CRITICAL runtime errors** where code references database elements (tables, columns, functions, views) that don't exist or have different names than expected.

These issues cause:
- ❌ Runtime errors when queries execute
- ❌ Null reference exceptions
- ❌ Type mismatches
- ❌ Failed database operations

**All Type A issues MUST be fixed before deployment.**

---

## Issue #1: ticket_reply Query References Wrong Column

**File:** `features/shared/support/api/queries.ts`
**Line:** 92
**Priority:** 🔴 **CRITICAL**
**Estimated Effort:** S (5 minutes)

### The Problem

Code attempts to join `ticket_reply` table with `profile` using column name `profile_id`:

```typescript
// features/shared/support/api/queries.ts:87-96
const { data: replies, error: repliesError } = await supabase
  .from('ticket_reply')
  .select(
    `
    *,
    profile:profile_id(id, contact_email, contact_name, role)
  `
  )
  .eq('ticket_id', ticketId)
  .order('created_at', { ascending: true })
```

### Database Reality

The `ticket_reply` table schema (from Supabase):

```typescript
{
  support_ticket_id: string  // ✅ Foreign key to support_ticket
  author_profile_id: string  // ✅ Foreign key to profile (THIS IS THE CORRECT COLUMN)
  message: string
  is_internal: boolean
  created_at: string
  updated_at: string
}
```

**There is NO `profile_id` column** - the correct column is `author_profile_id`.

### Impact

**Runtime Error:**
```
PostgrestError: column ticket_reply.profile_id does not exist
```

**Affected Features:**
- ❌ Viewing ticket details with replies (client portal)
- ❌ Viewing ticket details with replies (admin portal)
- ❌ Support ticket threading completely broken
- ❌ Unable to see who replied to tickets

**User Impact:** HIGH - Support system non-functional

### Required Fix

**Change column reference from `profile_id` to `author_profile_id`:**

```diff
// features/shared/support/api/queries.ts:87-96
const { data: replies, error: repliesError } = await supabase
  .from('ticket_reply')
  .select(
    `
    *,
-   profile:profile_id(id, contact_email, contact_name, role)
+   profile:author_profile_id(id, contact_email, contact_name, role)
  `
  )
  .eq('ticket_id', ticketId)
  .order('created_at', { ascending: true })
```

**Also update line 95** which references `ticket_id` - should be `support_ticket_id`:

```diff
- .eq('ticket_id', ticketId)
+ .eq('support_ticket_id', ticketId)
```

### Verification Steps

After fixing:

1. **Type Check:**
   ```bash
   npx tsc --noEmit
   ```
   Should pass with zero errors.

2. **Test Query:**
   - Navigate to any support ticket detail page
   - Verify replies load with author profiles
   - Check both client and admin portals

3. **Confirm Database Alignment:**
   - Verify column name matches `lib/types/database.types.ts`:
     ```typescript
     ticket_reply: {
       Row: {
         author_profile_id: string  // ✅ Correct
         support_ticket_id: string  // ✅ Correct
         // ...
       }
     }
     ```

### Related Code

**Other files that may need review:**
- ✅ `features/shared/support/api/mutations.ts:90-94` - **CORRECT** - Uses `author_profile_id`
  ```typescript
  const { error } = await supabase.from('ticket_reply').insert({
    support_ticket_id: data.ticketId,
    author_profile_id: user.id,  // ✅ Correct
    message: data.message,
  })
  ```

**No other mismatches found in mutations** - This is isolated to the queries file.

---

## Type A Summary

| Issue | File | Line | Priority | Effort | Status |
|-------|------|------|----------|--------|--------|
| Wrong column name in ticket_reply query | features/shared/support/api/queries.ts | 92, 95 | 🔴 CRITICAL | S | ✅ **FIXED** (2025-10-26) |

**Total Issues:** 1 (1 fixed, 0 remaining)
**Total Effort:** 5 minutes
**Required Before Deployment:** ✅ COMPLETE

---

## Pattern Compliance Check

After fixing this issue, verify the pattern is correct:

✅ **Correct Join Pattern:**
```typescript
// When joining with foreign key column name different from target table:
profile:author_profile_id(id, contact_email, contact_name, role)
// Format: alias:foreign_key_column(fields)
```

❌ **Incorrect Pattern:**
```typescript
// Don't guess column names - always verify in database.types.ts
profile:profile_id(...)  // Wrong if column is author_profile_id
```

---

**Next:** See [02-feature-gaps.md](./02-feature-gaps.md) for Type B issues (missing features).
