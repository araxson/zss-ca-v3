import { redirect } from 'next/navigation'
import { ROUTES } from '@/lib/constants/routes'
import { getCurrentProfile } from '@/features/client/profile/api/queries'
import { ProfileForm } from '@/features/client/profile/components/profile-form'
import { SectionHeader } from '@/features/shared/components'
import { Item, ItemContent } from '@/components/ui/item'

export default async function AdminProfilePage() {
  const profile = await getCurrentProfile()

  if (!profile) {
    redirect(ROUTES.LOGIN)
  }

  if (profile.role !== 'admin') {
    redirect(ROUTES.CLIENT_DASHBOARD)
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Admin Account"
        description="Manage your contact details and keep billing information up to date for client outreach."
        align="start"
      />

      <Item variant="outline" className="flex flex-col space-y-4 p-6">
        <SectionHeader
          title="Profile Details"
          description="Review and update the information shared with clients."
          align="start"
        />
        <ItemContent className="p-0">
          <ProfileForm profile={profile} />
        </ItemContent>
      </Item>
    </div>
  )
}
