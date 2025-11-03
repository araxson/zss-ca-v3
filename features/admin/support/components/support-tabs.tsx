'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TicketList } from '@/features/shared/support/components/ticket-list'
import type { TicketWithProfile } from '@/features/shared/support/api/queries'

interface SupportTabsProps {
  tickets: TicketWithProfile[]
}

export function SupportTabs({ tickets }: SupportTabsProps) {
  const openTickets = tickets.filter((t) => t.status === 'open')
  const inProgressTickets = tickets.filter((t) => t.status === 'in_progress')
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved')
  const closedTickets = tickets.filter((t) => t.status === 'closed')

  const ticketViews = [
    { value: 'open', label: `Open (${openTickets.length})`, items: openTickets },
    {
      value: 'in_progress',
      label: `In Progress (${inProgressTickets.length})`,
      items: inProgressTickets,
    },
    { value: 'resolved', label: `Resolved (${resolvedTickets.length})`, items: resolvedTickets },
    { value: 'closed', label: `Closed (${closedTickets.length})`, items: closedTickets },
    { value: 'all', label: `All (${tickets.length})`, items: tickets },
  ]

  return (
    <Tabs defaultValue="open" className="flex flex-col gap-6">
      <TabsList
        aria-label="Support ticket filters"
        className="flex w-full flex-wrap justify-start gap-2 rounded-xl bg-muted/60 p-1"
      >
        {ticketViews.map((view) => (
          <TabsTrigger
            key={view.value}
            value={view.value}
            className="min-w-[140px] flex-1 rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm md:flex-none"
          >
            {view.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {ticketViews.map((view) => (
        <TabsContent key={view.value} value={view.value} className="mt-2">
          <TicketList tickets={view.items} basePath="/admin/support" />
        </TabsContent>
      ))}
    </Tabs>
  )
}
