-- ============================================================================
-- Migration: Create shared PostgreSQL extensions and enumerated types
-- Description: Ensures consistent domain values across the SaaS platform schema
-- Author: Database Architecture Team
-- Date: 2025-02-14
--
-- Dependencies: None (first migration)
--
-- Deployment Strategy: Safe for zero-downtime deployment
--   - Creating extensions and enums is non-blocking
--   - No table locks or data migration required
--   - Can be applied during business hours
-- ============================================================================

-- Enable required extensions for UUID generation if not already available.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Validate extension creation
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto') THEN
    RAISE EXCEPTION 'Failed to create pgcrypto extension';
  END IF;
  RAISE NOTICE 'Extension pgcrypto verified successfully';
END $$;

-- Issue #9 Fix: Use CREATE TYPE IF NOT EXISTS for cleaner code (PostgreSQL 9.5+)
CREATE TYPE IF NOT EXISTS public.user_role AS ENUM ('admin', 'client');

CREATE TYPE IF NOT EXISTS public.subscription_status AS ENUM (
  'trialing',
  'active',
  'past_due',
  'canceled',
  'incomplete',
  'unpaid'
);

CREATE TYPE IF NOT EXISTS public.site_status AS ENUM (
  'pending',
  'in_production',
  'awaiting_client_content',
  'ready_for_review',
  'live',
  'paused',
  'archived'
);

CREATE TYPE IF NOT EXISTS public.ticket_status AS ENUM (
  'open',
  'in_progress',
  'awaiting_client',
  'resolved',
  'closed'
);

CREATE TYPE IF NOT EXISTS public.ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TYPE IF NOT EXISTS public.ticket_category AS ENUM (
  'technical',
  'content_change',
  'general_inquiry',
  'billing'
);

CREATE TYPE IF NOT EXISTS public.notification_type AS ENUM (
  'subscription',
  'billing',
  'support',
  'site_status',
  'system',
  'onboarding'
);

-- ============================================================================
-- Post-Migration Validation
-- ============================================================================

DO $$
DECLARE
  enum_count INTEGER;
BEGIN
  -- Verify all enums were created successfully
  SELECT COUNT(*) INTO enum_count
  FROM pg_type
  WHERE typname IN (
    'user_role',
    'subscription_status',
    'site_status',
    'ticket_status',
    'ticket_priority',
    'ticket_category',
    'notification_type'
  );

  IF enum_count != 7 THEN
    RAISE EXCEPTION 'Enum validation failed: Expected 7 enums, found %', enum_count;
  END IF;

  RAISE NOTICE 'All 7 enum types created and verified successfully';
  RAISE NOTICE 'Migration 20250214000001_create_enums completed successfully at %', clock_timestamp();
END $$;

-- ============================================================================
-- Rollback Instructions
-- ============================================================================
-- To rollback this migration, execute the following commands in reverse order:
--
-- DROP TYPE IF EXISTS public.notification_type CASCADE;
-- DROP TYPE IF EXISTS public.ticket_category CASCADE;
-- DROP TYPE IF EXISTS public.ticket_priority CASCADE;
-- DROP TYPE IF EXISTS public.ticket_status CASCADE;
-- DROP TYPE IF EXISTS public.site_status CASCADE;
-- DROP TYPE IF EXISTS public.subscription_status CASCADE;
-- DROP TYPE IF EXISTS public.user_role CASCADE;
-- DROP EXTENSION IF EXISTS pgcrypto CASCADE;
--
-- WARNING: Rollback will fail if any tables are using these enum types.
-- Ensure dependent tables are dropped first or migrate data to new types.
-- ============================================================================
