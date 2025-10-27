# Website Agency SaaS Platform - Project Overview

## Project Description

A SaaS platform for a Canadian web design agency that allows small businesses to subscribe to website plans. The agency builds and deploys static Next.js websites for clients based on their chosen subscription tier.

**Model**: Subscription-based (monthly/yearly) with 4 plan tiers
**Tech Stack**: Next.js, Supabase, Stripe
**Client Sites**: Fully static, custom domain, agency-designed (no client editing)

---

## Core Philosophy

- **Start minimal, build solid foundations**
- **Scalable architecture from day one**
- **Clear separation: Platform vs Client Sites**
- **Automate where possible, manual where needed**

---

## MVP Features (Phase 1)

### 1. Authentication & User Management
- User registration and login (email/password)
- Role-based access (Admin, Client)
- Profile management
- Password reset flow
- Email verification

### 2. Subscription Management
- Public pricing page with 4 plan tiers
- Monthly and yearly billing options
- Stripe checkout integration
- Subscription status tracking
- Automatic subscription renewal
- Cancellation handling (at period end)
- Failed payment handling

### 3. Admin Dashboard
- View all clients and their status
- View subscription details per client
- Manually update client site status (pending → in progress → completed → live)
- View all support tickets
- Respond to support tickets
- View revenue metrics (basic)
- Search and filter clients

### 4. Client Dashboard
- View current subscription plan and status
- View subscription billing dates
- Access Stripe billing portal (update payment, view invoices)
- View their deployed website link
- Submit support/change requests
- View support ticket history and status
- Basic welcome/onboarding message

### 5. Support Ticket System
- Clients can create tickets
- Ticket categories (technical, content change, general inquiry)
- Priority levels (low, medium, high)
- Status tracking (open, in progress, resolved, closed)
- Reply thread for conversations
- Email notifications on ticket updates
- Admin can assign priority and update status

### 6. Webhook Handling
- Stripe webhook integration
- Auto-update subscription status on payment success/failure
- Handle subscription cancellations
- Handle subscription upgrades/downgrades
- Send email notifications on subscription events

### 7. Email Notifications
- Welcome email on signup
- Payment confirmation
- Subscription renewal reminder
- Payment failure alert
- Website deployment notification
- Support ticket updates
- Subscription cancellation confirmation

### 8. Security & Compliance
- Row Level Security (RLS) on all Supabase tables
- Secure API routes with auth proxy
- HTTPS enforcement
- Stripe webhook signature verification
- GDPR-ready data structure
- User data export capability

---

## Future Features (Phase 2+)

### Client-Facing Features
- Analytics dashboard (site traffic, visitor stats)
- Site preview before going live
- Content change request form with visual mockups
- File upload for logos/images
- Basic SEO settings management
- Domain connection wizard
- Multi-site support per client
- Client testimonial submission
- Referral program

### Admin Features
- Automated deployment pipeline
- Site template management system
- Bulk operations (email clients, export data)
- Advanced analytics (MRR, churn rate, LTV)
- Client onboarding checklist automation
- Design approval workflow
- Time tracking for client work
- Invoice generation for custom work
- CRM integration
- API access for third-party tools

### Platform Features
- Team collaboration (multiple admin roles)
- White-label options
- Multi-language support
- Advanced billing (add-ons, one-time charges)
- Automated site backups
- A/B testing for client sites
- Built-in CDN management
- Automated SSL certificate handling
- Site health monitoring
- Uptime tracking

---

## Subscription Plans Structure

### Plan Tiers (Customizable)

**Starter Plan**
- Single page website
- Mobile responsive
- Contact form
- Basic SEO
- 1 revision per month
- Email support (48h response)

**Business Plan**
- Up to 3 pages
- Custom design
- Contact form integration
- Advanced SEO
- 2 revisions per month
- Priority email support (24h response)

**Professional Plan**
- Up to 5 pages
- Premium design
- Multiple forms
- E-commerce ready (static products)
- Advanced SEO + Schema markup
- 3 revisions per month
- Priority support (12h response)

**Enterprise Plan**
- Up to 10 pages
- Fully custom design
- Advanced integrations
- Blog/News section
- Premium SEO package
- Unlimited revisions
- Dedicated support (4h response)
- Monthly performance reports

---

## User Roles & Permissions

### Admin Role
- Full access to all dashboards
- Manage all client data
- Update site deployment status
- Access all support tickets
- View analytics and revenue
- Manage subscription plans
- Manual subscription adjustments

### Client Role
- Access only to personal dashboard
- View own subscription details
- Create support tickets
- View own deployed site
- Manage own billing via Stripe portal
- Update personal profile

---

## Core User Flows

