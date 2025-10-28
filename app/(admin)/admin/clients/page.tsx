import { Suspense } from 'react'
import { AdminClientsFeature } from '@/features/admin/clients'

export default async function AdminClientsPage() {
  return (
    <Suspense fallback={null}>
      <AdminClientsFeature />
    </Suspense>
  )
}
