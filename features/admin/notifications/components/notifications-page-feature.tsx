import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { listNotificationsAdmin, getUnreadNotificationCount } from '../api/queries'
import { NOTIFICATIONS_PAGE_METADATA, NOTIFICATIONS_LABELS } from '../api/constants'
import { NotificationListAdmin } from '@/features/shared/notifications'
import { Badge } from '@/components/ui/badge'

export async function NotificationsPageFeature() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  const { data: profile } = await supabase.from('profile').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect(ROUTES.CLIENT_DASHBOARD)

  const [notifications, unreadCount] = await Promise.all([
    listNotificationsAdmin(),
    getUnreadNotificationCount(user.id),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">
            {NOTIFICATIONS_PAGE_METADATA.title}
          </h1>
          <p className="text-muted-foreground">
            {NOTIFICATIONS_PAGE_METADATA.description} - {NOTIFICATIONS_LABELS.total(notifications.length)}
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="secondary">{NOTIFICATIONS_LABELS.unread(unreadCount)}</Badge>
        )}
      </div>
      <NotificationListAdmin notifications={notifications} />
    </div>
  )
}
