import { Suspense } from 'react'
import { AdminProfileFeature } from '@/features/client/profile'

export default async function AdminProfilePage() {
  return (
    <Suspense fallback={null}>
      <AdminProfileFeature />
    </Suspense>
  )
}
