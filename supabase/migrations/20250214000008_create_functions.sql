-- ============================================================================
-- Migration: Define reusable database functions for triggers and RLS helpers
-- Description: Creates performance-optimized helper functions for the application
-- Author: Database Architecture Team
-- Date: 2025-02-14
--
-- Dependencies:
--   - 20250214000002_create_profiles.sql (profile table)
--   - 20250214000006_create_support_system.sql (support_ticket table)
--   - 20250214000007_create_optional_modules.sql (audit_log table)
--
-- Functions Created:
--   1. set_current_timestamp_updated_at() - Auto-update timestamps
--   2. handle_new_user_profile() - Auto-create profiles for new users
--   3. touch_support_ticket_reply() - Update ticket activity timestamps
--   4. current_user_is_admin() - RLS helper for admin checks
--   5. audit_table_changes() - Comprehensive audit logging
--
-- Performance Notes:
--   - All functions use STABLE where appropriate for query optimization
--   - auth.uid() wrapped in SELECT for single evaluation
--   - SECURITY DEFINER used only where necessary
--
-- Security:
--   - All SECURITY DEFINER functions use explicit search_path
--   - Admin checks include soft-delete filtering
-- ============================================================================

CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.set_current_timestamp_updated_at IS
  'Keeps updated_at columns in sync on row updates.';

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inferred_role public.user_role := 'client';
BEGIN
  IF NEW.raw_user_meta_data ? 'role' THEN
    inferred_role := COALESCE(
      (NEW.raw_user_meta_data ->> 'role')::public.user_role,
      'client'
    );
  END IF;

  INSERT INTO public.profile (id, role, company_name, contact_name, contact_email, marketing_opt_in, created_at, updated_at)
  VALUES (
    NEW.id,
    inferred_role,
    NEW.raw_user_meta_data ->> 'company_name',
    COALESCE(NEW.raw_user_meta_data ->> 'contact_name', NEW.raw_user_meta_data ->> 'full_name'),
    COALESCE(NEW.raw_user_meta_data ->> 'contact_email', NEW.email),
    COALESCE((NEW.raw_user_meta_data ->> 'marketing_opt_in')::boolean, false),
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE
    SET role = EXCLUDED.role,
        company_name = COALESCE(EXCLUDED.company_name, public.profile.company_name),
        contact_name = COALESCE(EXCLUDED.contact_name, public.profile.contact_name),
        contact_email = COALESCE(EXCLUDED.contact_email, public.profile.contact_email),
        updated_at = now();

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user_profile IS
  'Automatically provisions a profile row when a new auth user is created.';

CREATE OR REPLACE FUNCTION public.touch_support_ticket_reply()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.support_ticket
    SET last_reply_at = now(),
        updated_at = now()
  WHERE id = NEW.support_ticket_id;

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.touch_support_ticket_reply IS
  'Updates support ticket activity timestamps when replies are added.';

CREATE OR REPLACE FUNCTION private.current_user_is_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor uuid := (SELECT auth.uid());
BEGIN
  IF actor IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.profile p
    WHERE p.id = actor
      AND p.role = 'admin'
      AND p.deleted_at IS NULL
  );
END;
$$;

COMMENT ON FUNCTION private.current_user_is_admin IS
  'Helper used by RLS policies and admin routines to grant elevated privileges without triggering recursive security checks.';

-- Issue #3 Fix: Optimized helper function for ticket RLS policies
CREATE OR REPLACE FUNCTION private.user_ticket_ids()
RETURNS UUID[]
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor uuid := (SELECT auth.uid());
BEGIN
  IF actor IS NULL THEN
    RETURN ARRAY[]::UUID[];
  END IF;

  RETURN ARRAY(
    SELECT id
    FROM public.support_ticket
    WHERE profile_id = actor
       OR created_by_profile_id = actor
       OR assigned_to_profile_id = actor
  );
END;
$$;

COMMENT ON FUNCTION private.user_ticket_ids IS
  'Performance-optimized helper for ticket RLS policies. Returns array of ticket IDs the current user can access. Avoids JOIN overhead in RLS policy evaluation.';

