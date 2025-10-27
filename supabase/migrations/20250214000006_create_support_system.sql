-- ============================================================================
-- Migration: Create support ticketing system tables.
-- Enables client/admin communication threads with priority triaging.
-- ============================================================================
--
-- NORMALIZATION NOTES:
-- --------------------
-- This table contains intentional denormalization for performance and data integrity:
--
-- 1. profile_id, client_site_id, subscription_id are all stored despite redundancy
--    Rationale:
--    - Tickets can exist without a site (general inquiries)
--    - Tickets can exist without a subscription (pre-sales questions)
--    - Direct profile_id ensures tickets survive site/subscription deletion
--    - Avoids complex JOINs in common queries and RLS policies
--
-- 2. Consistency maintained by application logic and triggers (not DB constraints)
--    - This is a trade-off: flexibility vs strict referential integrity
-- ============================================================================

CREATE TABLE public.support_ticket (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  client_site_id uuid,
  subscription_id uuid,
  subject text NOT NULL,
  message text NOT NULL,
  status public.ticket_status NOT NULL DEFAULT 'open',
  priority public.ticket_priority NOT NULL DEFAULT 'medium',
  category public.ticket_category NOT NULL DEFAULT 'general_inquiry',
  assigned_to_profile_id uuid,  -- FIXED: Renamed from assigned_to for FK naming consistency
  created_by_profile_id uuid NOT NULL,  -- FIXED: Renamed from created_by for FK naming consistency
  last_reply_at timestamptz,
  resolved_at timestamptz,
  closed_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.support_ticket
  ADD CONSTRAINT support_ticket_profile_fk
  FOREIGN KEY (profile_id)
  REFERENCES public.profile (id)
  ON DELETE CASCADE;

ALTER TABLE public.support_ticket
  ADD CONSTRAINT support_ticket_site_fk
  FOREIGN KEY (client_site_id)
  REFERENCES public.client_site (id)
  ON DELETE SET NULL;

ALTER TABLE public.support_ticket
  ADD CONSTRAINT support_ticket_subscription_fk
  FOREIGN KEY (subscription_id)
  REFERENCES public.subscription (id)
  ON DELETE SET NULL;

ALTER TABLE public.support_ticket
  ADD CONSTRAINT support_ticket_assignee_fk
  FOREIGN KEY (assigned_to_profile_id)
  REFERENCES public.profile (id)
  ON DELETE SET NULL;

ALTER TABLE public.support_ticket
  ADD CONSTRAINT support_ticket_creator_fk
  FOREIGN KEY (created_by_profile_id)
  REFERENCES public.profile (id)
  ON DELETE CASCADE;

CREATE TABLE public.ticket_reply (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  support_ticket_id uuid NOT NULL,  -- FIXED: Renamed from ticket_id for naming consistency
  author_profile_id uuid NOT NULL,  -- FIXED: Renamed from author_id for FK naming consistency
  message text NOT NULL,
  is_internal boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),  -- FIXED: Renamed from sent_at for timestamp consistency
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ticket_reply
  ADD CONSTRAINT ticket_reply_ticket_fk
  FOREIGN KEY (support_ticket_id)
  REFERENCES public.support_ticket (id)
  ON DELETE CASCADE;

ALTER TABLE public.ticket_reply
  ADD CONSTRAINT ticket_reply_author_fk
  FOREIGN KEY (author_profile_id)
  REFERENCES public.profile (id)
  ON DELETE CASCADE;

-- SOFT DELETE PATTERN NOTE:
-- -------------------------
-- support_ticket and ticket_reply do NOT have soft delete (deleted_at) by design:
-- - Tickets use status lifecycle instead: open → in_progress → resolved → closed
-- - Ticket history must be preserved for compliance and audit purposes
-- - Use status = 'closed' instead of soft delete
-- - Replies are immutable and should never be deleted (audit trail requirement)
--
-- Rationale: Regulatory compliance requires complete support conversation history

-- Ensure metadata is a JSON object
ALTER TABLE public.support_ticket
  ADD CONSTRAINT support_ticket_metadata_is_object
  CHECK (jsonb_typeof(metadata) = 'object');

COMMENT ON TABLE public.support_ticket IS
  'Client support requests covering technical issues, billing, and content changes.

IMPORTANT FOR APPLICATION DEVELOPERS:
- Always add participant filters explicitly in queries
- RLS policies use helper functions but explicit filters improve performance
- Example: .or("profile_id.eq.userId,created_by_profile_id.eq.userId")';

COMMENT ON COLUMN public.support_ticket.metadata IS
  'Additional ticket context and system information. May include browser details, error logs, screenshots, attachments, etc. Structure: {"attachments": [], "browser": {...}, "error": {...}}';

COMMENT ON TABLE public.ticket_reply IS
  'Threaded communication for support tickets across clients and admin staff.';
