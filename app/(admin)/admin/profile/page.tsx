import { redirect } from 'next/navigation'
import { ROUTES } from '@/lib/constants/routes'
import { getCurrentProfile } from '@/features/client/profile/api/queries'
import { ProfileForm } from '@/features/client/profile/components/profile-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

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
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Admin Account</CardTitle>
          <CardDescription>
            Manage your contact details and keep billing information up to date for client outreach.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="h-full">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Review and update the information shared with clients.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>
    </div>
  )
}
