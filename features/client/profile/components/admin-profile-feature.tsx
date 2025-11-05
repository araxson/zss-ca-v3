import 'server-only'

import { redirect } from 'next/navigation'
import { ROUTES } from '@/lib/constants/routes'
import { getCurrentProfile, ProfileForm } from '@/features/client/profile'

export async function AdminProfileFeature(): Promise<React.JSX.Element> {
  const profile = await getCurrentProfile()
  if (!profile) redirect(ROUTES.LOGIN)
  if (profile.role !== 'admin') redirect(ROUTES.CLIENT_DASHBOARD)

  return (
    <ProfileForm profile={profile} />
  )
}
