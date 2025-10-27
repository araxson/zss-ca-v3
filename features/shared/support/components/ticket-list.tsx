import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import type { TicketWithProfile } from '../api/queries'

interface TicketListProps {
  tickets: TicketWithProfile[]
  basePath: string
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

export function TicketList({ tickets, basePath }: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No tickets yet</EmptyTitle>
          <EmptyDescription>
            Create a support request to start a conversation with our team.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <p className="text-muted-foreground">
            We&rsquo;ll notify you by email as soon as a ticket is opened.
          </p>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => {
        const createdAt = new Date(ticket.created_at)

        return (
          <Item asChild key={ticket.id}>
            <Link href={`${basePath}/${ticket.id}`}>
              <ItemContent className="min-w-0 gap-1">
                <ItemTitle>{ticket.subject}</ItemTitle>
                <ItemDescription>
                  {ticket.category.replace('_', ' ')} • {createdAt.toLocaleDateString()}
                </ItemDescription>
              </ItemContent>
              <ItemActions className="gap-2">
                <Badge variant={getPriorityVariant(ticket.priority)}>
                  {ticket.priority}
                </Badge>
                <Badge variant={getStatusVariant(ticket.status)}>
                  {ticket.status.replace('_', ' ')}
                </Badge>
              </ItemActions>
            </Link>
          </Item>
        )
      })}
    </div>
  )
}
