import { Suspense } from 'react'
import { SitesListFeature } from '@/features/client/sites'

export default async function ClientSitesPage() {
  return (
    <Suspense fallback={null}>
      <SitesListFeature />
    </Suspense>
  )
}
