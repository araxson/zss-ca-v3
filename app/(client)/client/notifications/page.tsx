import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { getAllNotifications, getUnreadNotificationCount } from '@/features/shared/notifications/api/queries'
import { NotificationList } from '@/features/shared/notifications'
import { SectionHeader } from '@/features/shared/components'

export default async function ClientNotificationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  const [notifications, unreadCount] = await Promise.all([
    getAllNotifications(user.id),
    getUnreadNotificationCount(user.id),
  ])

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Notifications"
        description="Stay updated with important information about your account and sites"
        align="start"
      />

      <NotificationList notifications={notifications} hasUnread={unreadCount > 0} />
    </div>
  )
}
