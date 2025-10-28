import { Suspense } from 'react'
import { AdminCreateSiteFeature } from '@/features/admin/sites'

export default async function AdminCreateSitePage() {
  return (
    <Suspense fallback={null}>
      <AdminCreateSiteFeature />
    </Suspense>
  )
}
