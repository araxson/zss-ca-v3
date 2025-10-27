'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, User, Calendar, Tag } from 'lucide-react'
import type { NotificationWithProfile } from '../api/queries'
import { deleteNotificationAction } from '../api/mutations'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'

type NotificationListAdminProps = {
  notifications: NotificationWithProfile[]
}

export function NotificationListAdmin({ notifications }: NotificationListAdminProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete(notificationId: string) {
    setError(null)
    setDeletingId(notificationId)

    try {
      const result = await deleteNotificationAction({ notificationId })

      if (result.error) {
        setError(result.error)
        setDeletingId(null)
        return
      }

      router.refresh()
    } catch (_error) {
      setError('An unexpected error occurred')
      setDeletingId(null)
    }
  }

  function formatDate(dateString: string) {
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
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <ScrollArea className="rounded-md border">
        <Table className="min-w-[960px]">
          <TableCaption>Latest notifications sent to clients with status tracking.</TableCaption>
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
              <TableRow key={notification.id}>
                <TableCell>
                  <Badge variant={getTypeBadgeVariant(notification.notification_type)}>
                    <Tag className="mr-1 h-3 w-3" />
                    {notification.notification_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{notification.title}</span>
                    {notification.body && (
                      <span className="text-sm text-muted-foreground line-clamp-1">
                        {notification.body}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {notification.profile.contact_name ||
                        notification.profile.contact_email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {formatDate(notification.created_at)}
                  </div>
                </TableCell>
                <TableCell>
                  {notification.read_at ? (
                    <Badge variant="outline">Read</Badge>
                  ) : (
                    <Badge>Unread</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        aria-label="Delete notification"
                        variant="ghost"
                        size="sm"
                        disabled={deletingId === notification.id}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Notification</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this notification? This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <ButtonGroup>
                            <AlertDialogCancel asChild>
                              <Button variant="outline">Cancel</Button>
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <Button
                                variant="destructive"
                                onClick={() => handleDelete(notification.id)}
                                disabled={deletingId === notification.id}
                              >
                                {deletingId === notification.id ? <Spinner /> : 'Delete'}
                              </Button>
                            </AlertDialogAction>
                          </ButtonGroup>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
