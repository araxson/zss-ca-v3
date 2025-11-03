import { Suspense } from 'react'
import { SitesPageFeature } from '@/features/admin/sites'

export default async function AdminSitesPage() {
  return (
    <Suspense fallback={null}>
      <SitesPageFeature />
    </Suspense>
  )
}
