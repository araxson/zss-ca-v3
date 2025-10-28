import { Suspense } from 'react'
import { AdminSiteDetailFeature } from '@/features/admin/sites'

interface AdminSiteDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminSiteDetailPage({ params }: AdminSiteDetailPageProps) {
  return (
    <Suspense fallback={null}>
      <AdminSiteDetailFeature params={params} />
    </Suspense>
  )
}
