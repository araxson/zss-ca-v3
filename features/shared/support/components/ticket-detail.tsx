import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ReplyForm } from './reply-form'
import { UpdateStatusButton } from './update-status-button'
import type { TicketWithReplies } from '../api/queries'

interface TicketDetailProps {
  ticket: TicketWithReplies
  currentUserId: string
  isAdmin: boolean
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'open':
      return 'default'
    case 'in_progress':
      return 'secondary'
    case 'resolved':
      return 'outline'
    case 'closed':
      return 'outline'
    default:
      return 'default'
  }
}

function getPriorityVariant(priority: string) {
  switch (priority) {
    case 'high':
      return 'destructive'
    case 'medium':
      return 'default'
    case 'low':
      return 'secondary'
    default:
      return 'default'
  }
}

export function TicketDetail({ ticket, currentUserId: _currentUserId, isAdmin }: TicketDetailProps) {
  const createdAt = new Date(ticket.created_at)
  const canReply = ticket.status !== 'closed'

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-2">
              <CardTitle>{ticket.subject}</CardTitle>
              <CardDescription>
                Created by {ticket.profile.contact_name || ticket.profile.contact_email} on{' '}
                {createdAt.toLocaleDateString()} at {createdAt.toLocaleTimeString()}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant={getPriorityVariant(ticket.priority)}>
                {ticket.priority}
              </Badge>
              <Badge variant={getStatusVariant(ticket.status)}>
                {ticket.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Category</p>
              <p className="font-medium capitalize">
                {ticket.category.replace('_', ' ')}
              </p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground mb-2">Message</p>
              <p className="whitespace-pre-wrap">{ticket.message}</p>
            </div>

            {isAdmin && (
              <>
                <Separator />
                <UpdateStatusButton ticketId={ticket.id} currentStatus={ticket.status} />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {ticket.replies.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Replies</h2>
          {ticket.replies.map((reply) => {
            const replyCreatedAt = new Date(reply.created_at)
            const isFromAdmin = reply.profile.role === 'admin'

            return (
              <Card
                key={reply.id}
                className={isFromAdmin ? 'border-primary' : ''}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle>{reply.profile.contact_name || reply.profile.contact_email}</CardTitle>
                        {isFromAdmin && (
                          <Badge variant="outline">Support Team</Badge>
                        )}
                      </div>
                      <CardDescription>
                        {replyCreatedAt.toLocaleDateString()} at{' '}
                        {replyCreatedAt.toLocaleTimeString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm">{reply.message}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {canReply && <ReplyForm ticketId={ticket.id} />}

      {!canReply && (
        <Card>
          <CardHeader>
            <CardDescription>
              This ticket is closed. Contact support to reopen if needed.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
