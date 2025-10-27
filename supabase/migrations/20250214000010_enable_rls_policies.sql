-- ============================================================================
-- Migration: Enable Row Level Security and define granular access policies
-- Description: Implements comprehensive RLS policies for all application tables
-- Author: Database Architecture Team
-- Date: 2025-02-14
--
-- Dependencies:
--   - All table creation migrations (02-07)
--   - 20250214000008_create_functions.sql (current_user_is_admin helper)
--
-- Security Model:
--   - Profile: Users see own data, admins see all
--   - Plan: Public read, admin write
--   - Subscription: Owner + admin access
--   - Client Site: Owner read, admin full control
--   - Support Ticket: Participant-based access
--   - Ticket Reply: Thread participant access
--   - Notification: Owner + admin
--   - Audit Log: Admin + own records (immutable)
--   - Site Analytics: Site owner + admin
--
-- Performance Optimizations:
--   - All auth.uid() calls wrapped in SELECT for single evaluation
--   - Soft delete filtering integrated into policies
--   - Helper functions used to reduce policy complexity
--   - Indexes on all filtered columns (see migration 11)
--
-- Deployment Strategy: Safe for zero-downtime
--   - Policies use DROP IF EXISTS for idempotency
--   - Existing data remains accessible during deployment
--   - No table locks required
-- ============================================================================

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_site ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_ticket ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_reply ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

-- PROFILE POLICIES ----------------------------------------------------------
-- Issue #1 Fix: Add TO authenticated to prevent unnecessary RLS evaluation for anon users
DROP POLICY IF EXISTS "profile_select_own" ON public.profile;
CREATE POLICY "profile_select_own"
  ON public.profile
  FOR SELECT
  TO authenticated
  USING (
    deleted_at IS NULL
    AND (id = (SELECT auth.uid()) OR (SELECT private.current_user_is_admin()))
  );

DROP POLICY IF EXISTS "profile_insert_admin" ON public.profile;
CREATE POLICY "profile_insert_admin"
  ON public.profile
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT private.current_user_is_admin()));

DROP POLICY IF EXISTS "profile_update_self_or_admin" ON public.profile;
CREATE POLICY "profile_update_self_or_admin"
  ON public.profile
  FOR UPDATE
  TO authenticated
  USING (
    deleted_at IS NULL
    AND (id = (SELECT auth.uid()) OR (SELECT private.current_user_is_admin()))
  )
  WITH CHECK (id = (SELECT auth.uid()) OR (SELECT private.current_user_is_admin()));

DROP POLICY IF EXISTS "profile_delete_admin" ON public.profile;
CREATE POLICY "profile_delete_admin"
  ON public.profile
  FOR DELETE
  TO authenticated
  USING ((SELECT private.current_user_is_admin()));

-- PLAN POLICIES -------------------------------------------------------------
-- Issue #10 Fix: Document public access intent and restrict to active plans
-- Plan pricing tiers are publicly accessible for marketing pages
-- Anonymous and authenticated users can view all active plans
DROP POLICY IF EXISTS "plan_select_public" ON public.plan;
CREATE POLICY "plan_select_public"
  ON public.plan
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- SECURITY FIX: Separate policies for INSERT, UPDATE, DELETE operations
DROP POLICY IF EXISTS "plan_mutate_admin" ON public.plan;

DROP POLICY IF EXISTS "plan_insert_admin" ON public.plan;
CREATE POLICY "plan_insert_admin"
  ON public.plan
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT private.current_user_is_admin()));

DROP POLICY IF EXISTS "plan_update_admin" ON public.plan;
CREATE POLICY "plan_update_admin"
  ON public.plan
  FOR UPDATE
  TO authenticated
  USING ((SELECT private.current_user_is_admin()))
  WITH CHECK ((SELECT private.current_user_is_admin()));

DROP POLICY IF EXISTS "plan_delete_admin" ON public.plan;
CREATE POLICY "plan_delete_admin"
  ON public.plan
  FOR DELETE
  TO authenticated
  USING ((SELECT private.current_user_is_admin()));

-- SUBSCRIPTION POLICIES -----------------------------------------------------
DROP POLICY IF EXISTS "subscription_select_owner_or_admin" ON public.subscription;
CREATE POLICY "subscription_select_owner_or_admin"
  ON public.subscription
  FOR SELECT
  TO authenticated
  USING (
    deleted_at IS NULL
    AND (profile_id = (SELECT auth.uid()) OR (SELECT private.current_user_is_admin()))
  );