-- Optimized helper that returns both user ID and admin status in one call
CREATE OR REPLACE FUNCTION private.current_user_context()
RETURNS TABLE (user_id UUID, is_admin BOOLEAN)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor uuid := (SELECT auth.uid());
  admin_status boolean := false;
BEGIN
  IF actor IS NULL THEN
    RETURN QUERY SELECT NULL::UUID, false;
    RETURN;
  END IF;

  -- Single query to get both user ID and admin status
  SELECT (p.role = 'admin' AND p.deleted_at IS NULL)
  INTO admin_status
  FROM public.profile p
  WHERE p.id = actor;

  RETURN QUERY SELECT actor, COALESCE(admin_status, false);
END;
$$;

COMMENT ON FUNCTION private.current_user_context IS
  'Performance-optimized helper that returns user ID and admin status in a single call. Eliminates duplicate database queries in RLS policies with both USING and WITH CHECK clauses.';

-- Helper function for site_analytics RLS - returns array of site IDs user owns
CREATE OR REPLACE FUNCTION private.user_client_site_ids()
RETURNS UUID[]
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor uuid := (SELECT auth.uid());
BEGIN
  IF actor IS NULL THEN
    RETURN ARRAY[]::UUID[];
  END IF;

  -- Direct filter, no JOIN - runs with SECURITY DEFINER to bypass RLS
  RETURN ARRAY(
    SELECT id
    FROM public.client_site
    WHERE profile_id = actor
  );
END;
$$;

COMMENT ON FUNCTION private.user_client_site_ids IS
  'Performance-optimized helper for site_analytics RLS policies. Returns array of client site IDs the current user owns. Avoids JOIN overhead in RLS policy evaluation.';

-- Audit trigger function for tracking changes
CREATE OR REPLACE FUNCTION public.audit_table_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  actor uuid := (SELECT auth.uid());
  owner uuid := NULL;
  target uuid := CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END;
  new_state jsonb;
  old_state jsonb;
BEGIN
  -- SECURITY: Validate this is being called from a trigger context
  IF TG_TABLE_NAME IS NULL THEN
    RAISE EXCEPTION 'audit_table_changes can only be called from a trigger context';
  END IF;

  -- Validate actor exists and is not soft-deleted
  IF actor IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.profile p WHERE p.id = actor AND p.deleted_at IS NULL
  ) THEN
    actor := NULL;
  END IF;

  -- Issue #11 Fix: Try multiple ownership column patterns for better audit trail
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    new_state := to_jsonb(NEW);

    -- Try common ownership column patterns
    IF new_state ? 'profile_id' AND new_state ->> 'profile_id' IS NOT NULL THEN
      owner := (new_state ->> 'profile_id')::uuid;
    ELSIF new_state ? 'user_id' AND new_state ->> 'user_id' IS NOT NULL THEN
      owner := (new_state ->> 'user_id')::uuid;
    ELSIF new_state ? 'created_by' AND new_state ->> 'created_by' IS NOT NULL THEN
      owner := (new_state ->> 'created_by')::uuid;
    ELSE
      -- For tables like 'plan' without ownership, owner remains NULL (admin-managed)
      owner := NULL;
    END IF;
  END IF;

  IF owner IS NULL AND TG_OP IN ('UPDATE', 'DELETE') THEN
    old_state := to_jsonb(OLD);

    -- Try common ownership column patterns
    IF old_state ? 'profile_id' AND old_state ->> 'profile_id' IS NOT NULL THEN
      owner := (old_state ->> 'profile_id')::uuid;
    ELSIF old_state ? 'user_id' AND old_state ->> 'user_id' IS NOT NULL THEN
      owner := (old_state ->> 'user_id')::uuid;
    ELSIF old_state ? 'created_by' AND old_state ->> 'created_by' IS NOT NULL THEN
      owner := (old_state ->> 'created_by')::uuid;
    END IF;
  END IF;

  IF owner IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.profile p WHERE p.id = owner AND p.deleted_at IS NULL
  ) THEN
    owner := NULL;
  END IF;

  INSERT INTO public.audit_log (
    actor_profile_id,
    profile_id,
    action,
    resource_table,
    resource_id,
    change_summary,
    created_at
  ) VALUES (
    actor,
    owner,
    TG_OP,
    TG_TABLE_NAME,
    target,
    CASE
      WHEN TG_OP = 'DELETE' THEN jsonb_build_object('deleted', to_jsonb(OLD))
      WHEN TG_OP = 'UPDATE' THEN jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
      ELSE jsonb_build_object('created', to_jsonb(NEW))
    END,
    now()
  );

  RETURN CASE
    WHEN TG_OP = 'DELETE' THEN OLD
    ELSE NEW
  END;
