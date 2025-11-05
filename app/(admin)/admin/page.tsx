import { Suspense } from 'react'
import type { Metadata } from 'next'
import { AdminDashboardFeature } from '@/features/admin/dashboard'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Overview of your platform metrics and activities',
  robots: {
    index: false,
    follow: false,
  },
}

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  return (
    <Suspense
      fallback={(
        <div role="status" aria-live="polite" className="sr-only">
          Loading dashboard...
        </div>
      )}
    >
      <AdminDashboardFeature />
    </Suspense>
  )
}
