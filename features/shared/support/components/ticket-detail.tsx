import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { ChevronDown, MessageSquare } from 'lucide-react'
import { ReplyForm } from './reply-form'
import { UpdateStatusButton } from './update-status-button'
import type { TicketWithReplies } from '../api/queries'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'

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
    <ItemGroup className="space-y-6">
      <Item variant="outline" className="flex flex-col gap-4 p-4">
        <ItemContent className="space-y-1">
          <ItemTitle>{ticket.subject}</ItemTitle>
          <ItemDescription>
            Created by {ticket.profile.contact_name || ticket.profile.contact_email} on{' '}
            {createdAt.toLocaleDateString()} at {createdAt.toLocaleTimeString()}
          </ItemDescription>
        </ItemContent>
        <ItemActions className="flex gap-2">
          <Badge variant={getPriorityVariant(ticket.priority)}>
            {ticket.priority}
          </Badge>
          <Badge variant={getStatusVariant(ticket.status)}>
            {ticket.status.replace('_', ' ')}
          </Badge>
        </ItemActions>
      </Item>

      <FieldSet className="space-y-4 rounded-lg border p-4">
        <FieldLegend>Ticket details</FieldLegend>
        <FieldGroup className="space-y-4">
          <Field>
            <FieldLabel>Category</FieldLabel>
            <FieldDescription className="capitalize">
              {ticket.category.replace('_', ' ')}
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Message</FieldLabel>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {ticket.message}
            </p>
          </Field>
          {isAdmin && (
            <Field>
              <FieldLabel>Admin Controls</FieldLabel>
              <UpdateStatusButton ticketId={ticket.id} currentStatus={ticket.status} />
            </Field>
          )}
        </FieldGroup>
      </FieldSet>

      {ticket.replies.length > 0 && (
        <Collapsible defaultOpen className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <h2 className="text-lg font-semibold">
                Replies ({ticket.replies.length})
              </h2>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown className="h-4 w-4" />
                <span className="sr-only">Toggle replies</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-4">
            {ticket.replies.map((reply) => {
              const replyCreatedAt = new Date(reply.created_at)
              const isFromAdmin = reply.profile.role === 'admin'

              return (
                <Item
                  key={reply.id}
                  variant="outline"
                  className={isFromAdmin ? 'border-primary' : ''}
                >
                  <ItemContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ItemTitle>{reply.profile.contact_name || reply.profile.contact_email}</ItemTitle>
                      {isFromAdmin && <Badge variant="outline">Support Team</Badge>}
                    </div>
                    <ItemDescription>
                      {replyCreatedAt.toLocaleDateString()} at {replyCreatedAt.toLocaleTimeString()}
                    </ItemDescription>
                    <p className="whitespace-pre-wrap text-sm">{reply.message}</p>
                  </ItemContent>
                </Item>
              )
            })}
          </CollapsibleContent>
        </Collapsible>
      )}

      {canReply && <ReplyForm ticketId={ticket.id} />}

      {!canReply && (
        <Alert>
          <AlertTitle>Ticket closed</AlertTitle>
          <AlertDescription>
            Contact support if you need to reopen this request.
          </AlertDescription>
        </Alert>
      )}
    </ItemGroup>
  )
}
