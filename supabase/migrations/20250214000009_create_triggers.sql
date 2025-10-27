-- Migration: Attach triggers for timestamp management and profile provisioning.

-- Ensure trigger to auto-create profile records upon auth user creation.
DROP TRIGGER IF EXISTS handle_new_user_profile_trigger ON auth.users;

CREATE TRIGGER handle_new_user_profile_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_profile();

-- Updated_at maintenance triggers for core tables.
-- CONSISTENCY FIX: Validate all tables with updated_at column have triggers
DO $$
DECLARE
  rec record;
  trigger_count INTEGER := 0;
BEGIN
  FOR rec IN
    SELECT table_schema, table_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND column_name = 'updated_at'
      AND table_name IN (
        'profile',
        'plan',
        'subscription',
        'client_site',
        'support_ticket',
        'ticket_reply',
        'notification',
        'site_analytics'
        -- audit_log removed - immutable audit records don't need updated_at maintenance
      )
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS set_%1$s_updated_at ON public.%1$s;
      CREATE TRIGGER set_%1$s_updated_at
      BEFORE UPDATE ON public.%1$s
      FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();
    ', rec.table_name);
    trigger_count := trigger_count + 1;
  END LOOP;

  -- Validate expected trigger count
  IF trigger_count != 8 THEN
    RAISE WARNING 'Expected 8 updated_at triggers, created %', trigger_count;
  ELSE
    RAISE NOTICE 'Successfully created % updated_at triggers', trigger_count;
  END IF;
END
$$;

-- Support ticket replies should refresh the parent ticket activity.
DROP TRIGGER IF EXISTS touch_support_ticket_reply_trigger ON public.ticket_reply;

CREATE TRIGGER touch_support_ticket_reply_trigger
AFTER INSERT ON public.ticket_reply
FOR EACH ROW
EXECUTE FUNCTION public.touch_support_ticket_reply();

-- Audit triggers for compliance tracking on sensitive tables
DROP TRIGGER IF EXISTS audit_profile_changes ON public.profile;
CREATE TRIGGER audit_profile_changes
AFTER INSERT OR UPDATE OR DELETE ON public.profile
FOR EACH ROW
EXECUTE FUNCTION public.audit_table_changes();

DROP TRIGGER IF EXISTS audit_subscription_changes ON public.subscription;
CREATE TRIGGER audit_subscription_changes
AFTER INSERT OR UPDATE OR DELETE ON public.subscription
FOR EACH ROW
EXECUTE FUNCTION public.audit_table_changes();

DROP TRIGGER IF EXISTS audit_plan_changes ON public.plan;
CREATE TRIGGER audit_plan_changes
AFTER INSERT OR UPDATE OR DELETE ON public.plan
FOR EACH ROW
EXECUTE FUNCTION public.audit_table_changes();

-- Client site lifecycle audit trail (billing implications)
DROP TRIGGER IF EXISTS audit_client_site_changes ON public.client_site;
CREATE TRIGGER audit_client_site_changes
AFTER INSERT OR UPDATE OR DELETE ON public.client_site
FOR EACH ROW
EXECUTE FUNCTION public.audit_table_changes();

-- Support ticket audit trail (compliance requirement)
DROP TRIGGER IF EXISTS audit_support_ticket_changes ON public.support_ticket;
CREATE TRIGGER audit_support_ticket_changes
AFTER INSERT OR UPDATE OR DELETE ON public.support_ticket
FOR EACH ROW
EXECUTE FUNCTION public.audit_table_changes();

-- Ticket reply audit trail (immutable conversation history)
DROP TRIGGER IF EXISTS audit_ticket_reply_changes ON public.ticket_reply;
CREATE TRIGGER audit_ticket_reply_changes
AFTER INSERT OR UPDATE OR DELETE ON public.ticket_reply
FOR EACH ROW
EXECUTE FUNCTION public.audit_table_changes();
