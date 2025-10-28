import { Suspense } from 'react'
import { DashboardFeature } from '@/features/client/dashboard'

export default async function ClientDashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardFeature />
    </Suspense>
  )
}