DROP POLICY IF EXISTS "subscription_insert_owner" ON public.subscription;
CREATE POLICY "subscription_insert_owner"
  ON public.subscription
  FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = (SELECT auth.uid()) OR (SELECT private.current_user_is_admin()));

DROP POLICY IF EXISTS "subscription_update_owner_or_admin" ON public.subscription;
CREATE POLICY "subscription_update_owner_or_admin"
  ON public.subscription
  FOR UPDATE
  TO authenticated
  USING (
    deleted_at IS NULL
    AND (profile_id = (SELECT auth.uid()) OR (SELECT private.current_user_is_admin()))
  )
  WITH CHECK (profile_id = (SELECT auth.uid()) OR (SELECT private.current_user_is_admin()));

DROP POLICY IF EXISTS "subscription_delete_admin" ON public.subscription;
CREATE POLICY "subscription_delete_admin"
  ON public.subscription
  FOR DELETE
  TO authenticated
  USING ((SELECT private.current_user_is_admin()));

-- CLIENT SITE POLICIES ------------------------------------------------------
DROP POLICY IF EXISTS "client_site_select_owner_or_admin" ON public.client_site;
CREATE POLICY "client_site_select_owner_or_admin"
  ON public.client_site
  FOR SELECT
  TO authenticated
  USING (profile_id = (SELECT auth.uid()) OR (SELECT private.current_user_is_admin()));

DROP POLICY IF EXISTS "client_site_insert_admin" ON public.client_site;
CREATE POLICY "client_site_insert_admin"
  ON public.client_site
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT private.current_user_is_admin()));

DROP POLICY IF EXISTS "client_site_update_admin" ON public.client_site;
CREATE POLICY "client_site_update_admin"
  ON public.client_site
  FOR UPDATE
  TO authenticated
  USING ((SELECT private.current_user_is_admin()))
  WITH CHECK ((SELECT private.current_user_is_admin()));

DROP POLICY IF EXISTS "client_site_delete_admin" ON public.client_site;
CREATE POLICY "client_site_delete_admin"
  ON public.client_site
  FOR DELETE
  TO authenticated
  USING ((SELECT private.current_user_is_admin()));

-- SUPPORT TICKET POLICIES ---------------------------------------------------
DROP POLICY IF EXISTS "support_ticket_select_participants" ON public.support_ticket;
CREATE POLICY "support_ticket_select_participants"
  ON public.support_ticket
  FOR SELECT
  TO authenticated
  USING (
    (SELECT private.current_user_is_admin())
    OR profile_id = (SELECT auth.uid())
    OR created_by_profile_id = (SELECT auth.uid())
    OR assigned_to_profile_id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "support_ticket_insert_owner" ON public.support_ticket;
CREATE POLICY "support_ticket_insert_owner"
  ON public.support_ticket
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT private.current_user_is_admin())
    OR (profile_id = (SELECT auth.uid()) AND created_by_profile_id = (SELECT auth.uid()))
  );

DROP POLICY IF EXISTS "support_ticket_update_participants" ON public.support_ticket;
CREATE POLICY "support_ticket_update_participants"
  ON public.support_ticket
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT private.current_user_is_admin())
    OR profile_id = (SELECT auth.uid())
    OR assigned_to_profile_id = (SELECT auth.uid())
  )
  WITH CHECK (
    (SELECT private.current_user_is_admin())
    OR profile_id = (SELECT auth.uid())
    OR assigned_to_profile_id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "support_ticket_delete_admin" ON public.support_ticket;
CREATE POLICY "support_ticket_delete_admin"
  ON public.support_ticket
  FOR DELETE
  TO authenticated
  USING ((SELECT private.current_user_is_admin()));

-- TICKET REPLY POLICIES -----------------------------------------------------
-- Issue #3 Fix: Use helper function to avoid JOIN overhead in RLS policies
DROP POLICY IF EXISTS "ticket_reply_select_participants" ON public.ticket_reply;
CREATE POLICY "ticket_reply_select_participants"
  ON public.ticket_reply
  FOR SELECT
  TO authenticated
  USING (
    (SELECT private.current_user_is_admin())
    OR support_ticket_id = ANY((SELECT private.user_ticket_ids()))
  );

DROP POLICY IF EXISTS "ticket_reply_insert_participants" ON public.ticket_reply;
CREATE POLICY "ticket_reply_insert_participants"
  ON public.ticket_reply
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (SELECT private.current_user_is_admin())
    OR (
      author_profile_id = (SELECT auth.uid())
      AND support_ticket_id = ANY((SELECT private.user_ticket_ids()))
    )
  );

