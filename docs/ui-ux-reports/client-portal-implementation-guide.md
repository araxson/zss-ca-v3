# Client Portal UI/UX Implementation Guide

**Companion to:** `client-portal-audit.md`
**Purpose:** Actionable fixes with exact code examples
**Estimated Total Time:** 9 hours

---

## Priority 1: Remove Dashboard Tabs (2-3 hours)

### Current Problem

```
┌─────────────────────────────────────────────────┐
│ Sidebar Navigation                              │
├─────────────────────────────────────────────────┤
│ - Dashboard                                     │
│ - Sites                                         │
│ - Support                                       │
│ - Profile                                       │
│ - Subscription                                  │
└─────────────────────────────────────────────────┘
           │
           ├─> Navigates to /client/dashboard
           │   ┌───────────────────────────────┐
           │   │ Dashboard Page                │
           │   ├───────────────────────────────┤
           │   │ [Sites] [Tickets] [Account]  │ ← TAB NAVIGATION
           │   │                               │
           │   │ Content based on tab          │
           │   └───────────────────────────────┘
           │
           └─> Creates DOUBLE NAVIGATION
               (Sidebar + Tabs = Confusing)
```

### Recommended Architecture

```
┌─────────────────────────────────────────────────┐
│ Sidebar Navigation                              │
├─────────────────────────────────────────────────┤
│ - Overview         → /client/dashboard          │
│ - Sites            → /client/sites              │
│ - Support          → /client/support            │
│ - Profile          → /client/profile            │
│ - Subscription     → /client/subscription       │
└─────────────────────────────────────────────────┘

Each page is DIRECT - no secondary tab navigation
```

### Implementation Steps

#### Step 1: Update Sidebar Configuration

**File:** `lib/config/navigation.tsx` (or wherever `CLIENT_SIDEBAR_SECTIONS` is defined)

```tsx
// BEFORE
export const CLIENT_SIDEBAR_SECTIONS = [
  {
    label: 'Main',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/client/dashboard' },
      { icon: Globe, label: 'Sites', href: '/client/sites' },
      // ...
    ],
  },
]

// AFTER
export const CLIENT_SIDEBAR_SECTIONS = [
  {
    label: 'Main',
    items: [
      { icon: LayoutDashboard, label: 'Overview', href: '/client/dashboard' }, // Changed label
      { icon: Globe, label: 'Sites', href: '/client/sites' },
      { icon: LifeBuoy, label: 'Support', href: '/client/support' },
      { icon: User, label: 'Profile', href: '/client/profile' },
      { icon: CreditCard, label: 'Subscription', href: '/client/subscription' },
    ],
  },
]
```

#### Step 2: Simplify Dashboard Overview

**File:** `features/client/dashboard/components/dashboard-overview.tsx`

