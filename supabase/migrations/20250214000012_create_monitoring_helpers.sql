-- ============================================================================
-- Migration: Create monitoring and utility helpers
-- Description: Database health monitoring views and utility functions
-- Author: Database Architecture Team
-- Date: 2025-02-14
--
-- Dependencies:
--   - All previous migrations (01-11)
--
-- Features:
--   - Database health monitoring views
--   - Index usage statistics
--   - RLS policy verification
--   - Performance monitoring helpers
--   - Utility functions for maintenance
--
-- Purpose:
--   Provides tools for ongoing database maintenance and monitoring
--   Helps identify performance issues and security gaps
--   Assists with capacity planning and optimization
--
-- Deployment Strategy: Safe for zero-downtime deployment
--   - Creates read-only views
--   - No table modifications
--   - No impact on existing queries
-- ============================================================================

-- ============================================================================
-- Monitoring Views
-- ============================================================================

-- View: Database health overview
-- SECURITY FIX: Admin-only view with proper access control
CREATE OR REPLACE VIEW public.vw_database_health
WITH (security_invoker = true)
AS
SELECT
  'Tables' AS category,
  COUNT(*)::TEXT AS value
FROM information_schema.tables
WHERE table_schema = 'public'
  AND private.current_user_is_admin() -- SECURITY: Admin-only access
UNION ALL
SELECT
  'Indexes',
  COUNT(*)::TEXT
FROM pg_indexes
WHERE schemaname = 'public'
  AND private.current_user_is_admin()
UNION ALL
SELECT
  'RLS Enabled Tables',
  COUNT(*)::TEXT
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
WHERE t.schemaname = 'public'
  AND c.relrowsecurity = true
  AND private.current_user_is_admin()
UNION ALL
SELECT
  'RLS Policies',
  COUNT(*)::TEXT
FROM pg_policies
WHERE schemaname = 'public'
  AND private.current_user_is_admin()
UNION ALL
SELECT
  'Functions',
  COUNT(*)::TEXT
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND private.current_user_is_admin()
UNION ALL
SELECT
  'Triggers',
  COUNT(*)::TEXT
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND private.current_user_is_admin();

COMMENT ON VIEW public.vw_database_health IS
  'Database health overview - Quick snapshot of schema state (ADMIN ONLY)';

-- View: Index usage statistics
-- SECURITY FIX: Admin-only view
CREATE OR REPLACE VIEW public.vw_index_usage
WITH (security_invoker = true)
AS
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan AS scans,
  idx_tup_read AS tuples_read,
  idx_tup_fetch AS tuples_fetched,
  pg_size_pretty(pg_relation_size(schemaname||'.'||indexname)) AS index_size,
  CASE
    WHEN idx_scan = 0 THEN 'UNUSED'
    WHEN idx_scan < 100 THEN 'LOW USAGE'
    WHEN idx_scan < 1000 THEN 'MODERATE'
    ELSE 'HIGH USAGE'
  END AS usage_category
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND private.current_user_is_admin() -- SECURITY: Admin-only access
ORDER BY idx_scan ASC, pg_relation_size(schemaname||'.'||indexname) DESC;

COMMENT ON VIEW public.vw_index_usage IS
  'Index usage statistics - Helps identify unused or underutilized indexes (ADMIN ONLY)';

-- View: Table statistics
-- SECURITY FIX: Admin-only view
CREATE OR REPLACE VIEW public.vw_table_stats
WITH (security_invoker = true)
AS
SELECT
  schemaname,
  tablename,
  n_live_tup AS live_rows,
  n_dead_tup AS dead_rows,
  CASE
    WHEN n_live_tup > 0
    THEN ROUND((n_dead_tup::NUMERIC / n_live_tup::NUMERIC) * 100, 2)
    ELSE 0
  END AS dead_row_percent,
  last_vacuum,
  last_autovacuum,
  last_analyze,
  last_autoanalyze,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) -
                 pg_relation_size(schemaname||'.'||tablename)) AS indexes_size
