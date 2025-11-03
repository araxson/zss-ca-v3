'use client'

import { SupportStats } from './support-stats'
import { SupportTabs } from './support-tabs'
import type { TicketWithProfile } from '@/features/shared/support/api/queries'

interface SupportPageFeatureProps {
  tickets: TicketWithProfile[]
}

export function SupportPageFeature({ tickets }: SupportPageFeatureProps) {
  const totalCount = tickets.length

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">Support Tickets</h1>
        <p className="text-muted-foreground">
          View and manage client support requests — {totalCount}{' '}
          {totalCount === 1 ? 'ticket' : 'tickets'} total
        </p>
      </div>

      <SupportStats tickets={tickets} />
      <SupportTabs tickets={tickets} />
    </div>
  )
}
