# Features Organization

This document describes the structure and organization of the `features/` directory.

## Overview

The features folder is organized around **five distinct contexts**:
1. **Marketing Portal** - Public-facing pages (home, pricing, about, contact)
2. **Authentication** - Shared auth logic (login, signup, password reset)
3. **Shared Features** - Cross-portal business logic (subscriptions, support, notifications, audit logs)
4. **Admin Portal** - Admin-only features (client management, site deployment, analytics)
5. **Client Portal** - Client-only features (dashboard, profile, sites)

## Directory Structure

```
features/
├── marketing/           # Public portal features
│   ├── about/
│   ├── contact/
│   ├── home/
│   └── pricing/
├── auth/                # Shared authentication (login, signup, reset password)
│   ├── api/
│   │   └── mutations.ts
│   ├── components/      # Form components
│   └── schema.ts        # Zod validation
├── shared/              # Shared business logic across portals
│   ├── subscription/    # Subscription management
│   ├── support/         # Support tickets
│   ├── notifications/   # In-app notifications
│   └── audit-log/       # Compliance audit trail
├── admin/               # Admin portal exclusive features
│   ├── analytics/       # Admin analytics
│   ├── clients/         # Client management (CRUD)
│   ├── dashboard/       # Admin dashboard
│   ├── sites/           # Site deployment tracking
│   └── components/      # Admin-specific UI
└── client/              # Client portal exclusive features
    ├── dashboard/       # Client dashboard
    ├── profile/         # User profile management
    ├── sites/           # Site viewing/management
    └── components/      # Client-specific UI
```

## Feature Organization Pattern

Each feature follows a consistent structure:

```
features/[context]/[feature-name]/
├── api/
│   ├── queries.ts       # Server-only data fetching ('server-only' import)
│   └── mutations.ts     # Server actions ('use server' directive)
├── components/          # UI components (mark 'use client' if needed)
│   ├── feature-list.tsx
│   ├── feature-form.tsx
│   └── feature-detail.tsx
├── schema.ts            # Zod validation schemas
└── types.ts             # Feature-specific types (optional)
```

## Context Breakdown

### Marketing Portal (`features/marketing/`)

Public-facing pages accessible to unauthenticated users.

