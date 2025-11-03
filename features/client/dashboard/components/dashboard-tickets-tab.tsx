'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
  ItemGroup,
} from '@/components/ui/item'
import type { Database } from '@/lib/types/database.types'
import { ROUTES } from '@/lib/constants/routes'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import { DashboardTicketsStats } from './dashboard-tickets-stats'
import { DashboardTicketsTable } from './dashboard-tickets-table'

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

  const trimmedQuery = query.trim().toLowerCase()
  const filteredTickets = useMemo(() => {
    if (!trimmedQuery) return tickets
    return tickets.filter((ticket) => {
      const values = [ticket.subject, ticket.status, ticket.priority]
      return values.some((value) => value.toLowerCase().includes(trimmedQuery))
    })
  }, [tickets, trimmedQuery])
  const hasQuery = trimmedQuery.length > 0
  const ticketsToRender = hasQuery ? filteredTickets : tickets
  const chartDataToRender = useMemo(() => {
    if (!hasQuery) return ticketChartData
    const grouped = filteredTickets.reduce<Record<string, number>>((acc, ticket) => {
      const label = ticket.status.replace('_', ' ')
      acc[label] = (acc[label] ?? 0) + 1
      return acc
    }, {})
    return Object.entries(grouped).map(([name, count]) => ({ name, count }))
  }, [filteredTickets, hasQuery, ticketChartData])
  const filteredOpenTicketsCount = useMemo(
    () => filteredTickets.filter((ticket) => ticket.status === 'open').length,
    [filteredTickets],
  )
  const hasResults = ticketsToRender.length > 0

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
        <Field orientation="responsive">
          <FieldLabel htmlFor="client-ticket-search">Search tickets</FieldLabel>
          <FieldContent>
            <InputGroup>
              <InputGroupInput
                id="client-ticket-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by subject, status, or priority"
                aria-label="Search support tickets"
              />
              <InputGroupAddon align="inline-start" aria-hidden="true">
                <Search className="size-4" />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupText aria-live="polite">
                  {ticketsToRender.length} results
                </InputGroupText>
                {hasQuery ? (
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
            <FieldDescription>
              Filter your support history. Charts and summaries update with your search.
            </FieldDescription>
          </FieldContent>
        </Field>

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
          <ItemGroup className="!grid gap-4 md:grid-cols-2" aria-label="Support insights">
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
                        color: 'hsl(var(--chart-3))',
                      },
                    }}
                    className="min-h-[208px]"
                  >
                    <BarChart data={chartDataToRender}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
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
          </ItemGroup>

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