```tsx
'use client'

import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ROUTES } from '@/lib/constants/routes'
import type { Database } from '@/lib/types/database.types'
import { DashboardSummaryCards } from './dashboard-summary-cards'
import { RecentSitesCard } from './recent-sites-card' // NEW
import { RecentTicketsCard } from './recent-tickets-card' // NEW
import { AlertCircle } from 'lucide-react'

type Profile = Database['public']['Tables']['profile']['Row']
type Subscription = Database['public']['Tables']['subscription']['Row'] & {
  plan: Database['public']['Tables']['plan']['Row'] | null
}
type ClientSite = Database['public']['Tables']['client_site']['Row']
type SupportTicket = Database['public']['Tables']['support_ticket']['Row']

interface DashboardOverviewProps {
  profile: Profile | null
  subscription: Subscription | null
  sites: ClientSite[]
  tickets: SupportTicket[]
  openTicketsCount: number
}

export function DashboardOverview({
  profile,
  subscription,
  sites,
  tickets,
  openTicketsCount,
}: DashboardOverviewProps) {
  const activeSites = sites.filter(site => site.status === 'live')
  const sitesInProgress = sites.filter(site =>
    ['pending', 'in_production', 'awaiting_client_content', 'ready_for_review'].includes(site.status)
  )

  return (
    <div className="space-y-6">
      {/* No subscription alert */}
      {!subscription && (
        <div className="space-y-3">
          <Alert>
            <AlertCircle className="size-4" aria-hidden="true" />
            <AlertTitle>No active subscription</AlertTitle>
            <AlertDescription>
              Subscribe to a plan to get started with your website.
            </AlertDescription>
          </Alert>
          <div className="flex justify-start sm:justify-end">
            <Button asChild>
              <Link href={ROUTES.PRICING}>View Plans</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <DashboardSummaryCards
        subscription={subscription}
        sitesCount={sites.length}
        activeSitesCount={activeSites.length}
        sitesInProgressCount={sitesInProgress.length}
        openTicketsCount={openTicketsCount}
      />

      <Separator />

      {/* Recent activity section */}
      <div className="grid gap-6 md:grid-cols-2">
        <RecentSitesCard sites={sites.slice(0, 3)} />
        <RecentTicketsCard tickets={tickets.slice(0, 5)} />
      </div>
    </div>
  )
}
```

#### Step 3: Create Recent Sites Card

**File:** `features/client/dashboard/components/recent-sites-card.tsx` (NEW)

```tsx
'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { ROUTES } from '@/lib/constants/routes'
import type { Database } from '@/lib/types/database.types'
import { getSiteStatusLabel } from '@/features/shared/utils'
import { Globe } from 'lucide-react'

type ClientSite = Database['public']['Tables']['client_site']['Row']

interface RecentSitesCardProps {
  sites: ClientSite[]
}

const getStatusVariant = (status: string) => {
  const variants = {
    live: 'default',
    in_production: 'secondary',
    pending: 'outline',
    ready_for_review: 'secondary',
    awaiting_client_content: 'secondary',
    archived: 'destructive',
  } as const

  return variants[status as keyof typeof variants] || 'outline'
}

export function RecentSitesCard({ sites }: RecentSitesCardProps) {
  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemMedia variant="icon">
          <Globe className="size-4" aria-hidden="true" />
        </ItemMedia>
        <ItemTitle>Recent Sites</ItemTitle>
        <ItemDescription>Your latest website projects</ItemDescription>
      </ItemHeader>
      <ItemContent>
        {sites.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sites yet</p>
        ) : (
          <ItemGroup className="space-y-2">
            {sites.map((site) => (
              <Item key={site.id} variant="muted" size="sm" asChild>
                <Link href={`${ROUTES.CLIENT_SITES}/${site.id}`}>
                  <ItemContent className="flex-1">
                    <ItemTitle>{site.site_name}</ItemTitle>
                    <ItemDescription className="line-clamp-1">
                      {site.custom_domain || site.deployment_url || 'No URL yet'}
                    </ItemDescription>
                  </ItemContent>
                  <Badge variant={getStatusVariant(site.status)}>
                    {getSiteStatusLabel(site.status)}
                  </Badge>
                </Link>
              </Item>
            ))}
          </ItemGroup>
        )}
      </ItemContent>
      {sites.length > 0 && (
        <div className="p-4 pt-0">
          <Button asChild variant="link" className="h-auto p-0">
            <Link href={ROUTES.CLIENT_SITES}>View all sites →</Link>
          </Button>
        </div>
      )}
    </Item>
  )
}
```

#### Step 4: Create Recent Tickets Card

**File:** `features/client/dashboard/components/recent-tickets-card.tsx` (NEW)

