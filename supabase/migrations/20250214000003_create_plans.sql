-- Migration: Create subscription plan catalog.
-- Holds SaaS pricing tiers and associated metadata used by Stripe.

CREATE TABLE public.plan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  stripe_price_id_monthly text UNIQUE,
  stripe_price_id_yearly text UNIQUE,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  page_limit smallint,
  revision_limit smallint,
  setup_fee_cents integer,
  currency_code text NOT NULL DEFAULT 'CAD',
  is_active boolean NOT NULL DEFAULT true,
  sort_order smallint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.plan
  ADD CONSTRAINT plan_currency_check
  CHECK (char_length(currency_code) = 3);

-- Add validation for positive values
ALTER TABLE public.plan
  ADD CONSTRAINT plan_positive_limits_check
  CHECK (
    (page_limit IS NULL OR page_limit > 0) AND
    (revision_limit IS NULL OR revision_limit > 0) AND
    (setup_fee_cents IS NULL OR setup_fee_cents >= 0)
  );

-- Issue #8 Fix: Ensure features column is always a JSON array with valid structure
ALTER TABLE public.plan
  ADD CONSTRAINT features_is_array
  CHECK (jsonb_typeof(features) = 'array');

-- Validate features array structure (each element must be object with 'name' string)
ALTER TABLE public.plan
  ADD CONSTRAINT features_valid_structure
  CHECK (
    jsonb_typeof(features) = 'array'
    AND (
      jsonb_array_length(features) = 0
      OR NOT EXISTS (
        SELECT 1
        FROM jsonb_array_elements(features) AS elem
        WHERE NOT (
          jsonb_typeof(elem) = 'object'
          AND elem ? 'name'
          AND jsonb_typeof(elem->'name') = 'string'
        )
      )
    )
  );

-- CONSISTENCY FIX: Stripe price ID format validation (supports both live and test mode)
-- Live: price_xxx | Test: price_test_xxx
ALTER TABLE public.plan
  ADD CONSTRAINT valid_stripe_price_monthly_format
  CHECK (
    stripe_price_id_monthly IS NULL
    OR stripe_price_id_monthly ~ '^price_(test_)?[a-zA-Z0-9]+$'
  );

ALTER TABLE public.plan
  ADD CONSTRAINT valid_stripe_price_yearly_format
  CHECK (
    stripe_price_id_yearly IS NULL
    OR stripe_price_id_yearly ~ '^price_(test_)?[a-zA-Z0-9]+$'
  );

-- CONSISTENCY FIX: Ensure at least one price ID is provided for active plans
ALTER TABLE public.plan
  ADD CONSTRAINT plan_requires_price_id
  CHECK (
    is_active = false
    OR stripe_price_id_monthly IS NOT NULL
    OR stripe_price_id_yearly IS NOT NULL
  );

-- NORMALIZATION CONSIDERATION:
-- ----------------------------
-- The features JSONB column is denormalized for flexibility and performance.
--
-- Normalized alternative would be:
-- CREATE TABLE plan_feature (
--   id uuid PRIMARY KEY,
--   plan_id uuid REFERENCES plan(id),
--   feature_name text NOT NULL,
--   feature_value jsonb,
--   sort_order smallint
-- );
--
-- Current design trade-offs:
-- ✅ Pros: Fast retrieval, flexible structure, easy to display
-- ❌ Cons: Harder to query individual features, no referential integrity
--
-- Decision: Keep JSONB for now due to simple feature structure and infrequent queries
-- Recommendation: If you need to filter/search by individual features, normalize

-- SOFT DELETE PATTERN NOTE:
-- -------------------------
-- This table does NOT have soft delete (deleted_at column) by design:
-- - Plans should never be deleted, only deactivated (is_active = false)
-- - Historical subscription records reference plan_id (ON DELETE RESTRICT)
-- - Deactivated plans remain queryable for reporting and historical data
-- - Use is_active filter instead of deleted_at for active plan queries

COMMENT ON TABLE public.plan IS
  'Subscription plan definitions with Stripe price references and feature flags.';

COMMENT ON COLUMN public.plan.features IS
  'Feature list as JSON array. Expected structure: [{"name": string, "description": string, "included": boolean}]. Example: [{"name": "Custom Domain", "description": "Use your own domain name", "included": true}]';
