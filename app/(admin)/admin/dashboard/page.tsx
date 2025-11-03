import { Suspense } from 'react'
import { AdminDashboardFeature } from '@/features/admin/dashboard'

export default async function AdminDashboardPage() {
  return (
    <Suspense fallback={null}>
      <AdminDashboardFeature />
    </Suspense>
  )
}