FROM pg_stat_user_tables
WHERE schemaname = 'public'
  AND private.current_user_is_admin() -- SECURITY: Admin-only access
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

COMMENT ON VIEW public.vw_table_stats IS
  'Table statistics - Monitors table health, size, and maintenance status (ADMIN ONLY)';

-- View: RLS policy coverage
-- SECURITY FIX: Admin-only view
CREATE OR REPLACE VIEW public.vw_rls_coverage
WITH (security_invoker = true)
AS
SELECT
  t.tablename,
  c.relrowsecurity AS rls_enabled,
  COUNT(p.policyname) AS policy_count,
  ARRAY_AGG(p.policyname ORDER BY p.policyname) FILTER (WHERE p.policyname IS NOT NULL) AS policies,
  CASE
    WHEN NOT c.relrowsecurity THEN '❌ RLS DISABLED'
    WHEN COUNT(p.policyname) = 0 THEN '⚠️ NO POLICIES'
    WHEN COUNT(p.policyname) < 3 THEN '⚠️ FEW POLICIES'
    ELSE '✅ COVERED'
  END AS status
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
LEFT JOIN pg_policies p ON p.schemaname = t.schemaname AND p.tablename = t.tablename
WHERE t.schemaname = 'public'
  AND private.current_user_is_admin() -- SECURITY: Admin-only access
GROUP BY t.tablename, c.relrowsecurity
ORDER BY c.relrowsecurity DESC, COUNT(p.policyname) ASC;

COMMENT ON VIEW public.vw_rls_coverage IS
  'RLS policy coverage - Ensures all tables have proper security policies (ADMIN ONLY)';

-- View: Foreign key relationships
-- SECURITY FIX: Admin-only view
CREATE OR REPLACE VIEW public.vw_foreign_keys
WITH (security_invoker = true)
AS
SELECT
  tc.table_schema,
  tc.table_name AS from_table,
  kcu.column_name AS from_column,
  ccu.table_name AS to_table,
  ccu.column_name AS to_column,
  rc.update_rule,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND private.current_user_is_admin() -- SECURITY: Admin-only access
ORDER BY tc.table_name, kcu.column_name;

COMMENT ON VIEW public.vw_foreign_keys IS
  'Foreign key relationships - Documents table dependencies and cascade rules (ADMIN ONLY)';

-- ============================================================================
-- Utility Functions
-- ============================================================================

-- Function: Get table column information
-- Issue #4 Fix: Add admin check to prevent schema disclosure
CREATE OR REPLACE FUNCTION public.describe_table(table_name_param TEXT)
RETURNS TABLE (
  column_name TEXT,
  data_type TEXT,
  is_nullable TEXT,
  column_default TEXT,
  is_primary_key BOOLEAN
) AS $$
BEGIN
  -- Only admins can describe table structure
  IF NOT private.current_user_is_admin() THEN
    RAISE EXCEPTION 'Only administrators can describe table structure';
  END IF;

  RETURN QUERY
  SELECT
    c.column_name::TEXT,
    c.data_type::TEXT,
    c.is_nullable::TEXT,
    c.column_default::TEXT,
    CASE
      WHEN pk.column_name IS NOT NULL THEN true
      ELSE false
    END AS is_primary_key
  FROM information_schema.columns c
  LEFT JOIN (
    SELECT kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_schema = 'public'
      AND tc.table_name = table_name_param
      AND tc.constraint_type = 'PRIMARY KEY'
  ) pk ON pk.column_name = c.column_name
  WHERE c.table_schema = 'public'
    AND c.table_name = table_name_param
  ORDER BY c.ordinal_position;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION public.describe_table IS
  'Utility: Describes table structure (similar to DESCRIBE in MySQL)';

-- Function: Check if user has specific role
CREATE OR REPLACE FUNCTION public.user_has_role(user_id UUID, required_role public.user_role)
RETURNS BOOLEAN AS $$
DECLARE
  actor uuid := (SELECT auth.uid());
