import { Suspense } from 'react'
import { CreateSitePageFeature } from '@/features/admin/sites/new'

export default async function AdminCreateSitePage() {
  return (
    <Suspense fallback={null}>
      <CreateSitePageFeature />
    </Suspense>
  )
}
