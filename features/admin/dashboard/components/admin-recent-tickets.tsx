'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Search, X } from 'lucide-react'
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
  const [query, setQuery] = useState('')

  const filteredTickets = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return tickets

    return tickets.filter((ticket) => {
      const values = [
        ticket.subject,
        ticket.priority,
        ticket.status,
        ticket.profile?.company_name,
        ticket.profile?.contact_name,
      ]

      return values.some((value) => value?.toLowerCase().includes(term))
    })
  }, [tickets, query])

  const hasTickets = tickets.length > 0
  const hasResults = filteredTickets.length > 0

  if (!hasTickets) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Support Tickets</CardTitle>
          <CardDescription>Latest customer support requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No tickets yet</EmptyTitle>
              <EmptyDescription>
                Support tickets will appear here when clients submit requests
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Support Tickets</CardTitle>
        <CardDescription>Latest customer support requests</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldGroup>
          <Field orientation="responsive">
            <FieldLabel htmlFor="admin-ticket-search">Search tickets</FieldLabel>
            <FieldContent>
              <InputGroup>
                <InputGroupInput
                  id="admin-ticket-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by subject, client, status, or priority"
                  aria-label="Search support tickets"
                />
                <InputGroupAddon align="inline-start" aria-hidden="true">
                  <Search className="size-4" />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <InputGroupText aria-live="polite">
                    {hasResults ? `${filteredTickets.length} results` : '0 results'}
                  </InputGroupText>
                  {query ? (
                    <InputGroupButton
                      type="button"
                      onClick={() => setQuery('')}
                      aria-label="Clear search"
                    >
                      <X className="size-4" />
                    </InputGroupButton>
                  ) : null}
                </InputGroupAddon>
              </InputGroup>
              <FieldDescription>Filter recent tickets. Results update instantly.</FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
        <ButtonGroup aria-label="Support actions">
          <Button asChild>
            <Link href={ROUTES.ADMIN_SUPPORT}>Manage Tickets</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`${ROUTES.ADMIN_SUPPORT}/new`}>Create Ticket</Link>
          </Button>
        </ButtonGroup>
        {hasResults ? (
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
                {filteredTickets.map((ticket) => (
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
          <Empty aria-live="polite">
            <EmptyHeader>
              <EmptyTitle>No matching tickets</EmptyTitle>
              <EmptyDescription>
                Adjust your search or clear the filter to view all recent support requests
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button type="button" variant="outline" onClick={() => setQuery('')}>
                Clear filter
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}