BEGIN
  IF actor IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF actor <> user_id AND NOT private.current_user_is_admin() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.profile
    WHERE id = user_id
      AND role = required_role
      AND deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION public.user_has_role IS
  'Utility: Check if user has specific role (reusable in policies and queries)';

-- Function: Get user's active subscription
CREATE OR REPLACE FUNCTION public.get_active_subscription(user_id UUID)
RETURNS TABLE (
  subscription_id UUID,
  plan_id UUID,
  plan_name TEXT,
  status public.subscription_status,
  current_period_end TIMESTAMPTZ
) AS $$
DECLARE
  actor uuid := (SELECT auth.uid());
BEGIN
  IF actor IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF actor <> user_id AND NOT private.current_user_is_admin() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT
    s.id,
    s.plan_id,
    p.name,
    s.status,
    s.current_period_end
  FROM public.subscription s
  JOIN public.plan p ON p.id = s.plan_id
  WHERE s.profile_id = user_id
    AND s.status IN ('active', 'trialing')
    AND s.deleted_at IS NULL
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION public.get_active_subscription IS
  'Utility: Get user''s current active subscription with plan details';

-- Function: Calculate subscription revenue
CREATE OR REPLACE FUNCTION public.calculate_revenue_stats()
RETURNS TABLE (
  total_active_subscriptions BIGINT,
  total_trialing_subscriptions BIGINT,
  total_past_due_subscriptions BIGINT,
  total_canceled_subscriptions BIGINT
) AS $$
BEGIN
  IF NOT private.current_user_is_admin() THEN
    RAISE EXCEPTION 'Only administrators can calculate revenue stats';
  END IF;

  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE status = 'active'),
    COUNT(*) FILTER (WHERE status = 'trialing'),
    COUNT(*) FILTER (WHERE status = 'past_due'),
    COUNT(*) FILTER (WHERE status = 'canceled')
  FROM public.subscription
  WHERE deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION public.calculate_revenue_stats IS
  'Utility: Calculate subscription statistics for revenue reporting';

-- ============================================================================
-- Admin Utility Functions (SECURITY DEFINER for admin access)
-- ============================================================================