```tsx
'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { ROUTES } from '@/lib/constants/routes'
import type { Database } from '@/lib/types/database.types'
import { LifeBuoy } from 'lucide-react'

type SupportTicket = Database['public']['Tables']['support_ticket']['Row']

interface RecentTicketsCardProps {
  tickets: SupportTicket[]
}

const getTicketStatusVariant = (status: string) => {
  const variants = {
    open: 'default',
    in_progress: 'secondary',
    awaiting_response: 'secondary',
    resolved: 'outline',
    closed: 'outline',
  } as const

  return variants[status as keyof typeof variants] || 'outline'
}

export function RecentTicketsCard({ tickets }: RecentTicketsCardProps) {
  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemMedia variant="icon">
          <LifeBuoy className="size-4" aria-hidden="true" />
        </ItemMedia>
        <ItemTitle>Recent Tickets</ItemTitle>
        <ItemDescription>Your latest support requests</ItemDescription>
      </ItemHeader>
      <ItemContent>
        {tickets.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tickets yet</p>
        ) : (
          <ItemGroup className="space-y-2">
            {tickets.map((ticket) => (
              <Item key={ticket.id} variant="muted" size="sm" asChild>
                <Link href={`${ROUTES.CLIENT_SUPPORT}/${ticket.id}`}>
                  <ItemContent className="flex-1">
                    <ItemTitle className="line-clamp-1">{ticket.subject}</ItemTitle>
                    <ItemDescription className="text-xs">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </ItemDescription>
                  </ItemContent>
                  <Badge variant={getTicketStatusVariant(ticket.status)}>
                    {ticket.status.replace('_', ' ')}
                  </Badge>
                </Link>
              </Item>
            ))}
          </ItemGroup>
        )}
      </ItemContent>
      {tickets.length > 0 && (
        <div className="p-4 pt-0">
          <Button asChild variant="link" className="h-auto p-0">
            <Link href={ROUTES.CLIENT_SUPPORT}>View all tickets →</Link>
          </Button>
        </div>
      )}
    </Item>
  )
}
```

#### Step 5: Remove Old Tab Components

**Delete or Archive:**
- `features/client/dashboard/components/dashboard-sites-tab.tsx`
- `features/client/dashboard/components/dashboard-tickets-tab.tsx`
- `features/client/dashboard/components/dashboard-account-tab.tsx`

**Keep (still needed):**
- `dashboard-summary-cards.tsx`
- `dashboard-sites-chart.tsx` (if used in sites page)
- `dashboard-tickets-table.tsx` (if used in support page)

#### Step 6: Update Exports

**File:** `features/client/dashboard/components/index.ts`

```ts
// REMOVE
export { DashboardSitesTab } from './dashboard-sites-tab'
export { DashboardTicketsTab } from './dashboard-tickets-tab'
export { DashboardAccountTab } from './dashboard-account-tab'

// ADD
export { RecentSitesCard } from './recent-sites-card'
export { RecentTicketsCard } from './recent-tickets-card'
```

#### Step 7: Update Page Metadata

**File:** `app/(client)/client/page.tsx`

```tsx
export const metadata: Metadata = {
  title: 'Overview', // Changed from 'Dashboard'
  description: 'Your account overview and recent activity', // More descriptive
  robots: {
    index: false,
    follow: false,
  },
}
```

---

## Priority 2: Add Separator Components (30 minutes)

### Visual Hierarchy Improvements

#### Location 1: Dashboard Overview

**File:** `features/client/dashboard/components/dashboard-overview.tsx`

```tsx
import { Separator } from '@/components/ui/separator'

// After summary cards
<DashboardSummaryCards {...props} />

{/* ADD THIS */}
<Separator />

{/* Before recent activity */}
<div className="grid gap-6 md:grid-cols-2">
  <RecentSitesCard sites={sites.slice(0, 3)} />
  <RecentTicketsCard tickets={tickets.slice(0, 5)} />
</div>
```

#### Location 2: Subscription Card

**File:** `features/client/subscription/components/subscription-card.tsx`

