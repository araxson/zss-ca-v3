import { Suspense } from 'react'
import { NotificationsPageFeature } from '@/features/admin/notifications'

export default async function AdminNotificationsPage() {
  return (
    <Suspense fallback={null}>
      <NotificationsPageFeature />
    </Suspense>
  )
}
