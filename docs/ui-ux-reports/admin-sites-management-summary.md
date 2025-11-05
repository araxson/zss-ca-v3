# Admin Sites Management - Quick Fix Summary

**Full Report:** `docs/ui-ux-reports/admin-sites-management-audit.md`

---

## Critical Issues - DO IMMEDIATELY

### 1. FORBIDDEN: React Hook Form Usage
**Files:**
- `features/admin/sites/[id]/components/edit-site-form.tsx`
- `features/admin/sites/[id]/components/deploy-site-form.tsx`

**Action:** Convert to native forms with useActionState + Server Actions
**Time:** 5-7 hours total

### 2. Missing Accessibility
**All forms lack:**
- Error summaries at top (WCAG 2.1 AA violation)
- `aria-busy` on forms during submission
- Screen reader announcements for status changes
- Focus management after errors

**Action:** Add accessibility features per `docs/rules/07-forms.md`
**Time:** 5 hours

### 3. Poor Loading States
**File:** `app/(admin)/admin/sites/loading.tsx`

**Action:** Create content-specific Skeleton components
**Time:** 2 hours

### 4. TypeScript Errors Suppressed
**File:** `features/admin/sites/[id]/components/edit-site-form.tsx`

**Issue:** 4 instances of `@ts-expect-error` suppressing type issues
**Action:** Will be resolved when fixing #1

**Total Critical Time: 12-14 hours**

---

## High Priority - Do Next Week

### 5. Replace Accordion with Tabs (Site Detail)
**File:** `features/admin/sites/[id]/site-detail-page-feature.tsx`
**Why:** Accordion has all sections open by default (defeats purpose)
**Time:** 1.5 hours

### 6. Add Search/Filter (Sites Table)
**File:** `features/admin/sites/sites-page-feature.tsx`
**Why:** No way to find sites with 50+ entries
**Component:** Command + ToggleGroup
**Time:** 4 hours

### 7. Replace Select with Combobox (Client Selection)
**File:** `features/admin/sites/new/components/create-site-client-fields-native.tsx`
**Why:** Native select not searchable with many clients
**Time:** 2 hours

### 8. Add HoverCard (Client Previews in Table)
**File:** `features/admin/sites/components/sites-table-row.tsx`
**Why:** Quick preview without navigating away
**Time:** 1.5 hours

### 9. Add Tooltip (Status Badge Explanations)
**File:** `features/admin/sites/components/sites-table-row.tsx`
**Why:** Status meanings unclear to new users
**Time:** 1 hour

### 10. Use Sheet for Edit/Deploy Forms
**File:** `features/admin/sites/[id]/site-detail-page-feature.tsx`
**Why:** Forms take up too much space, modern pattern
**Time:** 2 hours

**Total High Priority Time: 12 hours**

---

## Component Usage Analysis

### Currently Used (15 components)
Item, Button, Badge, Alert, Table, Pagination, ScrollArea, Empty, DropdownMenu, Input, Textarea, Select, AlertDialog, Accordion, Progress

### Should Add (10 components)
- **Tabs** (better than Accordion for site detail)
- **Sheet** (for edit forms)
- **HoverCard** (for client previews)
- **Tooltip** (for status explanations)
- **Command** (for quick search)
- **ToggleGroup** (for status filters)
- **Combobox** (for searchable selects)
- **DataTable** (more robust than custom table)
- **Skeleton** (proper loading states)
- **Card** (optional, for clarity)

---

## Files That Need Changes

### Phase 1: Critical (12-14 hours)
```
features/admin/sites/[id]/components/edit-site-form.tsx          [REWRITE]
features/admin/sites/[id]/components/deploy-site-form.tsx        [REWRITE]
features/admin/sites/[id]/components/edit-site-status-fields-native.tsx [CREATE]
features/admin/sites/[id]/components/edit-site-deployment-fields-native.tsx [CREATE]
features/admin/sites/new/components/create-site-form.tsx         [ADD ACCESSIBILITY]
app/(admin)/admin/sites/loading.tsx                              [REWRITE]
app/(admin)/admin/sites/[id]/loading.tsx                         [CREATE]
app/(admin)/admin/sites/new/loading.tsx                          [REWRITE]
```

### Phase 2: High Priority (12 hours)
```
features/admin/sites/[id]/site-detail-page-feature.tsx           [TABS]
features/admin/sites/sites-page-feature.tsx                      [SEARCH + FILTERS]
features/admin/sites/new/components/create-site-client-fields-native.tsx [COMBOBOX]
features/admin/sites/components/sites-table-row.tsx              [HOVERCARD + TOOLTIP]
```

---

## Quick Reference: shadcn/ui Components to Use

```tsx
// For site detail sections
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// For edit/deploy forms
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

// For client previews
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

// For status explanations
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// For site search
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command'

// For status filters
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

// For searchable client select
import { Combobox, ComboboxContent, ComboboxInput, ComboboxItem, ComboboxTrigger } from '@/components/ui/combobox'

// For proper loading states
import { Skeleton } from '@/components/ui/skeleton'
```

---

## Architecture Rules to Follow

From `docs/rules/07-forms.md`:

### DO
- Use native HTML forms with Server Actions
- Use `useActionState` for form state
- Use `isPending` for loading states
- Add error summaries with skip links
- Add `aria-live` announcements
- Manage focus after errors
- Progressive enhancement (works without JS)

### DON'T
- ❌ React Hook Form (STRICTLY FORBIDDEN)
- ❌ zodResolver from @hookform/resolvers/zod
- ❌ Client-side only validation
- ❌ Missing error summaries
- ❌ Missing accessibility attributes

---

## Next Steps

1. **Read full audit:** `docs/ui-ux-reports/admin-sites-management-audit.md`
2. **Start with Critical fixes** (Phase 1: 12-14 hours)
3. **Move to High Priority** (Phase 2: 12 hours)
4. **Test accessibility** with screen reader after each phase
5. **Verify checklist** at end of each phase

**Total Minimum Effort:** 24-26 hours (Phases 1-2)
**Total Complete:** 36-42 hours (All phases)

---

**Generated:** 2025-11-05