END;
$$;

COMMENT ON FUNCTION public.audit_table_changes IS
  'Automatically logs all INSERT, UPDATE, DELETE operations to audit_log table for compliance tracking.';

-- ============================================================================
-- Post-Migration Validation
-- ============================================================================

DO $$
DECLARE
  function_count INTEGER;
  function_names TEXT[];
BEGIN
  -- Verify all functions were created (including private schema functions)
  SELECT COUNT(*) INTO function_count
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE (n.nspname = 'public' AND proname IN (
      'set_current_timestamp_updated_at',
      'handle_new_user_profile',
      'touch_support_ticket_reply',
      'audit_table_changes'
    ))
    OR (n.nspname = 'private' AND proname IN (
      'current_user_is_admin',
      'user_ticket_ids',
      'current_user_context',
      'user_client_site_ids'
    ));

  -- FIX: Updated to expect 8 functions (4 public + 4 private)
  IF function_count != 8 THEN
    RAISE EXCEPTION 'Function creation incomplete: Expected 8 functions, found %', function_count;
  END IF;

  -- Verify function properties
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'private'
      AND proname = 'current_user_is_admin'
      AND provolatile = 's' -- STABLE
  ) THEN
    RAISE WARNING 'current_user_is_admin function should be marked as STABLE';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'private'
      AND proname = 'user_ticket_ids'
      AND provolatile = 's' -- STABLE
  ) THEN
    RAISE WARNING 'user_ticket_ids function should be marked as STABLE';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'private'
      AND proname = 'current_user_context'
      AND provolatile = 's' -- STABLE
  ) THEN
    RAISE WARNING 'current_user_context function should be marked as STABLE';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'private'
      AND proname = 'user_client_site_ids'
      AND provolatile = 's' -- STABLE
  ) THEN
    RAISE WARNING 'user_client_site_ids function should be marked as STABLE';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
      AND proname = 'handle_new_user_profile'
      AND prosecdef = true -- SECURITY DEFINER
  ) THEN
    RAISE EXCEPTION 'handle_new_user_profile must be SECURITY DEFINER';
  END IF;

  RAISE NOTICE 'All 8 database functions created and validated successfully';
  RAISE NOTICE 'Migration 20250214000008_create_functions completed successfully at %', clock_timestamp();
END $$;

-- ============================================================================
-- Rollback Instructions
-- ============================================================================
-- To rollback this migration, execute the following commands:
--
-- Step 1: Drop triggers that use these functions first
-- (Execute this after migration 20250214000009_create_triggers is rolled back)
--
-- Step 2: Drop functions in reverse dependency order
-- DROP FUNCTION IF EXISTS public.audit_table_changes() CASCADE;
-- DROP FUNCTION IF EXISTS private.current_user_is_admin() CASCADE;
-- DROP FUNCTION IF EXISTS public.touch_support_ticket_reply() CASCADE;
-- DROP FUNCTION IF EXISTS public.handle_new_user_profile() CASCADE;
-- DROP FUNCTION IF EXISTS public.set_current_timestamp_updated_at() CASCADE;
--
-- Step 3: Verify rollback
-- SELECT proname FROM pg_proc p
-- JOIN pg_namespace n ON p.pronamespace = n.oid
-- WHERE n.nspname = 'public' AND proname LIKE '%user%' OR proname LIKE '%audit%';
-- (Should return no application-specific functions)
--
-- WARNING: Rolling back functions will break:
--   - All triggers
--   - All RLS policies using helper functions
--   - Auto-profile creation on user signup
--   - Audit logging system
-- ============================================================================
