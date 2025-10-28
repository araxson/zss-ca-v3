import { Suspense } from 'react'
import { AdminTicketDetailFeature } from '@/features/shared/support'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminTicketDetailPage({ params }: PageProps) {
  const { id } = await params
  return (
    <Suspense fallback={null}>
      <AdminTicketDetailFeature id={id} />
    </Suspense>
  )
}