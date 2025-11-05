# Client Portal UI/UX Quick Reference

**Quick access guide for developers implementing fixes**

---

## Top Priority Fixes (Critical)

### 1. Remove Dashboard Tabs Navigation
**Problem:** Double navigation (Sidebar + Tabs) confuses users
**File:** `features/client/dashboard/components/dashboard-overview.tsx`
**Time:** 2-3 hours
**Impact:** HIGH - Navigation consistency

```tsx
// REMOVE: Tabs component wrapper
<Tabs defaultValue="sites">...</Tabs>

// REPLACE WITH: Direct content
<div className="space-y-6">
  <DashboardSummaryCards {...props} />
  <Separator />
  <div className="grid gap-6 md:grid-cols-2">
    <RecentSitesCard sites={sites.slice(0, 3)} />
    <RecentTicketsCard tickets={tickets.slice(0, 5)} />
  </div>
</div>
```

**New Files to Create:**
- `features/client/dashboard/components/recent-sites-card.tsx`
- `features/client/dashboard/components/recent-tickets-card.tsx`

**Files to Delete:**
- `dashboard-sites-tab.tsx`
- `dashboard-tickets-tab.tsx`
- `dashboard-account-tab.tsx`

---

## High Priority Fixes (Important)

### 2. Add Separator Components
**Problem:** Missing visual hierarchy between sections
**Time:** 30 minutes
**Impact:** MEDIUM - Visual clarity

**Add to:**
- `dashboard-overview.tsx` (after summary cards)
- `subscription-card.tsx` (before "Plan Features" section)
- `profile-feature.tsx` (after header)

```tsx
import { Separator } from '@/components/ui/separator'

<DashboardSummaryCards {...props} />
<Separator />  {/* ADD THIS */}
<div className="grid gap-6 md:grid-cols-2">...</div>
```

---

### 3. Fix Nested Item in Subscription Card
**Problem:** Item nested inside Item causes visual clutter
**File:** `features/client/subscription/components/subscription-card.tsx:42-52`
**Time:** 20 minutes
**Impact:** MEDIUM - Visual polish

```tsx
// REPLACE nested Item with simple div:
<div className="flex items-start justify-between">
  <div className="space-y-1">
    <h3 className="text-lg font-semibold">{plan.name} Plan</h3>
    <p className="text-sm text-muted-foreground">{plan.description}</p>
  </div>
  <Badge variant={isActive ? 'default' : ...}>{subscription.status}</Badge>
</div>
```

---

### 4. Add Badge for Site Status
**Problem:** Text-only status display lacks visual prominence
**File:** `features/client/sites/components/site-card.tsx`
**Time:** 20 minutes
**Impact:** MEDIUM - Visual UX

```tsx
const getStatusVariant = (status: string): ComponentProps<typeof Badge>['variant'] => {
  const variants = {
    live: 'default',
    in_production: 'secondary',
    pending: 'outline',
    archived: 'destructive',
  } as const
  return variants[status as keyof typeof variants] || 'outline'
}

// In render:
<Badge variant={getStatusVariant(site.status)}>
  {getSiteStatusLabel(site.status)}
</Badge>
```

---

### 5. Implement Select for Ticket Status
**Problem:** Custom button implementation instead of semantic Select
**File:** `features/client/support/components/update-status-button.tsx`
**Time:** 30 minutes
**Impact:** MEDIUM - Accessibility + UX

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

<Select
  value={currentStatus}
  onValueChange={handleValueChange}
  disabled={isPending}
>
  <SelectTrigger>
    <SelectValue placeholder="Select status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="open">Open</SelectItem>
    <SelectItem value="in_progress">In Progress</SelectItem>
    <SelectItem value="resolved">Resolved</SelectItem>
  </SelectContent>
</Select>
```

---

### 6. Add Breadcrumb Navigation
**Problem:** Missing context in deep navigation
**Files:** Site detail, Ticket detail pages
**Time:** 1 hour
**Impact:** MEDIUM - Navigation UX

```tsx
import { BreadcrumbNav } from '@/components/layout/shared/breadcrumb-nav'

const breadcrumbs = [
  { label: 'Overview', href: '/client/dashboard' },
  { label: 'Sites', href: '/client/sites' },
  { label: site.site_name }, // Current page - no href
]

