'use client'

import { Trash2, User, Calendar, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
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
import { Spinner } from '@/components/ui/spinner'
import type { NotificationWithProfile } from '../api/queries'

interface NotificationTableRowProps {
  notification: NotificationWithProfile
  deletingId: string | null
  onDelete: (notificationId: string) => Promise<void>
  formatDate: (dateString: string) => string
  getTypeBadgeVariant: (
    type: string
  ) => 'default' | 'secondary' | 'destructive' | 'outline'
}

export function NotificationTableRow({
  notification,
  deletingId,
  onDelete,
  formatDate,
  getTypeBadgeVariant,
}: NotificationTableRowProps) {
  return (
    <TableRow key={notification.id}>
      <TableCell>
        <Badge variant={getTypeBadgeVariant(notification.notification_type)}>
          <Tag className="mr-1 size-3" />
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
          <User className="size-4 text-muted-foreground" />
          <span className="text-sm">
            {notification.profile.contact_name ||
              notification.profile.contact_email}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="size-4" />
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
              disabled={deletingId === notification.id}
            >
              <Trash2 className="size-4" aria-hidden="true" />
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
              <div className="flex gap-2">
                <AlertDialogCancel asChild>
                  <Button variant="outline">Cancel</Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    variant="destructive"
                    onClick={() => onDelete(notification.id)}
                    disabled={deletingId === notification.id}
                  >
                    {deletingId === notification.id ? <Spinner /> : 'Delete'}
                  </Button>
                </AlertDialogAction>
              </div>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  )
}
