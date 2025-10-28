import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { getAuditLogs, AuditLogTable } from '@/features/shared/audit-log'
import { SectionHeader } from '@/features/shared/components'

export async function AdminAuditLogsFeature() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  const { data: profile } = await supabase.from('profile').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect(ROUTES.CLIENT_DASHBOARD)

  const logs = await getAuditLogs(100)

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Audit Logs"
        description="View system activity and user actions"
        align="start"
      />
      <AuditLogTable logs={logs} />
    </div>
  )
}
