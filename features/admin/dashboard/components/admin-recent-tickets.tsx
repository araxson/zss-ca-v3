'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ROUTES } from '@/lib/constants/routes'

interface AdminRecentTicketsProps {
  tickets: Array<{
    id: string
    subject: string
    status: string
    priority: string
    created_at: string
    profile: { contact_name: string | null; company_name: string | null } | null
  }>
}

export function AdminRecentTickets({ tickets }: AdminRecentTicketsProps) {
  return (
    <Item variant="outline" className="flex flex-col">
      <ItemHeader className="gap-1">
        <ItemTitle>Recent Support Tickets</ItemTitle>
        <ItemDescription>Latest customer support requests</ItemDescription>
      </ItemHeader>
      <ItemContent>
        {tickets.length > 0 ? (
          <ScrollArea className="rounded-md border">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`${ROUTES.ADMIN_SUPPORT}/${ticket.id}`}
                        className="hover:underline"
                      >
                        {ticket.subject}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {ticket.profile?.company_name ?? ticket.profile?.contact_name ?? 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ticket.status === 'open'
                            ? 'destructive'
                            : ticket.status === 'in_progress'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ticket.priority === 'urgent'
                            ? 'destructive'
                            : ticket.priority === 'high'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
          <Empty className="h-52">
            <EmptyHeader>
              <EmptyTitle>No tickets yet</EmptyTitle>
              <EmptyDescription>Support tickets will appear here when clients submit requests</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ItemContent>
    </Item>
  )
}
