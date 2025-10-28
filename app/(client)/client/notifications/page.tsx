import { Suspense } from 'react'
import { NotificationsFeature } from '@/features/shared/notifications'

export default async function ClientNotificationsPage() {
  return (
    <Suspense fallback={null}>
      <NotificationsFeature />
    </Suspense>
  )
}