<BreadcrumbNav items={breadcrumbs} />
```

---

### 7. Enhance Loading States
**Problem:** Generic loading states don't match content
**Files:** All `loading.tsx` files in `app/(client)/client/`
**Time:** 30 minutes
**Impact:** LOW - Perceived performance

```tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[200px] rounded-lg" />
        ))}
      </div>
      {/* Recent activity */}
      <Separator />
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-[300px] rounded-lg" />
        ))}
      </div>
    </div>
  )
}
```

---

## Component Usage Reference

### ✅ Components Used Well (Keep These Patterns)

**Empty Component** (Exemplary)
```tsx
<Empty className="border border-dashed">
  <EmptyHeader>
    <EmptyMedia variant="icon"><Icon /></EmptyMedia>
    <EmptyTitle>Title</EmptyTitle>
    <EmptyDescription>Description</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button asChild><Link href="/path">CTA</Link></Button>
  </EmptyContent>
</Empty>
```

**Item Component** (Good)
```tsx
<Item variant="outline" role="listitem">
  <ItemMedia variant="icon"><Icon /></ItemMedia>
  <ItemHeader>
    <ItemTitle>Title</ItemTitle>
    <ItemDescription>Description</ItemDescription>
  </ItemHeader>
  <ItemContent>Content</ItemContent>
  <ItemFooter>Actions</ItemFooter>
</Item>
```

**Form Accessibility** (Reference Quality)
```tsx
<form action={formAction}>
  {/* Screen reader announcements */}
  <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
    {isPending && 'Form is submitting, please wait'}
  </div>

  <FieldComponent errors={state?.fieldErrors} isPending={isPending} />

  <SubmitButton /> {/* Uses useFormStatus */}
</form>
```

---

### 🆕 Components to Add

**Command** (for search)
```tsx
<Command className="rounded-lg border">
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup>
      <CommandItem>Item 1</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

**Select** (for dropdowns)
```tsx
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

**Breadcrumb** (for navigation)
```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/path">Parent</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

## Accessibility Checklist

### ✅ Already Implemented
- [x] Screen reader announcements (`role="status"`, `aria-live="polite"`)
- [x] Semantic HTML (proper headings, lists, forms)
- [x] Form error messages linked via `aria-describedby`
- [x] Decorative icons have `aria-hidden="true"`
- [x] Loading states announced to screen readers
- [x] Disabled states during form submission
- [x] All interactive elements have accessible names

### ⚠️ Needs Verification
- [ ] Keyboard navigation works for all interactions
- [ ] Focus indicators visible on all interactive elements
- [ ] Color contrast meets WCAG AA standards (4.5:1 for text)
- [ ] Focus returns to first error field after validation
- [ ] All modals/overlays trap focus (if any)

### Testing Tools
- **Screen Reader:** NVDA (Windows) or VoiceOver (Mac)
- **Keyboard:** Tab through entire portal without mouse
- **Contrast:** WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/)
- **Lighthouse:** Chrome DevTools > Lighthouse > Accessibility

---

## File Locations Quick Reference

### Dashboard
- **Feature:** `features/client/dashboard/components/dashboard-feature.tsx`
- **Overview:** `features/client/dashboard/components/dashboard-overview.tsx`
- **Summary Cards:** `features/client/dashboard/components/dashboard-summary-cards.tsx`
- **Page:** `app/(client)/client/page.tsx`

### Sites
- **List Feature:** `features/client/sites/components/sites-list-feature.tsx`
- **Site Card:** `features/client/sites/components/site-card.tsx`
- **Detail Feature:** `features/client/sites/components/site-detail-feature.tsx`
- **Page:** `app/(client)/client/sites/page.tsx`

### Subscription
- **Feature:** `features/client/subscription/components/subscription-feature.tsx`
- **Card:** `features/client/subscription/components/subscription-card.tsx`
- **Page:** `app/(client)/client/subscription/page.tsx`

### Support
- **List Feature:** `features/client/support/components/support-list-feature.tsx`
- **Ticket List:** `features/client/support/components/ticket-list.tsx`
- **Detail Feature:** `features/client/support/components/ticket-detail-feature.tsx`
- **Page:** `app/(client)/client/support/page.tsx`

### Profile
- **Feature:** `features/client/profile/components/profile-feature.tsx`
- **Form:** `features/client/profile/components/profile-form.tsx`
- **Fields:** `features/client/profile/components/profile-*-fields-native.tsx`
- **Page:** `app/(client)/client/profile/page.tsx`

