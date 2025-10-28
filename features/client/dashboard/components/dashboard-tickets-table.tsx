'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ROUTES } from '@/lib/constants/routes'
import type { Database } from '@/lib/types/database.types'

type SupportTicket = Database['public']['Tables']['support_ticket']['Row']

interface DashboardTicketsTableProps {
  tickets: SupportTicket[]
}

export function DashboardTicketsTable({ tickets }: DashboardTicketsTableProps) {
  return (
    <ScrollArea className="rounded-md border" aria-label="Support tickets table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>
                <span className="font-medium">
                  <Link
                    href={`${ROUTES.CLIENT_SUPPORT}/${ticket.id}`}
                    className="hover:underline"
                  >
                    {ticket.subject}
                  </Link>
                </span>
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
      <ScrollBar orientation="vertical" />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