```tsx
<FieldGroup className="space-y-4">
  <Field>
    <FieldLabel>Current Period</FieldLabel>
    <FieldDescription>Renews on {date}</FieldDescription>
  </Field>

  {/* ADD THIS */}
  <Separator />

  <Field>
    <FieldLabel>Plan Features</FieldLabel>
    {/* ... */}
  </Field>

  {/* Already exists - keep */}
  <Separator />

  <Field>
    <FieldLabel>Pricing</FieldLabel>
    {/* ... */}
  </Field>
</FieldGroup>
```

#### Location 3: Profile Page

**File:** `features/client/profile/components/profile-feature.tsx`

```tsx
<div className="space-y-6">
  <Item variant="outline">
    <ItemHeader>
      <ItemTitle>Personal Information</ItemTitle>
      <ItemDescription>Update your contact details and company information</ItemDescription>
    </ItemHeader>

    {/* ADD THIS */}
    <Separator />

    <ItemContent>
      <ProfileForm profile={profile} />
    </ItemContent>
  </Item>
</div>
```

---

## Priority 3: Fix Nested Item in Subscription Card (20 minutes)

### Current Problem (Lines 42-52)

```tsx
<Item variant="outline">
  <ItemContent className="basis-full">
    <div className="space-y-6 p-6">
      {/* ❌ PROBLEM: Item inside Item */}
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>{plan.name} Plan</ItemTitle>
          <ItemDescription>{plan.description}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Badge variant={isActive ? 'default' : ...}>
            {subscription.status}
          </Badge>
        </ItemActions>
      </Item>
      {/* ... rest */}
    </div>
  </ItemContent>
</Item>
```

### Fixed Implementation

**File:** `features/client/subscription/components/subscription-card.tsx`

```tsx
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { ManageSubscriptionButtons } from './manage-subscription-buttons'
import type { SubscriptionWithPlan } from '../api/queries'
import { Check } from 'lucide-react'

interface SubscriptionCardProps {
  subscription: SubscriptionWithPlan
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps): React.JSX.Element {
  const plan = subscription.plan
  const currentPeriodEnd = subscription.current_period_end ? new Date(subscription.current_period_end) : null
  const isActive = subscription.status === 'active'
  const isPastDue = subscription.status === 'past_due'

  // Temporary: Price should come from Stripe
  const monthlyPrice = plan.setup_fee_cents ? plan.setup_fee_cents / 100 : 0
  const yearlyPrice = monthlyPrice * 12

  return (
    <Item variant="outline">
      <ItemContent className="basis-full">
        <div className="space-y-6 p-6">
          {/* ✅ FIXED: Simple header div instead of nested Item */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{plan.name} Plan</h3>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>
            <Badge variant={isActive ? 'default' : isPastDue ? 'destructive' : 'secondary'}>
              {subscription.status}
            </Badge>
          </div>

          <Separator />

          <FieldSet className="space-y-4">
            <FieldLegend>Billing details</FieldLegend>
            <FieldGroup className="space-y-4">
              {currentPeriodEnd && (
                <>
                  <Field>
                    <FieldLabel>Current Period</FieldLabel>
                    <FieldDescription>
                      Renews on {currentPeriodEnd.toLocaleDateString()}
                    </FieldDescription>
                  </Field>
                  <Separator />
                </>
              )}

              <Field>
                <FieldLabel>Plan Features</FieldLabel>
                <FieldDescription>
                  <div className="space-y-2">
                    <Item variant="outline" size="sm">
                      <ItemMedia>
                        <Check className="size-4 text-muted-foreground" aria-hidden="true" />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>
                          {plan.page_limit ? `${plan.page_limit} pages` : 'Unlimited pages'}
                        </ItemTitle>
                        <ItemDescription>Page allotment included in this plan</ItemDescription>
                      </ItemContent>
                    </Item>
                    <Item variant="outline" size="sm">
                      <ItemMedia>
                        <Check className="size-4 text-muted-foreground" aria-hidden="true" />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>
                          {plan.revision_limit
                            ? `${plan.revision_limit} revisions/month`
                            : 'Unlimited revisions'}
                        </ItemTitle>
                        <ItemDescription>Revision capacity per billing cycle</ItemDescription>
                      </ItemContent>
                    </Item>
                  </div>
                </FieldDescription>
              </Field>

              <Separator />

              <Field>
                <FieldLabel>Pricing</FieldLabel>
                <p className="font-medium">
                  ${monthlyPrice}/month or ${yearlyPrice}/year
                </p>
              </Field>
            </FieldGroup>
          </FieldSet>

          {isPastDue && (
            <Alert variant="destructive" aria-live="assertive">
              <AlertTitle>Payment Failed</AlertTitle>
              <AlertDescription>
                Please update your payment method to continue your subscription.
              </AlertDescription>
            </Alert>
          )}

          <ManageSubscriptionButtons subscriptionId={subscription.id} />
        </div>
      </ItemContent>
    </Item>
  )
}
```

