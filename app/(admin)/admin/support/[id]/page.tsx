import { Suspense } from 'react'
import { TicketDetailPageFeature } from '@/features/admin/support/[id]'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminTicketDetailPage({ params }: PageProps) {
  const { id } = await params
  return (
    <Suspense fallback={null}>
      <TicketDetailPageFeature id={id} />
    </Suspense>
  )
}
