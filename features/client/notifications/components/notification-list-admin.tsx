'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell } from 'lucide-react'
import type { NotificationWithProfile } from '../api/queries'
import { deleteNotificationAction } from '../api/mutations'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { NotificationTableRow } from './notification-table-row'

type NotificationListAdminProps = {
  notifications: NotificationWithProfile[]
}

export function NotificationListAdmin({ notifications }: NotificationListAdminProps): React.JSX.Element {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete(notificationId: string): Promise<void> {
    setError(null)
    setDeletingId(notificationId)

    try {
      const result = await deleteNotificationAction({ notificationId })

      if ('error' in result) {
        setError(result.error ?? 'An error occurred')
        setDeletingId(null)
        return
      }

      router.refresh()
    } catch (_error) {
      setError('An unexpected error occurred')
      setDeletingId(null)
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function getTypeBadgeVariant(
    type: string
  ): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (type) {
      case 'billing':
        return 'destructive'
      case 'system':
        return 'default'
      case 'support':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  if (notifications.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Bell />
          </EmptyMedia>
          <EmptyTitle>No notifications found</EmptyTitle>
          <EmptyDescription>Send your first broadcast to populate this list.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent />
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" aria-live="assertive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ScrollArea className="rounded-md border" aria-label="Notifications table">
        <Table className="min-w-[700px] lg:min-w-[960px]">
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notification) => (
              <NotificationTableRow
                key={notification.id}
                notification={notification}
                deletingId={deletingId}
                onDelete={handleDelete}
                formatDate={formatDate}
                getTypeBadgeVariant={getTypeBadgeVariant}
              />
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
