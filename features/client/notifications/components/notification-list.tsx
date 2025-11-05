'use client'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { ItemGroup } from '@/components/ui/item'
import { NotificationItem } from './notification-item'
import { markAllNotificationsReadAction } from '../api/mutations'
import type { Notification } from '../api/queries'

interface NotificationListProps {
  notifications: Notification[]
  hasUnread: boolean
}

export function NotificationList({ notifications, hasUnread }: NotificationListProps): React.JSX.Element {
  if (notifications.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyTitle>No notifications</EmptyTitle>
          <EmptyDescription>You&apos;re all caught up! No new updates to review.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent />
      </Empty>
    )
  }

  async function handleMarkAllRead(): Promise<void> {
    await markAllNotificationsReadAction()
  }

  return (
    <div className="space-y-4">
      {hasUnread && (
        <div className="flex justify-end">
          <Button
            onClick={handleMarkAllRead}
            variant="outline"
            aria-label="Mark all notifications as read"
          >
            Mark all as read
          </Button>
        </div>
      )}

      <ItemGroup className="space-y-3">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </ItemGroup>
    </div>
  )
}