**Subfolders:**
- **about/** - Company information page
- **contact/** - Contact form and information
- **home/** - Landing page (hero, features, portal cards)
- **pricing/** - Subscription tier showcase (queries.ts for fetching plans)

**Characteristics:**
- No authentication required
- Static or public data
- Uses standard form validation

### Authentication (`features/auth/`)

Shared authentication logic used by all portals.

**Includes:**
- Login/signup forms
- Password reset flows
- OTP verification
- Server actions for auth mutations

**Usage:**
- Imported by auth pages: `app/auth/login/page.tsx`, etc.
- Shared across all portals

### Shared Features (`features/shared/`)

Cross-portal business logic with asymmetric permissions (different access rules per role).

#### `subscription/`
- Subscription CRUD operations
- Plan management
- Stripe integration
- Billing portal access
- Used by: marketing pricing page, client subscription page, admin client management

#### `support/`
- Support ticket creation and management
- Ticket replies and conversations
- Asymmetric access: clients create own, admins see all
- Used by: client support pages, admin support pages

#### `notifications/`
- In-app notification display
- Notification preferences
- Real-time subscription setup
- Used by: both admin and client portals

#### `audit-log/`
- Compliance logging
- Activity trail viewing (admin-only via RLS)
- System audit events
- Used by: admin audit logs page

### Admin Portal (`features/admin/`)

Admin-only features and dashboards.

**Subfolders:**

#### `analytics/`
- Site analytics and reporting
- Performance metrics
- Admin dashboard charts

#### `clients/`
- Client CRUD operations
- Client management interface
- Client detail cards

#### `dashboard/`
- Admin overview
- Key metrics and statistics
- Recent activity

#### `sites/`
- Site deployment tracking
- Site creation/editing
- Site status management

**Access Control:**
- Protected by `app/(portals)/admin/layout.tsx`
- Role verification via `getUser()` → check admin role
- All queries filtered by RLS policies

### Client Portal (`features/client/`)

Client-specific dashboards and management tools.

**Subfolders:**

#### `dashboard/`
- Client overview
- Quick stats
- Recent activity

#### `profile/`
- User account settings
- Contact information
- Profile management

#### `sites/`
- View deployed sites
- Site status
- Site analytics access

**Access Control:**
- Protected by `app/(portals)/client/layout.tsx`
- Multi-tenancy enforced via `user.id` in all queries
- RLS policies ensure clients only see own data

## Import Paths

When importing features, always reference the full path including context:

```tsx
// ✅ CORRECT - Full path with context
import { PricingCards } from '@/features/marketing/pricing/components/pricing-cards'
import { loginAction } from '@/features/auth/api/mutations'
import { getCurrentSubscription } from '@/features/shared/subscription/api/queries'
import { getTicketById } from '@/features/shared/support/api/queries'
import { getAllNotifications } from '@/features/shared/notifications/api/queries'
import { getAuditLogs } from '@/features/shared/audit-log/api/queries'
import { getClientsTable } from '@/features/admin/clients/api/queries'
import { getSiteAnalytics } from '@/features/admin/analytics/api/queries'
import { getClientDashboard } from '@/features/client/dashboard/api/queries'

// ❌ INCORRECT - Missing context
import { PricingCards } from '@/features/pricing/components/pricing-cards'
import { loginAction } from '@/auth/api/mutations'
```

## Shared vs. Portal-Specific Decision Tree

### When to put a feature in `shared/`
- ✅ Used by multiple portals (admin + client)
- ✅ Asymmetric permissions (different access rules per role)
- ✅ Cross-cutting domain (subscriptions, support, notifications)
- ✅ RLS policies handle access control

### When to put a feature in `admin/` or `client/`
- ✅ Exclusive to one portal
- ✅ No cross-portal usage
- ✅ Tightly coupled to portal-specific workflows
- ✅ Portal-level layout provides access control

## Database Relationship

Features map to database tables/domains:

| Feature | Tables | Access |
|---------|--------|--------|
| `marketing/*` | None (static/public) | Public |
| `auth` | `auth.users`, `profile` | Public (signup/login) |
| `shared/subscription` | `subscription`, `plan` | Both (RLS filtered) |
| `shared/support` | `support_ticket`, `ticket_reply` | Both (RLS filtered) |
| `shared/notifications` | `notification` | Both (RLS filtered) |
| `shared/audit-log` | `audit_log` | Admin only (RLS) |
| `admin/analytics` | `site_analytics`, views | Admin only (RLS) |
| `admin/clients` | `profile` (filtered) | Admin only (RLS) |
| `admin/sites` | `client_site` | Admin only (RLS) |
| `client/dashboard` | Multiple (RLS) | Client only (RLS) |
| `client/profile` | `profile` (own record) | Client only (RLS) |
| `client/sites` | `client_site` (owned) | Client only (RLS) |

## Adding New Features

1. **Identify the context:**
   - Marketing page? → `features/marketing/[feature-name]/`
   - Auth? → Add to `features/auth/`
   - Shared (both portals)? → `features/shared/[feature-name]/`
   - Admin only? → `features/admin/[feature-name]/`
   - Client only? → `features/client/[feature-name]/`

2. **Create the folder structure:**
   ```
   features/[context]/[feature-name]/
   ├── api/
   │   ├── queries.ts
   │   └── mutations.ts
   ├── components/
   ├── schema.ts
   └── types.ts
   ```

3. **Follow the patterns:**
   - Mark data fetching with `'server-only'` import
   - Mark server actions with `'use server'` directive
   - Mark client components with `'use client'` directive
   - Infer types from Zod schemas using `z.infer<>`

4. **Update navigation** if adding a new page in `lib/config/nav.config.ts`

5. **Add RLS policies** in database migrations for multi-tenant access

## Guidelines

- **No cross-feature imports** - Features are loosely coupled
- **Import from API/components** - Don't expose internal structures
- **Server-only code** - Mark sensitive logic with `'server-only'`
- **Type safety** - Infer from Zod, no `any` types
- **Thin pages** - Pages are 5-12 lines; logic lives in features
- **Full path imports** - Always include context in import paths

## References

- **UI Patterns:** See `docs/stack-patterns/ui-patterns.md`
- **TypeScript Patterns:** See `docs/stack-patterns/typescript-patterns.md`
- **Project Overview:** See `PROJECT_OVERVIEW.md`
