'use client'

import { SupportStats } from './support-stats'
import { SupportTabs } from './support-tabs'
import type { TicketWithProfile } from '@/features/admin/support/api/queries'

interface SupportPageFeatureProps {
  tickets: TicketWithProfile[]
}

export function SupportPageFeature({ tickets }: SupportPageFeatureProps): React.JSX.Element {
  const totalCount = tickets.length

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {totalCount} {totalCount === 1 ? 'ticket' : 'tickets'} total
        </p>
      </div>

      <SupportStats tickets={tickets} />
      <SupportTabs tickets={tickets} />
    </div>
  )
}
