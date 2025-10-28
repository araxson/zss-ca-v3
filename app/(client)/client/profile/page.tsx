import { redirect } from 'next/navigation'
import { ROUTES } from '@/lib/constants/routes'
import { getCurrentProfile } from '@/features/client/profile/api/queries'
import { ProfileForm } from '@/features/client/profile/components/profile-form'
import { SectionHeader } from '@/features/shared/components'
import { Item, ItemContent } from '@/components/ui/item'

export default async function ProfilePage() {
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

      <Item variant="outline" className="flex flex-col space-y-4 p-6">
        <SectionHeader
          title="Personal Information"
          description="Update your contact details and company information"
          align="start"
        />
        <ItemContent className="p-0">
          <ProfileForm profile={profile} />
        </ItemContent>
      </Item>
    </div>
  )
}
