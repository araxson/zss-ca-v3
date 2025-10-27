-- Migration: Create subscription records linking clients to plans.
-- Tracks Stripe billing identifiers, lifecycle state, and billing periods.

CREATE TABLE public.subscription (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  plan_id uuid NOT NULL,
  -- stripe_customer_id removed - stored in profile table as single source of truth
  stripe_subscription_id text UNIQUE,
  status public.subscription_status NOT NULL DEFAULT 'trialing',
  trial_start timestamptz,
  trial_end timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  canceled_at timestamptz,
  renewal_behavior text,
  billing_reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

ALTER TABLE public.subscription
  ADD CONSTRAINT subscription_profile_fk
  FOREIGN KEY (profile_id)
  REFERENCES public.profile (id)
  ON DELETE CASCADE;

ALTER TABLE public.subscription
  ADD CONSTRAINT subscription_plan_fk
  FOREIGN KEY (plan_id)
  REFERENCES public.plan (id)
  ON DELETE RESTRICT;

ALTER TABLE public.subscription
  ADD CONSTRAINT subscription_period_check
  CHECK (
    current_period_start IS NULL
    OR current_period_end IS NULL
    OR current_period_end > current_period_start
  );

-- Add validation for trial dates
ALTER TABLE public.subscription
  ADD CONSTRAINT subscription_trial_dates_check
  CHECK (
    trial_start IS NULL
    OR trial_end IS NULL
    OR trial_end > trial_start
  );

-- Issue #7 Fix: Ensure cancellation data integrity
ALTER TABLE public.subscription
  ADD CONSTRAINT subscription_canceled_consistency
  CHECK (
    canceled_at IS NULL OR status IN ('canceled', 'unpaid')
  );

-- CONSISTENCY FIX: Ensure cancel_at is in the future when set
ALTER TABLE public.subscription
  ADD CONSTRAINT subscription_cancel_at_future
  CHECK (
    cancel_at IS NULL
    OR cancel_at > created_at
  );

-- CONSISTENCY FIX: Trialing subscriptions must have trial_end set
ALTER TABLE public.subscription
  ADD CONSTRAINT subscription_trialing_requires_trial_end
  CHECK (
    status != 'trialing'
    OR (status = 'trialing' AND trial_end IS NOT NULL)
  );

-- CONSISTENCY FIX: Stripe subscription ID format validation (supports both live and test mode)
-- Live: sub_xxx | Test: sub_test_xxx
ALTER TABLE public.subscription
  ADD CONSTRAINT valid_stripe_subscription_id_format
  CHECK (
    stripe_subscription_id IS NULL
    OR stripe_subscription_id ~ '^sub_(test_)?[a-zA-Z0-9]+$'
  );

-- Ensure metadata is a JSON object
ALTER TABLE public.subscription
  ADD CONSTRAINT metadata_is_object
  CHECK (jsonb_typeof(metadata) = 'object');

COMMENT ON TABLE public.subscription IS
  'Active and historical subscription agreements, synchronized with Stripe webhooks.

IMPORTANT FOR APPLICATION DEVELOPERS:
- Always add explicit filters in queries even though RLS protects data
- Example: .eq("profile_id", userId) in addition to RLS
- This improves query performance by 30-50%
- See: https://supabase.com/docs/guides/database/postgres/row-level-security#performance';

COMMENT ON COLUMN public.subscription.metadata IS
  'Flexible metadata from Stripe webhooks. Structure varies by subscription type. Contains Stripe-specific data like payment method details, discount codes, tax IDs, etc.';
