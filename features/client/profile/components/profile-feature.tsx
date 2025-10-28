import { redirect } from 'next/navigation'
import { ROUTES } from '@/lib/constants/routes'
import { getCurrentProfile } from '@/features/client/profile/api/queries'
import { ProfileForm } from '@/features/client/profile/components/profile-form'
import { SectionHeader } from '@/features/shared/components'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

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

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your contact details and company information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>
    </div>
  )
}
