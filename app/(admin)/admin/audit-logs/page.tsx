import { Suspense } from 'react'
import { AdminAuditLogsFeature } from '@/features/admin/audit-logs'

export default async function AdminAuditLogsPage() {
  return (
    <Suspense fallback={null}>
      <AdminAuditLogsFeature />
    </Suspense>
  )
}