---

## Priority 4: Add Badge for Site Status (20 minutes)

### Implementation

**File:** `features/client/sites/components/site-card.tsx`

```tsx
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { ROUTES } from '@/lib/constants/routes'
import type { Database } from '@/lib/types/database.types'
import { getSiteStatusLabel } from '@/features/shared/utils'
import { Globe } from 'lucide-react'
import type { ComponentProps } from 'react'

type ClientSite = Database['public']['Tables']['client_site']['Row']

interface SiteCardProps {
  site: ClientSite
}

// ✅ ADD: Status variant mapper
const getStatusVariant = (status: string): ComponentProps<typeof Badge>['variant'] => {
  const variants = {
    live: 'default',
    in_production: 'secondary',
    pending: 'outline',
    ready_for_review: 'secondary',
    awaiting_client_content: 'secondary',
    archived: 'destructive',
  } as const

  return variants[status as keyof typeof variants] || 'outline'
}

export function SiteCard({ site }: SiteCardProps) {
  return (
    <Item variant="outline" asChild>
      <Link href={`${ROUTES.CLIENT_SITES}/${site.id}`}>
        <ItemMedia variant="icon">
          <Globe className="size-6" aria-hidden="true" />
        </ItemMedia>
        <ItemContent>
          <div className="flex items-start justify-between gap-2">
            <ItemTitle>{site.site_name}</ItemTitle>
            {/* ✅ ADD: Badge for status */}
            <Badge variant={getStatusVariant(site.status)}>
              {getSiteStatusLabel(site.status)}
            </Badge>
          </div>
          <ItemDescription>
            {site.custom_domain || site.deployment_url || 'No URL yet'}
          </ItemDescription>
        </ItemContent>
      </Link>
    </Item>
  )
}
```

---

## Priority 5: Implement Select for Ticket Status (30 minutes)

### Current Pattern (Assumed)

**File:** `features/client/support/components/update-status-button.tsx`

```tsx
// ❌ BEFORE: Multiple buttons or custom dropdown
<div className="flex gap-2">
  <Button onClick={() => updateStatus('open')}>Open</Button>
  <Button onClick={() => updateStatus('in_progress')}>In Progress</Button>
  <Button onClick={() => updateStatus('resolved')}>Resolved</Button>
</div>
```

### Recommended Implementation

**File:** `features/client/support/components/update-status-select.tsx` (RENAME)