### Client Onboarding Flow
1. Client visits pricing page
2. Selects plan (monthly/yearly)
3. Creates account
4. Completes Stripe checkout
5. Receives welcome email
6. Redirected to dashboard with "Site in progress" status
7. Admin receives notification
8. Admin builds site manually
9. Admin deploys and updates status to "Live"
10. Client receives deployment notification with link

### Support Request Flow
1. Client submits support ticket from dashboard
2. Admin receives email notification
3. Admin reviews ticket and responds
4. Client receives email notification of response
5. Conversation continues via ticket thread
6. Admin marks as resolved
7. Client confirms or reopens

### Subscription Cancellation Flow
1. Client clicks "Manage Billing" in dashboard
2. Redirected to Stripe portal
3. Cancels subscription
4. Subscription remains active until period end
5. Admin receives cancellation notification
6. Client receives cancellation confirmation email
7. At period end, subscription deactivates
8. Client loses dashboard access (optional: read-only mode)

### Payment Failure Flow
1. Stripe payment fails
2. Webhook updates subscription status to "past_due"
3. Client receives email to update payment method
4. Admin receives notification
5. After X days, subscription auto-cancels (configurable)

---

## Technical Architecture

### Platform Components

**Frontend**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI components
- Server and Client components

**Backend**
- Next.js API routes
- Supabase (PostgreSQL, Auth, Storage)
- Stripe API
- Email service (Resend/SendGrid)

**Hosting & Deployment**
- Vercel (main platform)
- Vercel/Netlify (client sites)
- Supabase Cloud
- Stripe

**Third-Party Services**
- Stripe (payments)
- Supabase (database, auth, storage)
- Email service provider
- Domain registrar API (optional)

### Database Schema Overview

**Core Tables (9 Tables)**

| Table | Purpose | Key Features | Soft Delete |
|-------|---------|-------------|-------------|
| **profile** | User profiles extending auth.users | Role-based access (admin/client), Stripe customer ID, company info | ✅ Yes |
| **plan** | Subscription plan catalog | Monthly/yearly pricing, feature flags (JSONB), page limits | ❌ No (use is_active) |
| **subscription** | Active subscriptions | Stripe integration, trial periods, lifecycle management | ✅ Yes |
| **client_site** | Website lifecycle tracking | Deployment status, custom domains, design briefs (JSONB) | ✅ Yes |
| **support_ticket** | Client support system | Priority levels, assignment, status tracking, metadata (JSONB) | ❌ No (use status) |
| **ticket_reply** | Ticket conversation threads | Threaded replies, internal notes, immutable audit trail | ❌ No |
| **notification** | In-app notifications | Type-based filtering, read status, auto-expiration | ❌ No (use expires_at) |
| **audit_log** | Compliance audit trail | Immutable logs, actor tracking, change history (JSONB) | ❌ No (immutable) |
| **site_analytics** | Daily site metrics | Page views, conversions, visitor tracking, metadata (JSONB) | ❌ No |

**Enumerated Types (7 Enums)**
- `user_role`: 'admin', 'client'
- `subscription_status`: 'trialing', 'active', 'past_due', 'canceled', 'incomplete', 'unpaid'
- `site_status`: 'pending', 'in_production', 'awaiting_client_content', 'ready_for_review', 'live', 'paused', 'archived'
- `ticket_status`: 'open', 'in_progress', 'awaiting_client', 'resolved', 'closed'
- `ticket_priority`: 'low', 'medium', 'high', 'urgent'
- `ticket_category`: 'technical', 'content_change', 'general_inquiry', 'billing'
- `notification_type`: 'subscription', 'billing', 'support', 'site_status', 'system', 'onboarding'

**Security Implementation**
- ✅ Row Level Security (RLS) on all 9 tables
- ✅ 32+ fine-grained security policies
- ✅ Soft delete with `deleted_at` filtering (profile, subscription, client_site)
- ✅ Comprehensive audit logging for compliance
- ✅ Role-based access control (Admin/Client)
- ✅ Email/URL validation at database level
- ✅ Stripe ID format validation (supports live and test modes)

**Performance Optimization**
- ✅ 43+ optimized indexes (composite, partial, GIN)
- ✅ `auth.uid()` optimization in RLS policies
- ✅ STABLE function markers for query planner
- ✅ Helper functions to reduce RLS overhead
- ✅ Monitoring views for database health
- ✅ Automatic statistics refresh

**Database Functions (14 total)**

*Trigger Functions (4):*
- `set_current_timestamp_updated_at()` - Auto-update timestamps
- `handle_new_user_profile()` - Auto-create profiles for new users
- `touch_support_ticket_reply()` - Update ticket activity timestamps
- `audit_table_changes()` - Comprehensive audit logging

*Helper Functions (4 private):*
- `current_user_is_admin()` - RLS helper for admin checks
- `user_ticket_ids()` - Performance-optimized ticket access
- `current_user_context()` - Combined user ID and admin status
- `user_client_site_ids()` - Site ownership helper

