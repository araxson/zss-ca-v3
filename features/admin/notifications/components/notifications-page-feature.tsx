import 'server-only'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { listNotificationsAdmin, getUnreadNotificationCount } from '../api/queries'
import { NOTIFICATIONS_LABELS } from '../api/constants'
import { NotificationListAdmin } from '@/features/admin/notifications'
import { Badge } from '@/components/ui/badge'

export async function NotificationsPageFeature(): Promise<React.JSX.Element> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  // ✅ Parallel data fetching to avoid waterfall - 3 independent queries
  const [profileResult, notifications, unreadCount] = await Promise.all([
    supabase.from('profile').select('role').eq('id', user.id).single(),
    listNotificationsAdmin(),
    getUnreadNotificationCount(user.id),
  ])

  const { data: profile } = profileResult
  if (profile?.role !== 'admin') redirect(ROUTES.CLIENT_DASHBOARD)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {NOTIFICATIONS_LABELS.total(notifications.length)}
        </p>
        {unreadCount > 0 && (
          <Badge variant="secondary">{NOTIFICATIONS_LABELS.unread(unreadCount)}</Badge>
        )}
      </div>
      <NotificationListAdmin notifications={notifications} />
    </div>
  )
}
