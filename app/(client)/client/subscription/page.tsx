import { Suspense } from 'react'
import { SubscriptionFeature } from '@/features/shared/subscription/components/subscription-feature'

export default async function SubscriptionPage() {
  return (
    <Suspense fallback={null}>
      <SubscriptionFeature />
    </Suspense>
  )
}
