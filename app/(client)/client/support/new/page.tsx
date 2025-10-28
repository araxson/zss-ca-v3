import { Suspense } from 'react'
import { NewTicketFeature } from '@/features/shared/support'

export default async function NewSupportTicketPage() {
  return (
    <Suspense fallback={null}>
      <NewTicketFeature />
    </Suspense>
  )
}
