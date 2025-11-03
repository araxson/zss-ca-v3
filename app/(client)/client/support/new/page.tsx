import { Suspense } from 'react'
import { NewTicketFeature } from '@/features/shared/support/components/new-ticket-feature'

export default async function NewSupportTicketPage() {
  return (
    <Suspense fallback={null}>
      <NewTicketFeature />
    </Suspense>
  )
}