DROP POLICY IF EXISTS "ticket_reply_update_author_or_admin" ON public.ticket_reply;
CREATE POLICY "ticket_reply_update_author_or_admin"
  ON public.ticket_reply
  FOR UPDATE
  TO authenticated
  USING (author_profile_id = (SELECT auth.uid()) OR (SELECT private.current_user_is_admin()))
  WITH CHECK (author_profile_id = (SELECT auth.uid()) OR (SELECT private.current_user_is_admin()));

DROP POLICY IF EXISTS "ticket_reply_delete_admin" ON public.ticket_reply;
CREATE POLICY "ticket_reply_delete_admin"
  ON public.ticket_reply
  FOR DELETE
  TO authenticated
  USING ((SELECT private.current_user_is_admin()));

-- NOTIFICATION POLICIES -----------------------------------------------------
DROP POLICY IF EXISTS "notification_select_owner" ON public.notification;
CREATE POLICY "notification_select_owner"
  ON public.notification
  FOR SELECT
  TO authenticated
  USING (profile_id = (SELECT auth.uid()) OR (SELECT private.current_user_is_admin()));

DROP POLICY IF EXISTS "notification_insert_owner" ON public.notification;
CREATE POLICY "notification_insert_owner"
  ON public.notification
  FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = (SELECT auth.uid()) OR (SELECT private.current_user_is_admin()));

DROP POLICY IF EXISTS "notification_update_owner" ON public.notification;
CREATE POLICY "notification_update_owner"
  ON public.notification
  FOR UPDATE
  TO authenticated
  USING (profile_id = (SELECT auth.uid()) OR (SELECT private.current_user_is_admin()))
  WITH CHECK (profile_id = (SELECT auth.uid()) OR (SELECT private.current_user_is_admin()));

DROP POLICY IF EXISTS "notification_delete_owner_or_admin" ON public.notification;
CREATE POLICY "notification_delete_owner_or_admin"
  ON public.notification
  FOR DELETE
  TO authenticated
  USING (profile_id = (SELECT auth.uid()) OR (SELECT private.current_user_is_admin()));

-- AUDIT LOG POLICIES --------------------------------------------------------
DROP POLICY IF EXISTS "audit_log_select_visibility" ON public.audit_log;
CREATE POLICY "audit_log_select_visibility"
  ON public.audit_log
  FOR SELECT
  TO authenticated
  USING (
    (SELECT private.current_user_is_admin())
    OR profile_id = (SELECT auth.uid())
  );

DROP POLICY IF EXISTS "audit_log_insert_admin" ON public.audit_log;
CREATE POLICY "audit_log_insert_admin"
  ON public.audit_log
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT private.current_user_is_admin()));

-- Audit logs are immutable - no updates allowed
DROP POLICY IF EXISTS "audit_log_update_admin" ON public.audit_log;

DROP POLICY IF EXISTS "audit_log_delete_admin" ON public.audit_log;
CREATE POLICY "audit_log_delete_admin"
  ON public.audit_log
  FOR DELETE
  TO authenticated
  USING ((SELECT private.current_user_is_admin()));

-- SITE ANALYTICS POLICIES ---------------------------------------------------
-- PERFORMANCE FIX: Use helper function instead of JOIN to avoid RLS overhead
DROP POLICY IF EXISTS "site_analytics_select_owner_or_admin" ON public.site_analytics;
CREATE POLICY "site_analytics_select_owner_or_admin"
  ON public.site_analytics
  FOR SELECT
  TO authenticated
  USING (
    (SELECT private.current_user_is_admin())
    OR client_site_id = ANY((SELECT private.user_client_site_ids()))
  );

