import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { getAuditLogs } from '@/features/shared/audit-log/api/queries'
import { AuditLogTable } from '@/features/shared/audit-log'
import { SectionHeader } from '@/features/shared/components'
import { Item, ItemContent } from '@/components/ui/item'

export default async function AdminAuditLogsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profile')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect(ROUTES.CLIENT_DASHBOARD)
  }

  const logs = await getAuditLogs(100)

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Audit Logs"
        description="System-wide audit trail of all actions and changes"
        align="start"
      />

      <Item variant="outline" className="p-6">
        <ItemContent className="p-0">
          <AuditLogTable logs={logs} />
        </ItemContent>
      </Item>
    </div>
  )
}
