import { Suspense } from 'react'
import { SiteDetailFeature } from '@/features/client/sites'

interface ClientSiteDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ClientSiteDetailPage({ params }: ClientSiteDetailPageProps) {
  const { id } = await params
  return (
    <Suspense fallback={null}>
      <SiteDetailFeature id={id} />
    </Suspense>
  )
}