import { Suspense } from 'react'
import { TicketDetailFeature } from '@/features/shared/support'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TicketDetailPage({ params }: PageProps) {
  const { id } = await params
  return (
    <Suspense fallback={null}>
      <TicketDetailFeature id={id} />
    </Suspense>
  )
}