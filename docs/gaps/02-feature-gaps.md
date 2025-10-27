# Type B Feature Gaps (Missing CRUD Operations)

**Generated:** 2025-10-26
**Total Gaps:** 3
**Status:** 🟡 NON-BLOCKING (Future Enhancements)

---

## Overview

Type B gaps are **missing CRUD operations** where the database supports functionality but the application doesn't implement it.

These don't break existing features, but represent:
- ⚠️ Missing admin capabilities
- ⚠️ Incomplete feature sets
- ⚠️ Manual workarounds required

**Type B issues should be prioritized based on business value.**

---

## Gap #1: Notification Management (Admin CREATE/DELETE)

**Database Table:** `notification`
**Priority:** 🟡 **HIGH**
**Estimated Effort:** M (2-3 hours)
**Status:** ✅ **IMPLEMENTED** (2025-10-26)

### Current Implementation Status

**✅ Implemented:**
- LIST notifications for user (`getUnreadNotifications`, `getAllNotifications`)
- SHOW notification count (`getUnreadNotificationCount`)
- UPDATE notification (mark as read) (`markNotificationReadAction`)
- CREATE custom notifications (admin-only) ✅ **NEW**
- DELETE notifications (admin cleanup) ✅ **NEW**

### Database Support

The `notification` table fully supports admin-created custom notifications:

```typescript
type Notification = {
  id: string
  profile_id: string  // ✅ Can target any user
  notification_type: 'subscription' | 'billing' | 'support' | 'site_status' | 'system' | 'onboarding'
  title: string  // ✅ Custom title
  body: string | null  // ✅ Custom body
  action_url: string | null  // ✅ Custom link
  metadata: Json  // ✅ Flexible metadata
  read_at: string | null
  expires_at: string | null  // ✅ Auto-expiry support
  created_at: string
  updated_at: string
}
```

### Business Impact

**Why This Matters:**
- Admins need to send announcements (e.g., "New feature released")
- Admins need to alert clients about maintenance
- Admins need to send custom onboarding reminders
- Admins need to clean up old/expired notifications

**Current Workaround:** Manual database edits (unscalable)

### Recommended Implementation

**1. Create Admin Notification Form**

Location: `features/admin/notifications/components/create-notification-form.tsx`

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createNotificationSchema } from '../schema'
import { createNotificationAction } from '../api/mutations'

export function CreateNotificationForm() {
  const form = useForm({
    resolver: zodResolver(createNotificationSchema),
  })

  async function onSubmit(data) {
    const result = await createNotificationAction(data)
    if (result.success) {
      form.reset()
    }
  }

  return (
    <Form {...form}>
      {/* Form fields for notification_type, title, body, action_url, etc. */}
    </Form>
  )
}
```

**2. Create Server Action**

Location: `features/admin/notifications/api/mutations.ts` (create if doesn't exist)

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { CreateNotificationInput } from '../schema'

export async function createNotificationAction(data: CreateNotificationInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profile')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Only admins can create notifications' }
  }

  const { error } = await supabase.from('notification').insert({
    profile_id: data.profile_id,
    notification_type: data.notification_type,
    title: data.title,
    body: data.body,
    action_url: data.action_url,
    expires_at: data.expires_at,
    metadata: data.metadata || {},
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/notifications', 'page')
  revalidatePath('/client/dashboard', 'page')

  return { success: true }
}

export async function deleteNotificationAction(notificationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profile')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Only admins can delete notifications' }
  }

  const { error } = await supabase
    .from('notification')
    .delete()
    .eq('id', notificationId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/notifications', 'page')

  return { success: true }
}
```

**3. Create Zod Schema**

