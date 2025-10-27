-- ============================================================================
-- Migration: Create client site lifecycle tracking.
-- Records deployment details, domains, and production status per subscription.
-- ============================================================================
--
-- NORMALIZATION NOTES:
-- --------------------
-- This table contains intentional denormalization:
--
-- 1. plan_id is stored alongside subscription_id (redundant)
--    Rationale:
--    - Historical tracking: If subscription changes plans, site retains original plan
--    - Subscription can be deleted (SET NULL), but we want to remember the plan
--    - Avoids JOIN when displaying site details
--    - Trade-off: Update anomaly risk vs query simplicity
--
-- 2. Soft delete pattern: deleted_at instead of archived_at
--    - Consistent with profile and subscription tables
--    - 'archived' status still available via status enum
-- ============================================================================

CREATE TABLE public.client_site (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  subscription_id uuid,
  plan_id uuid,  -- Intentional denormalization - see notes above
  site_name text NOT NULL,
  slug text,
  deployment_url text,
  custom_domain text,
  status public.site_status NOT NULL DEFAULT 'pending',
  deployment_notes text,
  design_brief jsonb NOT NULL DEFAULT '{}'::jsonb,
  deployed_at timestamptz,
  last_revision_at timestamptz,
  deleted_at timestamptz,  -- FIXED: Renamed from archived_at for soft delete consistency
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.client_site
  ADD CONSTRAINT client_site_profile_fk
  FOREIGN KEY (profile_id)
  REFERENCES public.profile (id)
  ON DELETE CASCADE;

ALTER TABLE public.client_site
  ADD CONSTRAINT client_site_subscription_fk
  FOREIGN KEY (subscription_id)
  REFERENCES public.subscription (id)
  ON DELETE SET NULL;

ALTER TABLE public.client_site
  ADD CONSTRAINT client_site_plan_fk
  FOREIGN KEY (plan_id)
  REFERENCES public.plan (id)
  ON DELETE SET NULL;

CREATE UNIQUE INDEX client_site_slug_unique
  ON public.client_site (slug)
  WHERE slug IS NOT NULL;

-- Add URL validation constraints
ALTER TABLE public.client_site
  ADD CONSTRAINT valid_deployment_url
  CHECK (deployment_url IS NULL OR deployment_url ~* '^https?://');

ALTER TABLE public.client_site
  ADD CONSTRAINT valid_custom_domain
  CHECK (custom_domain IS NULL OR custom_domain ~* '^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$');

-- Issue #6 Fix: Ensure live sites have deployment timestamp
ALTER TABLE public.client_site
  ADD CONSTRAINT valid_live_status
  CHECK (
    status != 'live' OR
    (status = 'live' AND deployed_at IS NOT NULL)
  );

-- Ensure design_brief is a JSON object
ALTER TABLE public.client_site
  ADD CONSTRAINT design_brief_is_object
  CHECK (jsonb_typeof(design_brief) = 'object');

COMMENT ON TABLE public.client_site IS
  'Tracks the lifecycle of websites delivered to subscription clients.

IMPORTANT FOR APPLICATION DEVELOPERS:
- Always filter by profile_id explicitly: .eq("profile_id", userId)
- Check can_create_site() before allowing site creation
- Soft delete pattern: Use deleted_at IS NULL in queries
- See subscription.page_limit for site count restrictions';

COMMENT ON COLUMN public.client_site.design_brief IS
  'Client design requirements and preferences. Expected structure: {"colors": ["#hex"], "style": "modern|classic|minimal", "references": ["url"], "notes": "text"}';

COMMENT ON COLUMN public.client_site.plan_id IS
  'DENORMALIZED: Stores the plan at site creation time. May differ from subscription.plan_id if subscription upgrades/downgrades. Preserves historical plan information even if subscription is deleted.';

COMMENT ON COLUMN public.client_site.subscription_id IS
  'Nullable reference to active subscription. Can be NULL if subscription ends but site remains (SET NULL on delete). Check subscription.plan_id for current plan, check client_site.plan_id for original plan.';
