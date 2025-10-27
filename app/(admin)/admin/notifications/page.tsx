import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { getAllNotifications, getUnreadNotificationCount } from '@/features/shared/notifications/api/queries'
import { NotificationList } from '@/features/shared/notifications/components/notification-list'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default async function AdminNotificationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profile')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect(ROUTES.CLIENT_DASHBOARD)
  }

  const [notifications, unreadCount] = await Promise.all([
    getAllNotifications(user.id),
    getUnreadNotificationCount(user.id),
  ])

  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Stay updated with important information and system events
          </CardDescription>
        </CardHeader>
      </Card>

      <NotificationList notifications={notifications} hasUnread={unreadCount > 0} />
    </div>
  )
}
