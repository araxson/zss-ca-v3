import { redirect } from 'next/navigation'
import { ROUTES } from '@/lib/constants/routes'
import { getCurrentProfile, ProfileForm } from '@/features/client/profile'
import { SectionHeader } from '@/features/shared/components'

export async function AdminProfileFeature() {
  const profile = await getCurrentProfile()
  if (!profile) redirect(ROUTES.LOGIN)
  if (profile.role !== 'admin') redirect(ROUTES.CLIENT_DASHBOARD)

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Admin Account"
        description="Manage your contact details and keep billing information up to date for client outreach"
        align="start"
      />
      <ProfileForm profile={profile} />
    </div>
  )
}
