'use client'

import { formatDistanceToNow } from 'date-fns'
import { type LucideIcon, CheckCircle2, Info, AlertCircle, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
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

export function NotificationItem({ notification }: NotificationItemProps) {
  const isUnread = !notification.read_at
  const createdAt = new Date(notification.created_at)

  async function handleMarkRead() {
    if (notification.read_at) return

    await markNotificationReadAction({ notificationId: notification.id })
  }

  const iconType = TYPE_ICON_MAP[notification.notification_type] ?? Info
  const Icon = iconType
  const badgeVariant =
    TYPE_BADGE_VARIANT[notification.notification_type] ?? 'secondary'
  const badgeLabel = formatTypeLabel(notification.notification_type)

  const content = (
    <Card className={isUnread ? 'border-primary' : ''}>
      <CardHeader>
        <div className="flex items-start gap-3">
          <Icon className="mt-1 h-5 w-5" aria-hidden />
          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between gap-4">
              <CardTitle>{notification.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant={badgeVariant}>{badgeLabel}</Badge>
                {isUnread && <Badge variant="default">New</Badge>}
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(createdAt, { addSuffix: true })}
                </span>
              </div>
            </div>
            {notification.body && (
              <CardDescription>{notification.body}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      {isUnread && (
        <CardContent className="pt-0">
          <FieldGroup className="flex items-center justify-between gap-4">
            <FieldLabel className="text-xs text-muted-foreground">
              Mark this update as reviewed.
            </FieldLabel>
            <Button size="sm" variant="outline" onClick={handleMarkRead}>
              Mark as read
            </Button>
          </FieldGroup>
        </CardContent>
      )}
    </Card>
  )

  if (notification.action_url) {
    return (
      <Link href={notification.action_url} onClick={handleMarkRead}>
        {content}
      </Link>
    )
  }

  return content
}
