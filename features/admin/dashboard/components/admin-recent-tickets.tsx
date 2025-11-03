'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { ROUTES } from '@/lib/constants/routes'
import { AdminTicketsSearch } from './admin-tickets-search'
import { AdminTicketsTable } from './admin-tickets-table'
import type { TicketStatus, TicketPriority } from '@/lib/types/global.types'

interface AdminRecentTicketsProps {
  tickets: Array<{
    id: string
    subject: string
    status: TicketStatus
    priority: TicketPriority
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
      <Item variant="outline">
        <ItemHeader>
          <ItemTitle>Recent Support Tickets</ItemTitle>
          <ItemDescription>Latest customer support requests</ItemDescription>
        </ItemHeader>
        <ItemContent className="basis-full">
          <div className="p-6">
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No tickets yet</EmptyTitle>
                <EmptyDescription>
                  Support tickets will appear here when clients submit requests
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        </ItemContent>
      </Item>
    )
  }

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle>Recent Support Tickets</ItemTitle>
        <ItemDescription>Latest customer support requests</ItemDescription>
      </ItemHeader>
      <ItemContent className="basis-full">
        <div className="space-y-4 p-6">
          <AdminTicketsSearch
            query={query}
            setQuery={setQuery}
            resultCount={filteredTickets.length}
          />
        </div>
      </ItemContent>
      <ItemActions>
        <div className="flex gap-2" role="group" aria-label="Ticket management actions">
          <Button asChild>
            <Link href={ROUTES.ADMIN_SUPPORT}>Manage Tickets</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`${ROUTES.ADMIN_SUPPORT}/new`}>Create Ticket</Link>
          </Button>
        </div>
      </ItemActions>
      {hasResults ? (
        <ItemContent className="basis-full">
          <AdminTicketsTable tickets={filteredTickets} />
        </ItemContent>
      ) : (
        <ItemContent className="basis-full">
          <div className="p-6">
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
          </div>
        </ItemContent>
      )}
    </Item>
  )
}
