import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { getAllNotificationsAdmin, getUnreadNotificationCount, NotificationListAdmin } from '@/features/shared/notifications'
import { SectionHeader } from '@/features/shared/components'
import { Badge } from '@/components/ui/badge'

export async function AdminNotificationsFeature() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  const { data: profile } = await supabase.from('profile').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect(ROUTES.CLIENT_DASHBOARD)

  const [notifications, unreadCount] = await Promise.all([
    getAllNotificationsAdmin(),
    getUnreadNotificationCount(user.id),
  ])

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Notifications"
        description="View and manage all system notifications"
        align="start"
        actions={
          unreadCount > 0 ? (
            <Badge variant="secondary">{unreadCount} unread</Badge>
          ) : null
        }
      />
      <NotificationListAdmin notifications={notifications} />
    </div>
  )
}