-- Function: Clean up old audit logs
CREATE OR REPLACE FUNCTION public.cleanup_old_audit_logs(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
  actor uuid := (SELECT auth.uid());
BEGIN
  -- Only admins can run this
  IF NOT private.current_user_is_admin() THEN
    RAISE EXCEPTION 'Only administrators can clean up audit logs';
  END IF;

  DELETE FROM public.audit_log
  WHERE created_at < NOW() - (days_to_keep || ' days')::INTERVAL;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  -- Log the cleanup action
  INSERT INTO public.audit_log (
    actor_profile_id,
    action,
    resource_table,
    change_summary
  ) VALUES (
    actor,
    'CLEANUP',
    'audit_log',
    jsonb_build_object(
      'deleted_count', deleted_count,
      'days_kept', days_to_keep,
      'cleanup_date', NOW()
    )
  );

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION public.cleanup_old_audit_logs IS
  'Admin: Clean up audit logs older than specified days (default: 90 days)';

-- Function: Refresh table statistics
CREATE OR REPLACE FUNCTION public.refresh_all_statistics()
RETURNS TEXT AS $$
DECLARE
  table_record RECORD;
  result_text TEXT := 'Statistics refreshed for tables: ';
BEGIN
  -- Only admins can run this
  IF NOT private.current_user_is_admin() THEN
    RAISE EXCEPTION 'Only administrators can refresh statistics';
  END IF;

  FOR table_record IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename
  LOOP
    EXECUTE format('ANALYZE public.%I', table_record.tablename);
    result_text := result_text || table_record.tablename || ', ';
  END LOOP;

  RETURN TRIM(TRAILING ', ' FROM result_text);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

COMMENT ON FUNCTION public.refresh_all_statistics IS
  'Admin: Refresh statistics for all tables (improves query planner accuracy)';

-- ============================================================================
-- Post-Migration Validation
-- ============================================================================

DO $$
DECLARE
  view_count INTEGER;
  function_count INTEGER;
BEGIN
  -- Verify views were created
  SELECT COUNT(*) INTO view_count
  FROM information_schema.views
  WHERE table_schema = 'public'
    AND table_name LIKE 'vw_%';

  IF view_count < 5 THEN
    RAISE WARNING 'Expected at least 5 monitoring views, found %', view_count;
  END IF;

  -- Verify utility functions
  SELECT COUNT(*) INTO function_count
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public'
    AND p.proname IN (
      'describe_table',
      'user_has_role',
      'get_active_subscription',
      'calculate_revenue_stats',
      'cleanup_old_audit_logs',
      'refresh_all_statistics'
    );

  IF function_count != 6 THEN
    RAISE EXCEPTION 'Utility function creation incomplete: Expected 6, found %', function_count;
  END IF;

  -- Test a view
  IF NOT EXISTS (SELECT 1 FROM public.vw_database_health LIMIT 1) THEN
    RAISE EXCEPTION 'Database health view is not functioning';
  END IF;

  RAISE NOTICE 'Created % monitoring views successfully', view_count;
  RAISE NOTICE 'Created % utility functions successfully', function_count;
  RAISE NOTICE 'All monitoring and utility helpers are operational';
  RAISE NOTICE 'Migration 20250214000012_create_monitoring_helpers completed successfully at %', clock_timestamp();
END $$;

-- ============================================================================
-- Usage Examples
-- ============================================================================

-- Example: Check database health
-- SELECT * FROM public.vw_database_health;

-- Example: Find unused indexes
-- SELECT * FROM public.vw_index_usage WHERE usage_category = 'UNUSED';

-- Example: Check table sizes
-- SELECT * FROM public.vw_table_stats ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Example: Verify RLS coverage
-- SELECT * FROM public.vw_rls_coverage WHERE status != '✅ COVERED';

-- Example: Describe a table structure
-- SELECT * FROM public.describe_table('profile');

-- Example: Check if user is admin
-- SELECT public.user_has_role('user-uuid-here', 'admin');

-- Example: Get user's subscription
-- SELECT * FROM public.get_active_subscription('user-uuid-here');

-- Example: Get revenue statistics
-- SELECT * FROM public.calculate_revenue_stats();

-- Example: Clean up old audit logs (admin only)
-- SELECT public.cleanup_old_audit_logs(90);

-- Example: Refresh statistics (admin only)
-- SELECT public.refresh_all_statistics();

-- ============================================================================
-- Rollback Instructions
-- ============================================================================
-- To rollback this migration:
--
-- Step 1: Drop utility functions
-- DROP FUNCTION IF EXISTS public.refresh_all_statistics() CASCADE;
-- DROP FUNCTION IF EXISTS public.cleanup_old_audit_logs(INTEGER) CASCADE;
-- DROP FUNCTION IF EXISTS public.calculate_revenue_stats() CASCADE;
-- DROP FUNCTION IF EXISTS public.get_active_subscription(UUID) CASCADE;
-- DROP FUNCTION IF EXISTS public.user_has_role(UUID, public.user_role) CASCADE;
-- DROP FUNCTION IF EXISTS public.describe_table(TEXT) CASCADE;
--
-- Step 2: Drop monitoring views
-- DROP VIEW IF EXISTS public.vw_foreign_keys CASCADE;
-- DROP VIEW IF EXISTS public.vw_rls_coverage CASCADE;
-- DROP VIEW IF EXISTS public.vw_table_stats CASCADE;
-- DROP VIEW IF EXISTS public.vw_index_usage CASCADE;
-- DROP VIEW IF EXISTS public.vw_database_health CASCADE;
--
-- Step 3: Verify rollback
-- SELECT table_name FROM information_schema.views WHERE table_schema = 'public';
-- (Should return no monitoring views)
--
-- NOTE: Rollback is safe and has no impact on data
-- These are monitoring utilities only
-- ============================================================================
