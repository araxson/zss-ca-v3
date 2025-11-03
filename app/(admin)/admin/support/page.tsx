import { Suspense } from 'react'
import { AdminSupportFeature } from '@/features/admin/support'

export default async function AdminSupportPage() {
  return (
    <Suspense fallback={null}>
      <AdminSupportFeature />
    </Suspense>
  )
}
