import { Suspense } from 'react'
import { AnalyticsPageFeature } from '@/features/admin/analytics'

export default async function AdminAnalyticsPage() {
  return (
    <Suspense fallback={null}>
      <AnalyticsPageFeature />
    </Suspense>
  )
}