*Utility Functions (6 public):*
- `describe_table()` - Table structure inspection
- `user_has_role()` - Role verification
- `get_active_subscription()` - Get user's active subscription
- `calculate_revenue_stats()` - Revenue reporting
- `cleanup_old_audit_logs()` - Audit log maintenance
- `refresh_all_statistics()` - Database optimization

**Monitoring Views (5 Admin-Only)**
- `vw_database_health` - Database health overview
- `vw_index_usage` - Index usage statistics
- `vw_table_stats` - Table size and maintenance status
- `vw_rls_coverage` - RLS policy verification
- `vw_foreign_keys` - Foreign key relationships

**Data Validation**
- Email format validation (RFC 5322)
- URL format validation (HTTP/HTTPS)
- Phone number validation (min 10 chars)
- Stripe ID format validation (cus_*, sub_*, price_*)
- JSONB structure validation for features, metadata, design_brief
- Business logic constraints at DB level

**Foreign Key Cascade Rules**
- **ON DELETE CASCADE**: profile → subscription, auth.users → profile
- **ON DELETE SET NULL**: subscription → client_site, profile → support_ticket.assigned_to
- **ON DELETE RESTRICT**: plan → subscription (prevent plan deletion if in use)

---

## Deployment Strategy

### Client Website Deployment Options

**Option 1: Manual (MVP)**
- Build site locally
- Push to Vercel/Netlify manually
- Update database with deployment URL
- Connect custom domain via hosting platform

**Option 2: Semi-Automated (Phase 2)**
- Template repository per plan tier
- Use hosting platform API to deploy
- Automated domain connection
- Update database programmatically

**Option 3: Fully Automated (Phase 3)**
- Headless CMS for templates
- CI/CD pipeline per client
- Automated builds on template changes
- Zero-downtime deployments

---

## Key Metrics to Track

### Business Metrics
- Monthly Recurring Revenue (MRR)
- Active subscriptions by plan
- Churn rate
- Customer Lifetime Value (LTV)
- Conversion rate (visitor → paid)

### Operational Metrics
- Average deployment time
- Support ticket resolution time
- Active sites count
- Cancellation reasons
- Payment success rate

### Client Metrics (Future)
- Site uptime
- Page load speed
- Traffic analytics
- Form submissions
- SEO rankings

---

## Success Criteria (MVP)

- [ ] Client can sign up and pay via Stripe
- [ ] Admin receives notification of new client
- [ ] Admin can track site build status
- [ ] Client can view subscription in dashboard
- [ ] Client can submit support tickets
- [ ] Admin can respond to tickets
- [ ] Webhooks properly update subscription status
- [ ] Client can cancel subscription via Stripe portal
- [ ] Email notifications work for all key events
- [ ] RLS properly restricts client data access
- [ ] Payment failures are handled gracefully
- [ ] Custom domains can be connected to client sites

---

## Risk Mitigation

### Technical Risks
- **Payment failures**: Implement retry logic and grace periods
- **Data loss**: Daily automated backups
- **Security breach**: Regular security audits, RLS enforcement
- **Service downtime**: Monitor uptime, have maintenance mode ready

### Business Risks
- **Churn**: Track cancellation reasons, implement retention strategies
- **Scalability**: Use serverless architecture, optimize database queries
- **Support overload**: Implement ticket priority system, FAQ section

---

## Development Phases

### Phase 1: Foundation (MVP)
- Database schema and RLS
- Authentication system
- Stripe integration
- Basic admin dashboard
- Basic client dashboard
- Support ticket system

### Phase 2: Enhancement
- Analytics integration
- Automated deployment pipeline
- Enhanced admin tools
- Client site preview
- Advanced notifications

### Phase 3: Scale
- Multi-tenant optimization
- Advanced analytics
- Team collaboration
- API for integrations
- Mobile app (optional)

---

## Open Questions & Decisions Needed

1. **Plan Pricing**: Final pricing for each tier (monthly/yearly)?
2. **Trial Period**: Offer free trial or demo sites?
3. **Onboarding**: Collect design preferences during signup or via questionnaire after?
4. **Domain Management**: Include domain registration or client provides their own?
5. **Contract Terms**: Month-to-month or require annual commitment for certain tiers?
6. **Refund Policy**: Pro-rated refunds or no refunds?
7. **Overages**: Charge for extra revisions beyond plan limits?
8. **Site Ownership**: What happens to site if client cancels? Download option?

---

## Next Steps

1. Finalize subscription plan features and pricing
2. Design Supabase database schema with RLS policies
3. Set up Stripe products and prices
4. Build authentication flow
5. Implement webhook handling
6. Create admin dashboard MVP
7. Create client dashboard MVP
8. Build support ticket system
9. Set up email notifications
10. Test full user journey end-to-end
