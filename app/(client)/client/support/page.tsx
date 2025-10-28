import { Suspense } from 'react'
import { SupportListFeature } from '@/features/shared/support'

export default async function SupportPage() {
  return (
    <Suspense fallback={null}>
      <SupportListFeature />
    </Suspense>
  )
}
