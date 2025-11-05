'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { FieldGroup } from '@/components/ui/field'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import type { Database } from '@/lib/types/database.types'
import { ROUTES, ROUTE_HELPERS } from '@/lib/constants/routes'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import { DashboardSearchField } from './dashboard-search-field'
import { DashboardTicketsStats } from './dashboard-tickets-stats'
import { DashboardTicketsTable } from './dashboard-tickets-table'
import {
  getTicketStatusLabel,
  getTicketPriorityLabel,
  getTicketPriorityVariant,
} from '@/features/client/support/utils'

type SupportTicket = Database['public']['Tables']['support_ticket']['Row']

interface DashboardTicketsTabProps {
  tickets: SupportTicket[]
  ticketChartData: Array<{ name: string; count: number }>
  openTicketsCount: number
}

export function DashboardTicketsTab({
  tickets,
  ticketChartData,
  openTicketsCount,
}: DashboardTicketsTabProps) {
  const [query, setQuery] = useState('')

  // React Compiler automatically memoizes these simple operations
  const trimmedQuery = query.trim().toLowerCase()
  const filteredTickets = !trimmedQuery
    ? tickets
    : tickets.filter((ticket) => {
        const values = [ticket.subject, ticket.status, ticket.priority]
        return values.some((value) => value.toLowerCase().includes(trimmedQuery))
      })

  const hasQuery = trimmedQuery.length > 0
  const ticketsToRender = hasQuery ? filteredTickets : tickets
  const chartDataToRender = !hasQuery
    ? ticketChartData
    : (() => {
        const grouped = filteredTickets.reduce<Record<string, number>>((acc, ticket) => {
          const label = ticket.status.replace('_', ' ')
          acc[label] = (acc[label] ?? 0) + 1
          return acc
        }, {})
        return Object.entries(grouped).map(([name, count]) => ({ name, count }))
      })()

  const filteredOpenTicketsCount = filteredTickets.filter((ticket) => ticket.status === 'open').length
  const hasResults = ticketsToRender.length > 0

  const searchSuggestions = ticketsToRender.slice(0, 6).map((ticket) => ({
    value: ticket.subject || ticket.id,
    label: ticket.subject || 'Untitled ticket',
    href: ROUTE_HELPERS.clientSupportDetail(ticket.id),
    description: `${getTicketPriorityLabel(ticket.priority)} • ${getTicketStatusLabel(ticket.status)}`,
    badge: getTicketPriorityLabel(ticket.priority),
    badgeVariant: getTicketPriorityVariant(ticket.priority),
  }))

  if (tickets.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No support tickets</EmptyTitle>
          <EmptyDescription>You haven&apos;t submitted any support requests yet</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href={ROUTES.CLIENT_SUPPORT}>Create Ticket</Link>
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <>
      <FieldGroup>
        <DashboardSearchField
          label="Search tickets"
          placeholder="Search by subject, status, or priority"
          value={query}
          onChange={setQuery}
          resultsCount={ticketsToRender.length}
          suggestions={searchSuggestions}
          description="Filter your support history. Charts and summaries update with your search."
          ariaLabel="Search support tickets"
        />

        <div className="flex gap-2" role="group" aria-label="Support actions">
          <Button asChild>
            <Link href={ROUTES.CLIENT_SUPPORT}>Manage Tickets</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={ROUTES.CLIENT_SUPPORT_NEW}>Create Ticket</Link>
          </Button>
        </div>
      </FieldGroup>

      {hasResults ? (
        <>
          <div className="grid gap-4 md:grid-cols-2" role="list" aria-label="Support insights">
            <Item variant="outline">
              <ItemHeader>
                <ItemTitle>Ticket Status</ItemTitle>
                <ItemDescription>Distribution of your tickets by status</ItemDescription>
              </ItemHeader>
              <ItemContent>
                {chartDataToRender.length > 0 ? (
                  <ChartContainer
                    config={{
                      count: {
                        label: 'Tickets',
                        color: 'var(--chart-3)',
                      },
                    }}
                    className="min-h-[208px]"
                  >
                    <BarChart accessibilityLayer data={chartDataToRender}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <Empty className="h-52">
                    <EmptyHeader>
                      <EmptyTitle>No ticket data</EmptyTitle>
                      <EmptyDescription>Ticket statistics will appear here</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </ItemContent>
            </Item>

            <DashboardTicketsStats
              totalTickets={ticketsToRender.length}
              openTicketsCount={hasQuery ? filteredOpenTicketsCount : openTicketsCount}
            />
          </div>

          <Item variant="outline">
            <ItemHeader>
              <ItemTitle>Recent Support Tickets</ItemTitle>
              <ItemDescription>Your latest support requests</ItemDescription>
            </ItemHeader>
            <ItemContent>
              <DashboardTicketsTable tickets={ticketsToRender} />
            </ItemContent>
          </Item>
        </>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No matching tickets</EmptyTitle>
            <EmptyDescription>
              Adjust your search terms or clear the filter to view your support requests
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button type="button" variant="outline" onClick={() => setQuery('')}>
              Clear filter
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </>
  )
}
