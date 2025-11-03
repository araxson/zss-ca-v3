import 'server-only'

import { redirect } from 'next/navigation'
import { ROUTES } from '@/lib/constants/routes'
import { getCurrentProfile, ProfileForm } from '@/features/client/profile'
import { Item, ItemHeader, ItemTitle, ItemDescription } from '@/components/ui/item'

export async function AdminProfileFeature() {
  const profile = await getCurrentProfile()
  if (!profile) redirect(ROUTES.LOGIN)
  if (profile.role !== 'admin') redirect(ROUTES.CLIENT_DASHBOARD)

  return (
    <div className="space-y-6">
      <Item variant="outline">
        <ItemHeader>
          <ItemTitle className="text-3xl font-bold tracking-tight">Admin Account</ItemTitle>
          <ItemDescription>Manage your contact details and keep billing information up to date for client outreach</ItemDescription>
        </ItemHeader>
      </Item>
      <ProfileForm profile={profile} />
    </div>
  )
}
