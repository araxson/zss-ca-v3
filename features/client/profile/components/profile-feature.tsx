import 'server-only'

import { redirect } from 'next/navigation'
import { ROUTES } from '@/lib/constants/routes'
import { getCurrentProfile } from '@/features/client/profile/api/queries'
import { ProfileForm } from '@/features/client/profile/components/profile-form'
import { Item, ItemHeader, ItemTitle, ItemDescription, ItemContent } from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'

export async function ProfileFeature() {
  const profile = await getCurrentProfile()

  if (!profile) {
    redirect(ROUTES.LOGIN)
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Profile Settings"
        description="Manage your account information and preferences"
        align="start"
      />

      <Item variant="outline">
        <ItemHeader>
          <ItemTitle>Personal Information</ItemTitle>
          <ItemDescription>Update your contact details and company information</ItemDescription>
        </ItemHeader>
        <ItemContent>
          <ProfileForm profile={profile} />
        </ItemContent>
      </Item>
    </div>
  )
}
