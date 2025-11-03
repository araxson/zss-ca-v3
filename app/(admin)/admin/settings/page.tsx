import { Suspense } from 'react'
import { SettingsPageFeature } from '@/features/admin/settings'

export default async function AdminSettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsPageFeature />
    </Suspense>
  )
}
