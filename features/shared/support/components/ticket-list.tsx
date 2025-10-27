import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
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
          <Link key={ticket.id} href={`${basePath}/${ticket.id}`}>
            <Card className="hover:bg-accent/50 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="truncate">
                      <CardTitle>{ticket.subject}</CardTitle>
                    </div>
                    <CardDescription>
                      {ticket.category.replace('_', ' ')} •{' '}
                      {createdAt.toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Badge variant={getPriorityVariant(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge variant={getStatusVariant(ticket.status)}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