DROP POLICY IF EXISTS "site_analytics_insert_admin" ON public.site_analytics;
CREATE POLICY "site_analytics_insert_admin"
  ON public.site_analytics
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT private.current_user_is_admin()));

DROP POLICY IF EXISTS "site_analytics_update_admin" ON public.site_analytics;
CREATE POLICY "site_analytics_update_admin"
  ON public.site_analytics
  FOR UPDATE
  TO authenticated
  USING ((SELECT private.current_user_is_admin()))
  WITH CHECK ((SELECT private.current_user_is_admin()));

DROP POLICY IF EXISTS "site_analytics_delete_admin" ON public.site_analytics;
CREATE POLICY "site_analytics_delete_admin"
  ON public.site_analytics
  FOR DELETE
  TO authenticated
  USING ((SELECT private.current_user_is_admin()));

-- ============================================================================
-- Post-Migration Validation
-- ============================================================================

DO $$
DECLARE
  rls_enabled_count INTEGER;
  policy_count INTEGER;
  tables_without_rls TEXT[];
BEGIN
  -- Verify RLS is enabled on all tables
  SELECT COUNT(*) INTO rls_enabled_count
  FROM pg_tables t
  JOIN pg_class c ON c.relname = t.tablename
  WHERE t.schemaname = 'public'
    AND t.tablename IN (
      'profile', 'plan', 'subscription', 'client_site',
      'support_ticket', 'ticket_reply', 'notification',
      'audit_log', 'site_analytics'
    )
    AND c.relrowsecurity = true;

  IF rls_enabled_count != 9 THEN
    SELECT ARRAY_AGG(tablename::TEXT) INTO tables_without_rls
    FROM pg_tables t
    JOIN pg_class c ON c.relname = t.tablename
    WHERE t.schemaname = 'public'
      AND t.tablename IN (
        'profile', 'plan', 'subscription', 'client_site',
        'support_ticket', 'ticket_reply', 'notification',
        'audit_log', 'site_analytics'
      )
      AND c.relrowsecurity = false;

    RAISE EXCEPTION 'RLS not enabled on all tables. Missing: %',
      array_to_string(tables_without_rls, ', ');
  END IF;

  -- Count total policies created
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public';

  -- Updated: Now expecting at least 32 policies (added separate INSERT/UPDATE/DELETE for plan)
  IF policy_count < 32 THEN
    RAISE WARNING 'Expected at least 32 policies, found %. Some policies may be missing.', policy_count;
  END IF;

  -- Verify critical policies exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profile'
      AND policyname = 'profile_select_own'
  ) THEN
    RAISE EXCEPTION 'Critical policy profile_select_own is missing';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'plan'
      AND policyname = 'plan_select_public'
  ) THEN
    RAISE EXCEPTION 'Critical policy plan_select_public is missing';
  END IF;

  RAISE NOTICE 'RLS enabled on all 9 tables';
  RAISE NOTICE 'Created % security policies successfully', policy_count;
  RAISE NOTICE 'Migration 20250214000010_enable_rls_policies completed successfully at %', clock_timestamp();
END $$;

-- ============================================================================
-- Rollback Instructions
-- ============================================================================
-- To rollback this migration, execute the following commands:
--
-- Step 1: Disable RLS on all tables (in reverse order)
-- ALTER TABLE public.site_analytics DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.audit_log DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.notification DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.ticket_reply DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.support_ticket DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.client_site DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.subscription DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.plan DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.profile DISABLE ROW LEVEL SECURITY;
--
-- Step 2: Drop all policies (CASCADE will handle dependencies)
-- DROP POLICY IF EXISTS "site_analytics_delete_admin" ON public.site_analytics CASCADE;
-- DROP POLICY IF EXISTS "site_analytics_update_admin" ON public.site_analytics CASCADE;
-- DROP POLICY IF EXISTS "site_analytics_insert_admin" ON public.site_analytics CASCADE;
-- DROP POLICY IF EXISTS "site_analytics_select_owner_or_admin" ON public.site_analytics CASCADE;
-- ... (continue for all policies)
--
-- Step 3: Verify rollback
-- SELECT tablename, COUNT(*) as policy_count
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- GROUP BY tablename;
-- (Should return no rows)
--
-- WARNING: Disabling RLS exposes ALL data to ALL authenticated users
-- SECURITY RISK: Only disable RLS in development environments
-- ============================================================================