```tsx
'use client'

import { useActionState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import { updateTicketStatusAction } from '../api/mutations'
import { toast } from 'sonner'
import { useEffect } from 'react'

interface UpdateStatusSelectProps {
  ticketId: string
  currentStatus: string
  disabled?: boolean
}

export function UpdateStatusSelect({
  ticketId,
  currentStatus,
  disabled = false,
}: UpdateStatusSelectProps) {
  const [state, formAction, isPending] = useActionState(
    updateTicketStatusAction,
    { error: null }
  )

  useEffect(() => {
    if (!isPending && state) {
      if (state.error) {
        toast.error('Status update failed', {
          description: state.error,
        })
      } else {
        toast.success('Status updated', {
          description: 'Ticket status has been updated',
        })
      }
    }
  }, [state, isPending])

  const handleValueChange = (value: string) => {
    const formData = new FormData()
    formData.append('ticketId', ticketId)
    formData.append('status', value)
    formAction(formData)
  }

  return (
    <Field>
      <FieldLabel htmlFor={`status-${ticketId}`}>Ticket Status</FieldLabel>
      <Select
        value={currentStatus}
        onValueChange={handleValueChange}
        disabled={disabled || isPending}
      >
        <SelectTrigger id={`status-${ticketId}`} aria-label="Update ticket status">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="awaiting_response">Awaiting Response</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>
      <FieldDescription>Change the status of this support ticket</FieldDescription>
    </Field>
  )
}
```

**Usage in ticket detail:**

```tsx
<UpdateStatusSelect
  ticketId={ticket.id}
  currentStatus={ticket.status}
  disabled={isPending}
/>
```

---

## Priority 6: Add Breadcrumb Navigation (1 hour)

### Implementation

#### Step 1: Create Breadcrumb Wrapper Component

**File:** `components/layout/shared/breadcrumb-nav.tsx` (NEW)

```tsx
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export interface BreadcrumbNavItem {
  label: string
  href?: string
}

interface BreadcrumbNavProps {
  items: BreadcrumbNavItem[]
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  if (items.length === 0) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <div key={item.label} className="flex items-center">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

#### Step 2: Add to Site Detail Page

**File:** `features/client/sites/components/site-detail-feature.tsx`

```tsx
import { BreadcrumbNav } from '@/components/layout/shared/breadcrumb-nav'
import { ROUTES } from '@/lib/constants/routes'

export function SiteDetailFeature({ site }: SiteDetailFeatureProps) {
  const breadcrumbs = [
    { label: 'Overview', href: ROUTES.CLIENT_DASHBOARD },
    { label: 'Sites', href: ROUTES.CLIENT_SITES },
    { label: site.site_name }, // Current page - no href
  ]

  return (
    <div className="space-y-6">
      <BreadcrumbNav items={breadcrumbs} />

      {/* Rest of site detail content */}
      <SiteDetail site={site} />
    </div>
  )
}
```

#### Step 3: Add to Ticket Detail Page

**File:** `features/client/support/components/ticket-detail-feature.tsx`

```tsx
import { BreadcrumbNav } from '@/components/layout/shared/breadcrumb-nav'
import { ROUTES } from '@/lib/constants/routes'

