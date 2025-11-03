import { Suspense } from 'react'
import { SupportListFeature } from '@/features/shared/support/components/support-list-feature'

export default async function SupportPage() {
  return (
    <Suspense fallback={null}>
      <SupportListFeature />
    </Suspense>
  )
}
