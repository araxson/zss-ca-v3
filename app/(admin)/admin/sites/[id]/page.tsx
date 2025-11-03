import { Suspense } from 'react'
import { SiteDetailPageFeature } from '@/features/admin/sites/[id]'

interface AdminSiteDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminSiteDetailPage({ params }: AdminSiteDetailPageProps) {
  return (
    <Suspense fallback={null}>
      <SiteDetailPageFeature params={params} />
    </Suspense>
  )
}