export function TicketDetailFeature({ ticket }: TicketDetailFeatureProps) {
  const breadcrumbs = [
    { label: 'Overview', href: ROUTES.CLIENT_DASHBOARD },
    { label: 'Support', href: ROUTES.CLIENT_SUPPORT },
    { label: `Ticket #${ticket.id.slice(0, 8)}` }, // Current page
  ]

  return (
    <div className="space-y-6">
      <BreadcrumbNav items={breadcrumbs} />

      {/* Rest of ticket detail content */}
      <TicketDetail ticket={ticket} />
    </div>
  )
}
```

---

## Priority 7: Enhance Loading States (30 minutes)

### Dashboard Loading State

**File:** `app/(client)/client/loading.tsx`

```tsx
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Alert skeleton (conditional, always show) */}
      <Skeleton className="h-20 w-full rounded-lg" />

      {/* Summary cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading dashboard">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3 rounded-lg border p-6">
            <div className="flex items-center justify-between">
              <Skeleton className="size-10 rounded-md" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-9 w-full" />
          </div>
        ))}
      </div>

      <Separator />

      {/* Recent activity skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-4 rounded-lg border p-6">
            <div className="flex items-center gap-2">
              <Skeleton className="size-8 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} className="h-16 w-full rounded-md" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Sites List Loading State

**File:** `app/(client)/client/sites/loading.tsx`

```tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function SitesLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2" role="status" aria-label="Loading sites">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-4 rounded-lg border p-4">
          <Skeleton className="size-12 shrink-0 rounded-md" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      ))}
    </div>
  )
}
```

---

## Testing Checklist

After implementing all fixes, verify:

### Navigation Testing
- [ ] Sidebar "Overview" link goes to `/client/dashboard`
- [ ] Dashboard shows summary cards + recent activity (NO TABS)
- [ ] All sidebar links work correctly
- [ ] Breadcrumbs appear in site/ticket detail pages
- [ ] Breadcrumb links navigate correctly

### Visual Testing
- [ ] Separator components create clear section divisions
- [ ] Subscription card has no nested Item components
- [ ] Site status displays with colored Badge
- [ ] Ticket status uses Select dropdown (if implemented)
- [ ] Loading states match content layout

### Accessibility Testing
- [ ] Tab through entire portal with keyboard
- [ ] All interactive elements have focus indicators
- [ ] Screen reader announces form status correctly
- [ ] All buttons have accessible names
- [ ] Select components are keyboard navigable

### Responsive Testing
- [ ] Dashboard summary cards stack correctly on mobile
- [ ] Recent activity cards stack on mobile
- [ ] Breadcrumbs don't overflow on narrow screens
- [ ] Site cards stack correctly on mobile

### Performance Testing
- [ ] Page loads quickly (< 1s for dashboard)
- [ ] No layout shift when loading states transition
- [ ] Search/filter is responsive (< 100ms)

---

## Rollout Plan

### Phase 1: Foundation (Day 1 - 3 hours)
1. Remove dashboard tabs → direct pages (2-3 hours)
2. Add Separator components (30 min)

**Verification:** Dashboard is clean, navigation is intuitive

### Phase 2: Polish (Day 2 - 3 hours)
1. Fix nested Item in subscription card (20 min)
2. Add Badge for site status (20 min)
3. Add Select for ticket status (30 min)
4. Enhance loading states (30 min)
5. Add breadcrumb navigation (1 hour)

**Verification:** All visual issues resolved, UX improved

### Phase 3: Testing & Refinement (Day 3 - 3 hours)
1. Manual testing (navigation, visual, accessibility)
2. Fix any bugs discovered
3. Document changes for team

**Total:** ~9 hours over 3 days

---

## Before/After Comparison

### Dashboard Navigation

**BEFORE:**
```
Dashboard Page
├── Tabs: [Sites] [Tickets] [Account]
└── Content changes based on active tab
```

**AFTER:**
```
Overview Page (/client/dashboard)
├── Summary Cards
├── Separator
└── Recent Activity (Sites + Tickets cards)
```

### Subscription Card

**BEFORE:**
```tsx
<Item>              ← Outer container
  <Item>            ← ❌ Nested Item (problem)
    Plan info
  </Item>
  Features
</Item>
```

**AFTER:**
```tsx
<Item>              ← Outer container
  <div>             ← ✅ Simple header
    Plan info
  </div>
  <Separator />
  Features
</Item>
```

### Site Status Display

**BEFORE:**
```
Status: Live        (plain text)
```

**AFTER:**
```
Status: [Live]      (green badge, visually prominent)
```

---

## Additional Resources

- **shadcn/ui Docs:** https://ui.shadcn.com
- **Tabs Component:** `docs/shadcn-components-docs/tabs.md`
- **Separator Component:** `docs/shadcn-components-docs/separator.md`
- **Badge Component:** `docs/shadcn-components-docs/badge.md`
- **Select Component:** `docs/shadcn-components-docs/select.md`
- **Breadcrumb Component:** `docs/shadcn-components-docs/breadcrumb.md`

---

**Next Steps:**
1. Review audit report (`client-portal-audit.md`)
2. Start with Priority 1 (remove dashboard tabs)
3. Test each change before moving to next priority
4. Document any deviations or additional findings
