import { Suspense } from 'react'
import { ClientsPageFeature } from '@/features/admin/clients'

export default async function AdminClientsPage() {
  return (
    <Suspense fallback={null}>
      <ClientsPageFeature />
    </Suspense>
  )
}
