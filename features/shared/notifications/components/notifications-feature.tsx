import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { listNotifications, getUnreadNotificationCount } from '@/features/shared/notifications/api/queries'
import { NotificationList } from '@/features/shared/notifications'
import { Item, ItemHeader, ItemTitle, ItemDescription } from '@/components/ui/item'

export async function NotificationsFeature() {
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
    <div className="space-y-6">
      <Item variant="outline">
        <ItemHeader>
          <ItemTitle className="text-3xl font-bold tracking-tight">Notifications</ItemTitle>
          <ItemDescription>Stay updated with important information about your account and sites</ItemDescription>
        </ItemHeader>
      </Item>

      <NotificationList notifications={notifications} hasUnread={unreadCount > 0} />
    </div>
  )
}
