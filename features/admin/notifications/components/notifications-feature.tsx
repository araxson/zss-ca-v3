import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { listNotifications, getUnreadNotificationCount } from '@/features/admin/notifications/api/queries'
import { NotificationList } from '@/features/admin/notifications'

export async function NotificationsFeature(): Promise<React.JSX.Element> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  const [notifications, unreadCount] = await Promise.all([
    listNotifications(user.id),
    getUnreadNotificationCount(user.id),
  ])

  return (
    <NotificationList notifications={notifications} hasUnread={unreadCount > 0} />
  )
}
