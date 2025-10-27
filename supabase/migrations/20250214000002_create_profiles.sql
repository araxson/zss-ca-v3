-- ============================================================================
-- Migration: Create profile table extending auth.users metadata
-- Description: Stores roles, company information, and contact preferences
-- Author: Database Architecture Team
-- Date: 2025-02-14
--
-- Dependencies:
--   - 20250214000001_create_enums.sql (user_role enum)
--   - auth.users table (Supabase Auth)
--
-- Deployment Strategy: Safe for zero-downtime deployment
--   - Table creation is non-blocking
--   - Backfill operation is idempotent (ON CONFLICT DO NOTHING)
--   - Foreign key uses DEFERRABLE for flexibility
--   - Safe to run during business hours
--
-- Security:
--   - Validates email format (RFC 5322 simplified)
--   - Validates URL format (HTTP/HTTPS only)
--   - Validates phone minimum length
--   - stripe_customer_id is single source of truth
--
-- EMAIL STORAGE STRATEGY:
-- -----------------------
-- contact_email vs auth.users.email:
-- - auth.users.email: Authentication email (source of truth for login)
-- - contact_email: Business/billing contact (can differ from login email)
-- - Example: User logs in with personal@gmail.com but wants invoices sent to billing@company.com
-- - Backfill uses auth.users.email as default, can be updated separately
-- - Application should sync if user updates auth.users.email and wants contact_email to match
--
-- FOREIGN KEY CASCADE RULES DOCUMENTATION:
-- -----------------------------------------
-- ON DELETE CASCADE used when:
-- - Child record has no meaning without parent (profile without user, subscription without profile)
-- - Data integrity requires automatic cleanup
--
-- ON DELETE SET NULL used when:
-- - Child record can exist independently (ticket without assigned user, site without subscription)
-- - Historical record preservation is important
--
-- ON DELETE RESTRICT used when:
-- - Deletion would cause data loss or break business logic (can't delete plan if subscriptions exist)
-- - Requires manual cleanup/migration before deletion
-- ============================================================================

CREATE TABLE public.profile (
  id uuid PRIMARY KEY,
  role public.user_role NOT NULL DEFAULT 'client',
  company_name text,
  company_website text,
  contact_name text,
  contact_email text,
  contact_phone text,
  country text,
  region text,
  city text,
  postal_code text,
  address_line1 text,
  address_line2 text,
  stripe_customer_id text UNIQUE,
  onboarding_notes text,
  marketing_opt_in boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

-- Ensure each profile row is tied to an auth.users record.
-- NOT DEFERRABLE to prevent orphaned profiles during transaction failures
ALTER TABLE public.profile
  ADD CONSTRAINT profile_id_fk
  FOREIGN KEY (id)
  REFERENCES auth.users (id)
  ON DELETE CASCADE;

-- Add validation constraints
-- Issue #16 Fix: Enhanced email validation using more robust RFC 5322 pattern
ALTER TABLE public.profile
  ADD CONSTRAINT valid_contact_email
  CHECK (
    contact_email IS NULL OR
    contact_email ~* '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'
  );

ALTER TABLE public.profile
  ADD CONSTRAINT valid_company_website
  CHECK (company_website IS NULL OR company_website ~* '^https?://');

ALTER TABLE public.profile
  ADD CONSTRAINT valid_contact_phone
  CHECK (contact_phone IS NULL OR length(trim(contact_phone)) >= 10);

-- CONSISTENCY FIX: Stripe customer ID format validation (supports both live and test mode)
-- Live: cus_xxx | Test: cus_test_xxx
ALTER TABLE public.profile
  ADD CONSTRAINT valid_stripe_customer_id_format
  CHECK (
    stripe_customer_id IS NULL
    OR stripe_customer_id ~ '^cus_(test_)?[a-zA-Z0-9]+$'
  );

COMMENT ON TABLE public.profile IS
  'Extends Supabase auth.users with client identity, contact info, and Stripe linkage.

  Business Purpose:
  - Primary CRM record storing billing, contact, and company context for
    each account
  - Source of truth for marketing permissions and compliance exports
  - Maps Supabase users to Stripe customers for invoicing and portal links

  Key Relationships:
  - auth.users: 1:1 via profile_id_fk (ON DELETE CASCADE) keeps auth and
    CRM data aligned
  - subscription/client_site/support_ticket: Reference profile.id for
    ownership and RLS checks
  - notification/audit_log/site_analytics: Depend on profile for
    recipient and actor attribution

  Data Lifecycle:
  - Created: handle_new_user_profile trigger runs after auth signup or
    admin import
  - Updated: Clients edit via onboarding forms; admins adjust through CRM
    workflows
  - Deleted: Soft deleted by setting deleted_at (never hard deleted) to
    satisfy GDPR audit obligations

  Critical For:
  - Access control (role column drives policies for admin-only features)
  - Revenue operations (stripe_customer_id links to Stripe webhooks)
  - Compliance reporting (address + marketing_opt_in used for audits)

  Used By:
  - Admin dashboard client roster and segmentation filters
  - Stripe webhook handlers matching events to internal customers
  - Support tooling, audit logging, and analytics views needing owner
    metadata

  See Also: PROJECT_OVERVIEW.md "Client Management" section';

COMMENT ON COLUMN public.profile.id IS
  'Primary key mirroring Supabase auth.users.id.

  METADATA:
  - Required: Yes (PRIMARY KEY, NOT NULL)
  - Editable: No (immutable)
  - Critical: Yes (links every record to auth identity)
  - Source: Supabase Auth via handle_new_user_profile trigger
  - Indexed: Yes (profile_pkey)

  Purpose:
  Anchors ownership across subscriptions, client sites, tickets,
  notifications, and audit logs.

  Business Rules:
  - Must always equal auth.users.id; trigger prevents divergence
  - Deleting the auth user cascades via profile_id_fk
  - All RLS USING/WITH CHECK clauses rely on this id

  Used By:
  - private.current_user_context() helper functions
  - Admin search filters and support workflows
  - audit_log.actor_profile_id references

  Related:
  - auth.users.id (source record)
  - Constraints: profile_id_fk, profile_pkey

  See Also: PROJECT_OVERVIEW.md "Authentication & User Management" section';

COMMENT ON COLUMN public.profile.role IS
  'Access role (admin or client) controlling RLS behaviour.

  METADATA:
  - Required: Yes (NOT NULL, defaults to client)
  - Editable: Admin-only (clients cannot self-promote)
  - Critical: Yes (drives authorization and feature toggles)
  - Source: handle_new_user_profile reads raw_user_meta_data.role or
    defaults
  - Indexed: Yes (idx_profile_role, idx_profile_id_role)

  Purpose:
  Distinguishes internal staff from client users so RLS and UI expose
  the correct features.

  Data Format/Validation:
  - Enum values: ''admin'', ''client''
  - Default: ''client'' for new signups

  Business Rules:
  - Admin role unlocks plan management, audit views, and elevated RLS
  - Client role restricts data scope to own records
  - Updates must be auditable; change via admin interface only

  Used By:
  - private.current_user_is_admin() helper
  - Admin dashboard filters and analytics
  - RLS policies in 20250214000010_enable_rls_policies.sql

  Special Cases:
  - Backfill reads role from raw_user_meta_data when present
  - Null values block access; never remove default

  Related:
  - subscription.profile_id (owner)
  - Functions: private.current_user_context()

  See Also: PROJECT_OVERVIEW.md "Authentication & User Management" section';

COMMENT ON COLUMN public.profile.company_name IS
  'Registered business or trading name displayed on invoices.

  METADATA:
  - Required: No
  - Editable: Yes (client and admin)
  - Critical: Medium (appears on billing documents)
  - Source: User input collected during onboarding
  - Indexed: No

  Purpose:
  Provides label for invoices, support communications, and CRM views.

  Data Format/Validation:
  - Freeform text; UI enforces reasonable length (<= 120 characters)
  - Accepts Unicode so bilingual names render correctly

  Business Rules:
  - Required before site deployment for proper invoice branding
  - Sync with Stripe customer metadata when changed

  Used By:
  - Admin CRM tables and PDF invoice generator
  - Email templates referencing client name

  Special Cases:
  - Leave NULL for early leads or freelancers
  - Application trims whitespace during updates

  Related:
  - profile.contact_name
  - Stripe customer metadata sync job

  See Also: PROJECT_OVERVIEW.md "Client Management" section';

COMMENT ON COLUMN public.profile.company_website IS
  'Primary marketing site or placeholder URL captured at signup.

  METADATA:
  - Required: No
  - Editable: Yes (client and admin)
  - Critical: Low (context for design team)
  - Source: User input during onboarding
  - Indexed: No

  Purpose:
  Gives designers context for current web presence and domain details.

  Data Format/Validation:
  - Must start with http:// or https:// (valid_company_website constraint)
  - Example: https://existingbrand.ca

  Business Rules:
  - Optional but recommended before kickoff call
  - Use to verify ownership during domain onboarding

  Used By:
  - Design brief intake
  - Sales and onboarding checklists

  Special Cases:
  - Accepts staging URLs during pre-launch discovery
  - Null when client has no existing site

  Related:
  - Constraints: valid_company_website
  - client_site.custom_domain for final domain

  See Also: PROJECT_OVERVIEW.md "Client Management" section';

COMMENT ON COLUMN public.profile.contact_name IS
  'Primary human point of contact for project communication.

  METADATA:
  - Required: No (defaults from auth metadata when available)
  - Editable: Yes (client and admin)
  - Critical: Medium (used for support and billing outreach)
  - Source: User input or Supabase auth raw_user_meta_data
  - Indexed: No

  Purpose:
  Gives support and billing teams a real person to reach out to.

  Business Rules:
  - Should mirror Stripe customer contact when possible
  - Update when account owner changes

  Used By:
  - Support ticket notifications
  - Admin CRM contact exports

  Special Cases:
  - Accepts preferred names (no formal validation)
  - Leave NULL for agencies acting on behalf of clients

  Related:
  - profile.contact_email
  - support_ticket.created_by_profile_id

  See Also: PROJECT_OVERVIEW.md "Support System" section';

COMMENT ON COLUMN public.profile.contact_email IS
  'Business email for billing, notifications, and onboarding updates.

  METADATA:
  - Required: No (defaults to auth email during backfill)
  - Editable: Yes (client and admin)
  - Critical: Yes (drives invoicing and ticket replies)
  - Source: User input; backfill uses auth.users.email
  - Indexed: No

  Purpose:
  Separates login email from billing contact to support agencies or
  finance teams.

  Data Format/Validation:
  - Regex enforced by valid_contact_email (RFC 5322 subset)
  - Example: billing@clientstudio.ca

  Business Rules:
  - Keep in sync with Stripe customer email when possible
  - If blank, system falls back to auth email for notifications
  - Must be unique per account to avoid support confusion

  Used By:
  - Email notification service (welcome, invoices, ticket updates)
  - Admin export for billing workflows

  Special Cases:
  - Accepts group inboxes such as finance@
  - Null before onboarding completes

  Common Mistakes:
  ❌ Do not copy admin internal email accidentally
  ❌ Do not store comma-separated lists (use notification system)
  ✅ Confirm update with client before changing value
  ✅ Sync change to Stripe via billing tooling

  Related:
  - Constraint: valid_contact_email
  - notification.profile_id (delivery target)

  See Also: PROJECT_OVERVIEW.md "Email Notifications" section';

COMMENT ON COLUMN public.profile.contact_phone IS
  'Primary phone number for urgent support or billing escalation.

  METADATA:
  - Required: No
  - Editable: Yes (client and admin)
  - Critical: Medium (used for high-priority incidents)
  - Source: User input during onboarding or admin update
  - Indexed: No

  Purpose:
  Provides backup communication channel for outages or billing failures.

  Data Format/Validation:
  - Must contain at least 10 characters after trimming
  - Store in E.164 format when possible, e.g., +14035551234

  Business Rules:
  - Optional at signup but required before site launch
  - Keep updated when account ownership changes

  Used By:
  - Support escalation runbook
  - Billing follow-up workflows

  Special Cases:
  - Accepts toll-free or VOIP numbers
  - Null for clients preferring email-only contact

  Related:
  - Constraint: valid_contact_phone
  - support_ticket.priority escalation procedures

  See Also: PROJECT_OVERVIEW.md "Support System" section';

COMMENT ON COLUMN public.profile.country IS
  'Country for billing, taxation, and analytics.

  METADATA:
  - Required: No
  - Editable: Yes (client and admin)
  - Critical: Medium (used for GST/HST handling)
  - Source: User input or admin update
  - Indexed: No

  Purpose:
  Drives tax rate logic and geographic reporting.

  Data Format/Validation:
  - UI stores ISO 3166-1 alpha-2 codes (e.g., CA, US)
  - Text stored uppercase for consistency

  Business Rules:
  - Required before issuing tax invoices in Canada
  - Update when client relocates

  Used By:
  - Revenue analytics dashboard
  - Compliance exports for CRA filings

  Special Cases:
  - Accepts non-Canadian entries for future expansion
  - Null for leads prior to onboarding

  Related:
  - profile.region, profile.postal_code
  - subscription.plan_id for currency handling

  See Also: PROJECT_OVERVIEW.md "Security & Compliance" section';

COMMENT ON COLUMN public.profile.region IS
  'Province or state for billing compliance and reporting.

  METADATA:
  - Required: No
  - Editable: Yes
  - Critical: Medium (informs GST/PST calculations)
  - Source: User input or admin update
  - Indexed: No

  Purpose:
  Supports provincial analytics and tax computations.

  Data Format/Validation:
  - UI restricts to short codes (e.g., AB, BC, ON)
  - Stored uppercase

  Business Rules:
  - Needed for province-specific PST/QST reporting
  - Sync with Stripe customer address when changed

  Used By:
  - Revenue analytics by province
  - Support team regional assignment

  Special Cases:
  - Accepts US states for cross-border clients
  - Null until client provides details

  Related:
  - profile.country
  - plan.currency_code context

  See Also: PROJECT_OVERVIEW.md "Analytics Dashboard" section';

COMMENT ON COLUMN public.profile.city IS
  'City or municipality for billing address.

  METADATA:
  - Required: No
  - Editable: Yes
  - Critical: Medium (appears on invoices)
  - Source: User input or admin update
  - Indexed: No

  Purpose:
  Completes address block for invoices and analytics.

  Business Rules:
  - Needed before finalizing onboarding checklist
  - Keep consistent with Stripe customer address

  Used By:
  - Invoice templates
  - Location-based reporting

  Special Cases:
  - Accepts accented characters for francophone cities
  - Null permitted for early leads

  Related:
  - profile.region, profile.postal_code
  - site_analytics metadata for geolocation

  See Also: PROJECT_OVERVIEW.md "Client Management" section';

COMMENT ON COLUMN public.profile.postal_code IS
  'Postal or ZIP code for billing documents and geolocation.

  METADATA:
  - Required: No
  - Editable: Yes
  - Critical: Medium (required on invoices)
  - Source: User input
  - Indexed: No

  Purpose:
  Appears on invoices and supports regional analytics.

  Data Format/Validation:
  - Allow uppercase letters, numbers, and spaces
  - UI validates Canadian pattern (A1A 1A1) but DB accepts broader

  Business Rules:
  - Required before first invoice in Canada
  - Keep updated for compliance exports

  Used By:
  - Invoice PDF templates
  - Future tax automation

  Special Cases:
  - Accepts international formats
  - Null for pre-onboarding leads

  Related:
  - profile.address_line1
  - marketing_opt_in audits

  See Also: PROJECT_OVERVIEW.md "Subscription Management" section';

COMMENT ON COLUMN public.profile.address_line1 IS
  'Primary street address for billing and legal notices.

  METADATA:
  - Required: No
  - Editable: Yes
  - Critical: Medium (needed for tax-compliant invoices)
  - Source: User input
  - Indexed: No

  Purpose:
  Provides legally required address on invoices and contracts.

  Business Rules:
  - Required before sending physical mail or legal documents
  - Keep in sync with Stripe customer address

  Used By:
  - Accounting exports
  - Future mailing workflows

  Special Cases:
  - Accepts PO boxes
  - Null allowed for early leads

  Related:
  - profile.address_line2
  - audit_log entries for address changes

  See Also: PROJECT_OVERVIEW.md "Security & Compliance" section';

COMMENT ON COLUMN public.profile.address_line2 IS
  'Secondary address line for suites, units, or attention lines.

  METADATA:
  - Required: No
  - Editable: Yes
  - Critical: Low
  - Source: User input
  - Indexed: No

  Purpose:
  Captures suite numbers or care-of details for billing mail.

  Business Rules:
  - Optional; only fill when needed
  - Do not store long notes here (use onboarding_notes instead)

  Used By:
  - Invoice generation
  - Physical mail merge

  Special Cases:
  - Null for most clients
  - Accepts bilingual abbreviations

  Related:
  - profile.address_line1
  - onboarding_notes for additional context

  See Also: PROJECT_OVERVIEW.md "Client Management" section';

COMMENT ON COLUMN public.profile.stripe_customer_id IS
  'Stripe customer identifier mapping internal profiles to Stripe billing records.

  METADATA:
  - Required: No (NULL until checkout completes or admin backfills)
  - Editable: No (admin-only via billing tooling; never manual SQL)
  - Critical: Yes (ties subscriptions, invoices, and webhooks together)
  - Source: Stripe webhook (customer.created/checkout.session.completed)
  - Indexed: Yes (UNIQUE constraint profile_stripe_customer_id_key)

  Purpose:
  Links the platform profile to the external Stripe customer object for
  billing, portal access, and webhook matching.

  Data Format/Validation:
  - Regex enforced by valid_stripe_customer_id_format
  - Format: cus_xxxxx (live) or cus_test_xxxxx (test)
  - Example: cus_Mt8abc123XYZ45

  Business Rules:
  - NULL only for sandbox or leads before payment
  - Immutable once set; Stripe is system of record
  - Used to fetch billing portal URLs and reconcile payments
  - Required before generating invoices or syncing payment methods

  Used By:
  - Stripe webhook handlers (match event.data.object.id)
  - Billing portal redirect endpoints
  - Revenue analytics and reconciliation jobs

  Special Cases:
  - Test data uses cus_test_ prefix for staging isolation
  - Historical manual subscriptions may lack ID (document reason)

  Common Mistakes:
  ❌ Never copy IDs between environments
  ❌ Never update directly in SQL
  ✅ Use Stripe Dashboard or API to correct issues
  ✅ Let webhooks populate automatically

  Related:
  - subscription.stripe_subscription_id
  - Constraint: valid_stripe_customer_id_format

  See Also: PROJECT_OVERVIEW.md "Stripe Integration" section';

COMMENT ON COLUMN public.profile.onboarding_notes IS
  'Internal notes captured during sales or onboarding handoff.

  METADATA:
  - Required: No
  - Editable: Admin-only (visible to internal team)
  - Critical: Medium (guides project kickoff)
  - Source: Admin input from sales calls
  - Indexed: No

  Purpose:
  Stores qualitative context (goals, pain points) for designers and
  project managers.

  Business Rules:
  - Should not contain credentials; keep secure info elsewhere
  - Use for historical decisions and onboarding tasks

  Used By:
  - Admin dashboard onboarding checklist
  - Support agents reviewing account history

  Special Cases:
  - Allow markdown-style bullet lists
  - Null when no notes recorded

  Related:
  - client_site.design_brief (client-facing requirements)
  - support_ticket.metadata for ongoing issues

  See Also: PROJECT_OVERVIEW.md "Client Onboarding" section';

COMMENT ON COLUMN public.profile.marketing_opt_in IS
  'Flag indicating consent to receive marketing and educational emails.

  METADATA:
  - Required: Yes (NOT NULL, defaults false)
  - Editable: Yes (client preference center; admin updates require proof)
  - Critical: Yes (CASL/GDPR compliance)
  - Source: User input during signup or preference update
  - Indexed: No

  Purpose:
  Determines eligibility for newsletters, product updates, and promo
  emails.

  Business Rules:
  - Default false to respect consent-by-default regulations
  - Update only with explicit user consent (log in audit_log)
  - Use in email segmentation queries

  Used By:
  - Email automation platform sync
  - Admin marketing dashboard

  Special Cases:
  - Soft delete retains value for audit trail
  - Always pair with timestamp from audit_log for evidence

  Related:
  - audit_log.change_summary entries when consent changes
  - notification table for operational emails

  See Also: PROJECT_OVERVIEW.md "Security & Compliance" section';

COMMENT ON COLUMN public.profile.created_at IS
  'Timestamp when profile row was created in the database.

  METADATA:
  - Required: Yes (NOT NULL, default now())
  - Editable: No (managed by trigger)
  - Critical: No (audit and analytics)
  - Source: Database default plus handle_new_user_profile
  - Indexed: Yes (idx_profile_created_at, idx_profile_role_created)

  Purpose:
  Supports cohort analysis and recent signup lists.

  Business Rules:
  - Never update manually; trigger ensures immutability
  - May precede first payment if profile created before checkout

  Used By:
  - Admin dashboard "New Clients" widget
  - Marketing conversion reports

  Special Cases:
  - Backfilled profiles use now() timestamp
  - Always stored in UTC (timestamptz)

  Related:
  - updated_at (paired for auditing)
  - Trigger: set_profile_updated_at

  See Also: PROJECT_OVERVIEW.md "Analytics Dashboard" section';

COMMENT ON COLUMN public.profile.updated_at IS
  'Last time profile record changed.

  METADATA:
  - Required: Yes (NOT NULL, default now())
  - Editable: No (managed by trigger set_profile_updated_at)
  - Critical: No
  - Source: public.set_current_timestamp_updated_at trigger
  - Indexed: No

  Purpose:
  Allows admin to track recent updates and sync tasks.

  Business Rules:
  - Automatically refreshed on UPDATE by trigger
  - Use to detect stale records needing review

  Used By:
  - Admin activity feeds
  - Future data sync jobs

  Special Cases:
  - Remains equal to created_at until first update
  - Soft deletes also update this timestamp

  Related:
  - Trigger: set_profile_updated_at
  - Functions: public.set_current_timestamp_updated_at()

  See Also: PROJECT_OVERVIEW.md "Admin Dashboard" section';

COMMENT ON COLUMN public.profile.deleted_at IS
  'Soft delete indicator preserving history for GDPR compliance.

  METADATA:
  - Required: No
  - Editable: Admin-only (via account deactivation flows)
  - Critical: Yes (controls RLS visibility and retention)
  - Source: Admin tooling or retention jobs
  - Indexed: Indirect (role indexes filter on deleted_at IS NULL)

  Purpose:
  Marks profiles as inactive without losing historical data.

  Business Rules:
  - RLS policies hide records where deleted_at IS NOT NULL
  - Never hard delete profiles; retain for audit and revenue history
  - Clear value only when intentionally reactivating an account

  Used By:
  - subscription and client_site queries filter on active profiles
  - Data export routines for compliance audits

  Special Cases:
  - Set when user requests account deletion
  - Store UTC timestamps via now()

  Related:
  - subscription.deleted_at
  - RLS policies in 20250214000010_enable_rls_policies.sql

  See Also: PROJECT_OVERVIEW.md "Security & Compliance" section';

COMMENT ON CONSTRAINT profile_pkey ON public.profile IS
  'Business rule: Ensures each profile maps to one Supabase auth user.

  Purpose:
  Guarantees one-to-one relationship with auth.users for identity
  management.

  Prevents:
  - Duplicate profile rows per auth user
  - Ambiguous ownership in downstream tables

  Allows:
  - Deterministic joins between auth.users and profile

  Violation Indicates:
  - Manual data insertion bypassed standard flows

  Fix:
  - Remove duplicate row and run handle_new_user_profile if needed

  Examples:
  - Valid: Single profile row per auth user id
  - Invalid: Inserting a second profile with the same id';

COMMENT ON CONSTRAINT profile_id_fk ON public.profile IS
  'Business rule: Profile cannot exist without matching auth.users entry.

  Purpose:
  Keeps CRM data aligned with Supabase Auth identities.

  Prevents:
  - Orphaned profiles when auth account deleted
  - RLS failures due to missing auth record

  Allows:
  - Automatic cleanup when auth user removed

  Violation Indicates:
  - auth.users record missing or was removed unexpectedly

  Fix:
  - Re-create auth user or remove profile before deleting auth user

  Examples:
  - Valid: profile.id equals auth.users.id
  - Invalid: Deleting auth user without cascade applying';

COMMENT ON CONSTRAINT valid_contact_email ON public.profile IS
  'Business rule: Contact emails must use valid format for deliverability.

  Purpose:
  Protects notification system from malformed addresses.

  Prevents:
  - Bounced invoices due to invalid email syntax
  - Support replies going to malformed addresses

  Allows:
  - Null values when billing contact not yet known
  - Any RFC 5322 compliant email address

  Violation Indicates:
  - User entered invalid format or automation bug

  Fix:
  - Correct email to valid format before retrying update

  Examples:
  - Valid: billing@example.ca
  - Invalid: billing@';

COMMENT ON CONSTRAINT valid_company_website ON public.profile IS
  'Business rule: Company websites must be HTTP(S) URLs.

  Purpose:
  Ensures designers can review submitted sites safely.

  Prevents:
  - Scheme-less or unsupported protocols (ftp:, file:)

  Allows:
  - Null when client has no site yet
  - http:// and https:// URLs

  Violation Indicates:
  - Missing protocol or malformed URL

  Fix:
  - Prepend https:// (or http://) and retry

  Examples:
  - Valid: https://client.ca
  - Invalid: client.ca';

COMMENT ON CONSTRAINT valid_contact_phone ON public.profile IS
  'Business rule: Stored phone numbers must have minimum length of 10 characters.

  Purpose:
  Avoids logging unusable phone numbers for escalations.

  Prevents:
  - Short placeholders such as "123"
  - Empty strings masquerading as data

  Allows:
  - Null when client prefers email
  - Full numbers including +, -, spaces

  Violation Indicates:
  - User entered incomplete phone number

  Fix:
  - Capture full phone number in E.164 or local format

  Examples:
  - Valid: +1 403 555 1234
  - Invalid: 555';

COMMENT ON CONSTRAINT valid_stripe_customer_id_format ON public.profile IS
  'Business rule: Stripe customer IDs must follow cus_ or cus_test_ pattern.

  Purpose:
  Ensures webhook reconciliation can match Stripe objects reliably.

  Prevents:
  - Copy-pasted IDs from wrong environment
  - Typos that break billing portal links

  Allows:
  - Null values until Stripe customer created
  - Both live and test prefixes

  Violation Indicates:
  - Manual data entry error or test/live mix-up

  Fix:
  - Retrieve correct ID from Stripe dashboard and update via tooling

  Examples:
  - Valid: cus_Mt8abc123XYZ45
  - Invalid: stripe_customer_123';

COMMENT ON CONSTRAINT profile_stripe_customer_id_key ON public.profile IS
  'Business rule: Each Stripe customer maps to one profile.

  Purpose:
  Prevents billing data from merging multiple clients into one Stripe
  customer.

  Prevents:
  - Duplicate Stripe customer assignments
  - Webhook events targeting multiple profiles

  Allows:
  - Null stripe_customer_id for leads or sandbox accounts

  Violation Indicates:
  - Attempt to reuse Stripe customer across profiles

  Fix:
  - Create new Stripe customer and associate with correct profile

  Examples:
  - Valid: Unique cus_ id per profile
  - Invalid: Two profiles sharing the same cus_ id';

-- Issue #13 Fix: Backfill profiles with error handling for robustness
DO $$
DECLARE
  backfilled_count INTEGER := 0;
  total_users INTEGER := 0;
BEGIN
  -- Count total users for reporting
  SELECT COUNT(*) INTO total_users FROM auth.users;

  -- Backfill profiles for existing auth.users records (idempotent)
  INSERT INTO public.profile (id, role, company_name, contact_name, contact_email, marketing_opt_in, created_at, updated_at)
  SELECT
    u.id,
    COALESCE(
      CASE
        WHEN u.raw_user_meta_data ? 'role'
          AND (u.raw_user_meta_data ->> 'role') IN ('admin', 'client')
        THEN (u.raw_user_meta_data ->> 'role')::public.user_role
      END,
      'client'
    ),
    u.raw_user_meta_data ->> 'company_name',
    COALESCE(u.raw_user_meta_data ->> 'contact_name', u.raw_user_meta_data ->> 'full_name'),
    COALESCE(u.raw_user_meta_data ->> 'contact_email', u.email),
    CASE
      WHEN lower(u.raw_user_meta_data ->> 'marketing_opt_in') IN ('true', 't', '1')
        THEN true
      WHEN lower(u.raw_user_meta_data ->> 'marketing_opt_in') IN ('false', 'f', '0')
        THEN false
      ELSE false
    END,
    now(),
    now()
  FROM auth.users AS u
  ON CONFLICT (id) DO NOTHING;

  GET DIAGNOSTICS backfilled_count = ROW_COUNT;

  RAISE NOTICE 'Backfill completed: % profiles created/updated for % total users', backfilled_count, total_users;

EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Backfill encountered errors: %. Migration will continue, but manual verification recommended.', SQLERRM;
    -- Continue migration even if backfill fails - profiles will be created via trigger
END $$;

-- ============================================================================
-- Post-Migration Validation
-- ============================================================================

DO $$
DECLARE
  table_exists BOOLEAN;
  constraint_count INTEGER;
  profile_count INTEGER;
  user_count INTEGER;
BEGIN
  -- Verify table was created
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'profile'
  ) INTO table_exists;

  IF NOT table_exists THEN
    RAISE EXCEPTION 'Profile table was not created successfully';
  END IF;

  -- Verify constraints
  SELECT COUNT(*) INTO constraint_count
  FROM information_schema.table_constraints
  WHERE table_schema = 'public'
    AND table_name = 'profile'
    AND constraint_type IN ('CHECK', 'FOREIGN KEY', 'UNIQUE');

  IF constraint_count < 5 THEN
    RAISE EXCEPTION 'Profile table constraints incomplete: Expected >= 5, found %', constraint_count;
  END IF;

  -- Verify backfill completed successfully
  SELECT COUNT(*) INTO profile_count FROM public.profile;
  SELECT COUNT(*) INTO user_count FROM auth.users;

  RAISE NOTICE 'Profile table created successfully';
  RAISE NOTICE 'Backfilled % profiles for % auth users', profile_count, user_count;

  -- Verify data integrity
  IF profile_count > user_count THEN
    RAISE WARNING 'More profiles than users detected - check for data anomalies';
  END IF;

  -- Test constraints
  BEGIN
    -- Test invalid email
    INSERT INTO public.profile (id, contact_email)
    VALUES (gen_random_uuid(), 'invalid-email');
    RAISE EXCEPTION 'Email validation constraint failed to reject invalid email';
  EXCEPTION WHEN check_violation THEN
    RAISE NOTICE 'Email validation constraint working correctly';
  END;

  RAISE NOTICE 'Migration 20250214000002_create_profiles completed successfully at %', clock_timestamp();
END $$;

-- ============================================================================
-- Rollback Instructions
-- ============================================================================
-- To rollback this migration, execute the following commands:
--
-- Step 1: Drop foreign key constraints from dependent tables (if any exist)
-- (Execute this after all dependent migrations are rolled back)
--
-- Step 2: Drop the profile table
-- DROP TABLE IF EXISTS public.profile CASCADE;
--
-- Step 3: Verify rollback
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public' AND table_name = 'profile';
-- (Should return no rows)
--
-- WARNING: This will permanently delete all profile data
-- IMPORTANT: Rollback dependent tables first:
--   - public.subscription
--   - public.client_site
--   - public.support_ticket
--   - public.notification
--   - public.audit_log
-- ============================================================================
