'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { type LucideIcon, CheckCircle2, Info, AlertCircle, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { markNotificationReadAction } from '../api/mutations'
import type { Notification } from '../api/queries'

interface NotificationItemProps {
  notification: Notification
}

const TYPE_ICON_MAP: Record<string, LucideIcon> = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
}

const TYPE_BADGE_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  success: 'default',
  warning: 'outline',
  error: 'destructive',
}

function formatTypeLabel(type: string) {
  return type
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

export function NotificationItem({ notification }: NotificationItemProps): React.JSX.Element {
  const [isMarkingRead, setIsMarkingRead] = useState(false)
  const isUnread = !notification.read_at
  const createdAt = new Date(notification.created_at)

  async function handleMarkRead(): Promise<void> {
    if (notification.read_at || isMarkingRead) return

    setIsMarkingRead(true)
    const result = await markNotificationReadAction({ notificationId: notification.id })

    if (result.error) {
      toast.error('Failed to mark as read', {
        description: result.error,
      })
      setIsMarkingRead(false)
    } else {
      toast.success('Marked as read')
    }
  }

  const iconType = TYPE_ICON_MAP[notification.notification_type] ?? Info
  const Icon = iconType
  const badgeVariant =
    TYPE_BADGE_VARIANT[notification.notification_type] ?? 'secondary'
  const badgeLabel = formatTypeLabel(notification.notification_type)

  const content = (
    <Item variant="outline" className={isUnread ? 'border-primary' : ''}>
      <ItemMedia>
        <Icon className="size-5 text-muted-foreground" aria-hidden />
      </ItemMedia>
      <ItemContent className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <ItemTitle>{notification.title}</ItemTitle>
            {notification.body ? (
              <ItemDescription>{notification.body}</ItemDescription>
            ) : null}
          </div>
          <ItemActions className="gap-2">
            <Badge variant={badgeVariant}>{badgeLabel}</Badge>
            {isUnread && <Badge variant="default">New</Badge>}
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(createdAt, { addSuffix: true })}
            </span>
          </ItemActions>
        </div>
        {isUnread && (
          <ItemGroup className="flex items-center justify-between gap-4">
            <ItemDescription>Mark this update as reviewed.</ItemDescription>
            <Button
              size="sm"
              variant="outline"
              onClick={handleMarkRead}
              disabled={isMarkingRead}
              aria-label={`Mark notification ${notification.title} as read`}
            >
              {isMarkingRead ? <Spinner /> : 'Mark as read'}
            </Button>
          </ItemGroup>
        )}
      </ItemContent>
    </Item>
  )

  if (notification.action_url) {
    return (
      <Link
        href={notification.action_url}
        onClick={handleMarkRead}
        aria-label={`Open notification action for ${notification.title}`}
      >
        {content}
      </Link>
    )
  }

  return content
}