Location: `features/admin/notifications/schema.ts` (create if doesn't exist)

```typescript
import { z } from 'zod'

export const createNotificationSchema = z.object({
  profile_id: z.string().uuid('Invalid user ID'),
  notification_type: z.enum([
    'subscription',
    'billing',
    'support',
    'site_status',
    'system',
    'onboarding',
  ]),
  title: z.string().min(1, 'Title required').max(200),
  body: z.string().max(2000).nullable(),
  action_url: z.string().url().nullable(),
  expires_at: z.string().datetime().nullable(),
  metadata: z.record(z.unknown()).optional(),
})

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>
```

**4. Create Admin Page**

Location: `app/(portals)/admin/notifications/new/page.tsx`

```typescript
import { CreateNotificationForm } from '@/features/admin/notifications/components/create-notification-form'

export default function NewNotificationPage() {
  return (
    <div>
      <h1>Create Notification</h1>
      <CreateNotificationForm />
    </div>
  )
}
```

### Checklist for Implementation

- [x] Create notification schemas in `features/shared/notifications/schema.ts` ✅
- [x] Create mutations in `features/shared/notifications/api/mutations.ts` ✅
- [x] Create `features/shared/notifications/components/create-notification-form.tsx` ✅
- [x] Create `app/(portals)/admin/notifications/new/page.tsx` ✅
- [ ] Add "Create Notification" link to admin sidebar (optional enhancement)
- [ ] Add bulk notification creation (optional: send to all clients)
- [ ] Add notification deletion UI on admin notifications page (optional enhancement)
- [x] Test with various notification types ✅
- [x] Run `npx tsc --noEmit` to verify ✅

**Implementation Notes:**
- Created schemas for createNotification and deleteNotification
- Added server actions with admin role verification
- Form component uses shadcn/ui components (Card, Form, Select, Input, Textarea, Button)
- Page fetches all clients for recipient selection
- TypeScript validation passes with no errors

---

## Gap #2: Site Analytics Management (Admin CREATE/UPDATE/DELETE)

**Database Table:** `site_analytics`
**Priority:** 🟡 **MEDIUM**
**Estimated Effort:** M (2-3 hours)
**Status:** ✅ **IMPLEMENTED** (2025-10-26)

### Current Implementation Status

**✅ Implemented:**
- LIST analytics for site (`getSiteAnalytics`)
- SHOW analytics summary (`getAnalyticsSummary`, `getAllSitesAnalyticsSummary`)
- LIST all analytics (admin) (`getAllAnalytics`) ✅ **NEW**
- CREATE analytics manually (for backfills or corrections) ✅ **NEW**
- UPDATE analytics (fix incorrect data) ✅ **NEW**
- DELETE analytics (remove test data) ✅ **NEW**

### Database Support

```typescript
type SiteAnalytics = {
  id: number
  client_site_id: string
  metric_date: string
  page_views: number
  unique_visitors: number
  conversions: number
  metadata: Json  // Flexible metadata for breakdowns
  created_at: string
  updated_at: string
}
```

### Business Impact

**Why This Matters:**
- Admins need to backfill historical analytics when integrating new sites
- Admins need to correct analytics errors (e.g., bot traffic removal)
- Admins need to delete test data before going live

**Current Workaround:** Direct database edits (risky)

### Recommended Implementation

**Quick Win:** Add admin-only mutations for analytics management

Location: `features/admin/analytics/api/mutations.ts` (create if doesn't exist)

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createAnalyticsAction(data: {
  client_site_id: string
  metric_date: string
  page_views: number
  unique_visitors: number
  conversions: number
  metadata?: Record<string, unknown>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profile')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Only admins can create analytics' }
  }

  const { error } = await supabase.from('site_analytics').insert({
    client_site_id: data.client_site_id,
    metric_date: data.metric_date,
    page_views: data.page_views,
    unique_visitors: data.unique_visitors,
    conversions: data.conversions,
    metadata: data.metadata || {},
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/sites', 'page')
  revalidatePath(`/admin/sites/${data.client_site_id}`, 'page')

  return { success: true }
}

// Similar functions for updateAnalyticsAction and deleteAnalyticsAction
```

### Checklist for Implementation

- [x] Create `features/admin/analytics/api/mutations.ts` ✅
- [x] Create `features/admin/analytics/schema.ts` ✅
- [x] Create `features/admin/analytics/components/analytics-form.tsx` ✅
- [x] Add getAllAnalytics query for admin view ✅
- [ ] Add bulk import CSV functionality (optional enhancement)
- [ ] Add analytics editing UI (optional enhancement)
- [ ] Add delete confirmation dialog (optional enhancement)
- [x] Run `npx tsc --noEmit` to verify ✅

**Implementation Notes:**
- Created schemas for create/update/delete analytics
- Added server actions with admin role verification
- Form component for creating analytics entries
- All TypeScript validation passes

---

## Gap #3: Audit Log Manual Creation (Admin Tool)

**Database Table:** `audit_log`
**Priority:** 🟢 **MEDIUM**
**Estimated Effort:** S (1 hour)
**Status:** ✅ **IMPLEMENTED** (2025-10-26)

### Current Implementation Status

**✅ Implemented:**
- LIST audit logs (`getAuditLogs`, `getAuditLogsByResource`, `getAuditLogsByUser`)
- SHOW audit log details (via list queries)
- CREATE manual audit log entries (for offline changes) ✅ **NEW**

**❌ Not Applicable:**
- UPDATE audit logs (immutable by design)
- DELETE audit logs (retention policy only)

### Database Support

```typescript
type AuditLog = {
  id: number
  actor_profile_id: string | null
  profile_id: string | null
  action: string
  resource_table: string
  resource_id: string | null
  change_summary: Json  // Before/after state
  ip_address: unknown
  user_agent: string | null
  created_at: string
}
```

### Business Impact

**Why This Matters:**
- Admins need to log manual database changes
- Admins need to document external system integrations
- Admins need to create audit trail for compliance

**Current Workaround:** No audit trail for manual changes (compliance risk)

### Recommended Implementation

**Quick Win:** Admin-only manual audit creation

Location: `features/shared/audit-log/api/mutations.ts`

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'

export async function createAuditLogAction(data: {
  profile_id?: string
  action: string
  resource_table: string
  resource_id?: string
  change_summary: Record<string, unknown>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profile')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Only admins can create audit logs' }
  }

  const { error } = await supabase.from('audit_log').insert({
    actor_profile_id: user.id,
    profile_id: data.profile_id || null,
    action: data.action,
    resource_table: data.resource_table,
    resource_id: data.resource_id || null,
    change_summary: data.change_summary,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
```

### Checklist for Implementation

- [x] Create `features/shared/audit-log/schema.ts` ✅
- [x] Create `features/shared/audit-log/api/mutations.ts` ✅
- [x] Create `features/shared/audit-log/components/create-audit-log-form.tsx` ✅
- [ ] Add to admin audit logs page (optional - form is ready to use)
- [x] Test audit log creation ✅
- [x] Run `npx tsc --noEmit` to verify ✅

**Implementation Notes:**
- Created schema for manual audit log creation
- Added server action with admin role verification
- Form component with JSON change summary input
- Supports all common resource tables
- TypeScript validation passes

---

## Type B Summary

| Gap | Table | Missing Operations | Priority | Effort | Business Impact | Status |
|-----|-------|-------------------|----------|--------|-----------------|--------|
| Notification Management | notification | CREATE, DELETE | 🟡 HIGH | M | Admin announcements blocked | ✅ **DONE** |
| Analytics Management | site_analytics | CREATE, UPDATE, DELETE | 🟡 MEDIUM | M | Cannot correct analytics | ✅ **DONE** |
| Audit Log Creation | audit_log | CREATE (manual) | 🟢 MEDIUM | S | Compliance gap | ✅ **DONE** |

**Total Gaps:** 3 (✅ ALL IMPLEMENTED)
**Total Effort:** 6-7 hours (✅ ALL COMPLETED)
**Required Before Deployment:** NO (enhancements - now all available)

---

## Implementation Order

Recommended order based on business value:

1. **Notification Management** (HIGH) - Enables critical admin communication
2. **Analytics Management** (MEDIUM) - Improves data quality
3. **Audit Log Creation** (MEDIUM) - Compliance enhancement

---

**Next:** See [99-priority-matrix.md](./99-priority-matrix.md) for combined fix priority.
