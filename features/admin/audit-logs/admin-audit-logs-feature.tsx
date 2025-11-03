import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { getAuditLogs } from '@/features/shared/audit-log/api/queries'
import { AuditLogTable } from '@/features/shared/audit-log'

export async function AdminAuditLogsFeature() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  const { data: profile } = await supabase.from('profile').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect(ROUTES.CLIENT_DASHBOARD)

  const logs = await getAuditLogs(100)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">View system activity and user actions - {logs.length} {logs.length === 1 ? 'entry' : 'entries'} shown</p>
      </div>
      <AuditLogTable logs={logs} />
    </div>
  )
}
