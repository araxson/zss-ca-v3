-- Migration: Create optional future-proofing tables (notifications, audit logs, analytics).
-- These tables are intentionally lightweight to accommodate phased rollouts.

CREATE TABLE public.notification (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  notification_type public.notification_type NOT NULL,
  title text NOT NULL,
  body text,
  action_url text,
  read_at timestamptz,
  expires_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notification
  ADD CONSTRAINT notification_profile_fk
  FOREIGN KEY (profile_id)
  REFERENCES public.profile (id)
  ON DELETE CASCADE;

-- ============================================================================
-- PRIMARY KEY STRATEGY NOTE:
-- -------------------------
-- audit_log uses BIGSERIAL instead of UUID for the following reasons:
-- 1. Natural ordering: Easier to track sequence of events chronologically
-- 2. Performance: Smaller index size (8 bytes vs 16 bytes for UUID)
-- 3. No distributed writes: Audit logs are always written to primary DB
-- 4. Space efficiency: For high-volume audit tables, BIGSERIAL saves ~50% index space
--
-- site_analytics uses BIGSERIAL for similar reasons (time-series data, sequential inserts)
-- ============================================================================

CREATE TABLE public.audit_log (
  id bigserial PRIMARY KEY,
  actor_profile_id uuid,  -- FIXED: Renamed from actor_id for FK naming consistency
  profile_id uuid,
  action text NOT NULL,
  resource_table text NOT NULL,
  resource_id uuid,
  change_summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_log
  ADD CONSTRAINT audit_log_actor_fk
  FOREIGN KEY (actor_profile_id)
  REFERENCES public.profile (id)
  ON DELETE SET NULL;

ALTER TABLE public.audit_log
  ADD CONSTRAINT audit_log_profile_fk
  FOREIGN KEY (profile_id)
  REFERENCES public.profile (id)
  ON DELETE SET NULL;

CREATE TABLE public.site_analytics (
  id bigserial PRIMARY KEY,
  client_site_id uuid NOT NULL,
  metric_date date NOT NULL,
  page_views integer NOT NULL DEFAULT 0,
  unique_visitors integer NOT NULL DEFAULT 0,
  conversions integer NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_analytics
  ADD CONSTRAINT site_analytics_site_fk
  FOREIGN KEY (client_site_id)
  REFERENCES public.client_site (id)
  ON DELETE CASCADE;

ALTER TABLE public.site_analytics
  ADD CONSTRAINT site_analytics_unique_per_day
  UNIQUE (client_site_id, metric_date);

-- CRITICAL: Prevent negative metrics (business logic validation)
ALTER TABLE public.site_analytics
  ADD CONSTRAINT site_analytics_positive_metrics
  CHECK (
    page_views >= 0
    AND unique_visitors >= 0
    AND conversions >= 0
  );

-- Logical constraint: unique visitors cannot exceed page views
ALTER TABLE public.site_analytics
  ADD CONSTRAINT site_analytics_logical_metrics
  CHECK (unique_visitors <= page_views);

-- CONSISTENCY FIX: Ensure metadata is a JSON object (all constraints uniquely named)
ALTER TABLE public.site_analytics
  ADD CONSTRAINT site_analytics_metadata_is_object
  CHECK (jsonb_typeof(metadata) = 'object');

ALTER TABLE public.notification
  ADD CONSTRAINT notification_metadata_is_object
  CHECK (jsonb_typeof(metadata) = 'object');

-- Audit log uses change_summary, not metadata
ALTER TABLE public.audit_log
  ADD CONSTRAINT audit_log_change_summary_is_object
  CHECK (jsonb_typeof(change_summary) = 'object');

-- SOFT DELETE PATTERN NOTES:
-- ---------------------------
-- notification: No soft delete - uses expires_at for automatic cleanup
--   - Notifications are transient (not critical historical data)
--   - expires_at provides automatic expiration without manual deletion
--   - Read/unread status tracked via read_at timestamp
--
-- audit_log: No soft delete - immutable compliance record
--   - Audit logs must NEVER be deleted (compliance requirement)
--   - Use retention policies and archiving instead of deletion
--   - See cleanup_old_audit_logs() for compliant archival
--
-- site_analytics: No soft delete - time-series data
--   - Historical metrics must be preserved
--   - Old data archived to separate tables/partitions if needed
--   - Aggregations depend on complete historical dataset

COMMENT ON TABLE public.notification IS
  'In-app alerts for subscription events, billing updates, support notifications, and onboarding tasks.';

COMMENT ON COLUMN public.notification.metadata IS
  'Notification-specific data for rendering and routing. Structure varies by notification_type. Example: {"subscription_id": "uuid", "amount": 9.99, "currency": "CAD"}';

COMMENT ON TABLE public.audit_log IS
  'Security and compliance audit trail capturing admin and automated actions.';

COMMENT ON COLUMN public.audit_log.change_summary IS
  'Complete before/after state for audit trail. Structure: {"old": {...}, "new": {...}} for UPDATEs, {"created": {...}} for INSERTs, {"deleted": {...}} for DELETEs.';

-- Issue #19: Future Scalability Consideration
-- For high-volume systems with 1M+ audit log rows, consider implementing table partitioning:
--
-- Example monthly partitioning strategy:
-- CREATE TABLE audit_log_y2025m01 PARTITION OF audit_log
--   FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
--
-- Benefits:
-- - Faster queries on recent data
-- - Efficient archival/deletion of old data
-- - Improved vacuum performance
--
-- Implementation timing: When audit_log exceeds 1 million rows or query performance degrades

COMMENT ON TABLE public.site_analytics IS
  'Daily rollups of marketing metrics. Designed for future analytics integrations.';

COMMENT ON COLUMN public.site_analytics.metadata IS
  'Additional analytics context and breakdowns. Example: {"top_pages": [], "referrers": [], "devices": {"mobile": 60, "desktop": 40}, "bounce_rate": 35.2}';
