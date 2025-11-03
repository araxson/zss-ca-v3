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
import {
  getTicketStatusVariant,
  getTicketPriorityVariant,
  getTicketStatusLabel,
  getTicketPriorityLabel,
} from '@/features/shared/support/utils'
import type { TicketStatus, TicketPriority } from '@/lib/types/global.types'

interface Ticket {
  id: string
  subject: string
  status: TicketStatus
  priority: TicketPriority
  created_at: string
  profile: { contact_name: string | null; company_name: string | null } | null
}

interface TicketsTableProps {
  tickets: Ticket[]
}

export function AdminTicketsTable({ tickets }: TicketsTableProps) {
  return (
    <ScrollArea className="rounded-md border" aria-label="Recent support tickets table">
      <Table>
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
              <TableCell>
                <span className="font-medium">
                  <Link
                    href={`${ROUTES.ADMIN_SUPPORT}/${ticket.id}`}
                    className="hover:underline"
                  >
                    {ticket.subject}
                  </Link>
                </span>
              </TableCell>
              <TableCell>
                {ticket.profile?.company_name ?? ticket.profile?.contact_name ?? 'Unknown'}
              </TableCell>
              <TableCell>
                <Badge variant={getTicketStatusVariant(ticket.status)}>
                  {getTicketStatusLabel(ticket.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getTicketPriorityVariant(ticket.priority)}>
                  {getTicketPriorityLabel(ticket.priority)}
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
  )
}