---

## Common Patterns

### Status Badge Variants
```tsx
const getStatusVariant = (status: string) => {
  const variants = {
    live: 'default',           // Green
    active: 'default',         // Green
    in_progress: 'secondary',  // Gray
    pending: 'outline',        // White/outlined
    resolved: 'outline',       // White/outlined
    archived: 'destructive',   // Red
    past_due: 'destructive',   // Red
  } as const
  return variants[status as keyof typeof variants] || 'outline'
}
```

### Empty State Pattern
```tsx
{items.length === 0 ? (
  <Empty className="border border-dashed">
    <EmptyHeader>
      <EmptyMedia variant="icon"><Icon className="size-6" /></EmptyMedia>
      <EmptyTitle>No items yet</EmptyTitle>
      <EmptyDescription>Get started by creating your first item.</EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <Button asChild><Link href="/create">Create Item</Link></Button>
    </EmptyContent>
  </Empty>
) : (
  <ItemGroup>{/* Render items */}</ItemGroup>
)}
```

### Loading State Pattern
```tsx
// In page.tsx
import { Suspense } from 'react'

export default function Page() {
  return <Suspense fallback={<PageLoading />}><Feature /></Suspense>
}

// In loading.tsx
export default function PageLoading() {
  return <Skeleton className="h-[400px] w-full rounded-lg" />
}
```

---

## Testing After Implementation

### Manual Testing Checklist
- [ ] Navigation: All sidebar links work correctly
- [ ] Dashboard: Shows overview with summary cards + recent activity
- [ ] Sites: Status displays with colored Badge
- [ ] Subscription: No nested Item components, clean layout
- [ ] Support: Ticket status uses Select dropdown (if implemented)
- [ ] Profile: Form accessibility works (screen reader + toast)
- [ ] Breadcrumbs: Appear in detail pages, links work
- [ ] Loading: Skeleton matches content layout
- [ ] Separators: Clear visual hierarchy between sections

### Accessibility Testing
- [ ] Tab through entire portal (keyboard only)
- [ ] Test with screen reader (NVDA/VoiceOver)
- [ ] Check color contrast on all text
- [ ] Verify focus indicators visible
- [ ] Test form error announcements

### Responsive Testing
- [ ] Mobile: Cards stack correctly
- [ ] Mobile: Navigation works (sidebar collapses)
- [ ] Tablet: Grid layouts adjust appropriately
- [ ] Desktop: Full layout displays correctly

---

## Common Issues & Solutions

### Issue: "Cannot find module '@/components/ui/separator'"
**Solution:** Component not installed. Run:
```bash
npx shadcn@latest add separator
```

### Issue: "Item component has double borders"
**Solution:** Remove nested Item components. Use simple divs or headings instead.

### Issue: "Tab navigation no longer works"
**Solution:** Correct! Replace with direct page navigation via sidebar.

### Issue: "Loading state causes layout shift"
**Solution:** Make Skeleton match exact content dimensions:
```tsx
<Skeleton className="h-[200px] w-full rounded-lg" /> // Match card height
```

### Issue: "Badge not showing color"
**Solution:** Ensure variant prop is correct:
```tsx
<Badge variant="default"> // Not className="bg-green-500"
```

---

## Quick Links

**Full Reports:**
- [Comprehensive Audit](/Users/afshin/Desktop/zss/clients/000-zenith/03-website-development/zss-ca-v3/docs/ui-ux-reports/client-portal-audit.md)
- [Implementation Guide](/Users/afshin/Desktop/zss/clients/000-zenith/03-website-development/zss-ca-v3/docs/ui-ux-reports/client-portal-implementation-guide.md)

**Project Rules:**
- [UI Patterns](docs/rules/08-ui.md)
- [Form UX](docs/rules/07-forms.md)
- [React Patterns](docs/rules/03-react.md)

**shadcn/ui Docs:**
- [All Components](docs/shadcn-components-docs/)
- [Separator](docs/shadcn-components-docs/separator.md)
- [Badge](docs/shadcn-components-docs/badge.md)
- [Tabs](docs/shadcn-components-docs/tabs.md)
- [Select](docs/shadcn-components-docs/select.md)
- [Breadcrumb](docs/shadcn-components-docs/breadcrumb.md)

---

**Last Updated:** 2025-11-05
**Status:** Ready for Implementation
**Estimated Effort:** 9 hours over 3 days
