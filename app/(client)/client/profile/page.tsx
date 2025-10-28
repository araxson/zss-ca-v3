import { Suspense } from 'react'
import { ProfileFeature } from '@/features/client/profile'

export default async function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfileFeature />
    </Suspense>
  )
}
