import { Suspense } from 'react'
import { BillingPageFeature } from '@/features/admin/billing'

export default async function AdminBillingPage() {
  return (
    <Suspense fallback={null}>
      <BillingPageFeature />
    </Suspense>
  )
}
