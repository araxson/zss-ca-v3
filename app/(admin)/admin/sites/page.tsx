import { Suspense } from 'react'
import { AdminSitesFeature } from '@/features/admin/sites'

export default async function AdminSitesPage() {
  return (
    <Suspense fallback={null}>
      <AdminSitesFeature />
    </Suspense>
  )
}
