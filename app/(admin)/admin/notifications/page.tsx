import { Suspense } from 'react'
import { AdminNotificationsFeature } from '@/features/admin/notifications'

export default async function AdminNotificationsPage() {
  return (
    <Suspense fallback={null}>
      <AdminNotificationsFeature />
    </Suspense>
  )
}
