import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { getAuditLogs } from '@/features/admin/audit-logs/api/queries'
import { AuditLogTable } from '@/features/admin/audit-logs'

export async function AdminAuditLogsFeature() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  // ✅ Parallel data fetching to avoid waterfall
  const [profileResult, logs] = await Promise.all([
    supabase.from('profile').select('role').eq('id', user.id).single(),
    getAuditLogs(100),
  ])

  const { data: profile } = profileResult
  if (profile?.role !== 'admin') redirect(ROUTES.CLIENT_DASHBOARD)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {logs.length} {logs.length === 1 ? 'entry' : 'entries'} shown
        </p>
      </div>
      <AuditLogTable logs={logs} />
    </div>
  )
}
