'use client'

import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { NotificationItem } from './notification-item'
import { markAllNotificationsReadAction } from '../api/mutations'
import type { Notification } from '../api/queries'

interface NotificationListProps {
  notifications: Notification[]
  hasUnread: boolean
}

export function NotificationList({ notifications, hasUnread }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <Alert>
        <AlertTitle>No Notifications</AlertTitle>
        <AlertDescription>You&apos;re all caught up! No new notifications.</AlertDescription>
      </Alert>
    )
  }

  async function handleMarkAllRead() {
    await markAllNotificationsReadAction()
  }

  return (
    <div className="space-y-4">
      {hasUnread && (
        <div className="flex justify-end">
          <Button onClick={handleMarkAllRead} variant="outline" size="sm">
            Mark all as read
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  )
}
