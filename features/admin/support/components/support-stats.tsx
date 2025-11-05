'use client'

import {
  MessageCircle,
  Clock,
  CheckCircle2,
  Archive,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { TicketWithProfile } from '@/features/admin/support/api/queries'

interface SupportStatsProps {
  tickets: TicketWithProfile[]
}

export function SupportStats({ tickets }: SupportStatsProps): React.JSX.Element {
  const openTickets = tickets.filter((t) => t.status === 'open')
  const inProgressTickets = tickets.filter((t) => t.status === 'in_progress')
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved')
  const closedTickets = tickets.filter((t) => t.status === 'closed')

  const totalCount = tickets.length
  const openRate = totalCount > 0 ? (openTickets.length / totalCount) * 100 : 0
  const resolutionRate = totalCount > 0 ? (resolvedTickets.length / totalCount) * 100 : 0

  const stats = [
    {
      key: 'open',
      label: 'Open tickets',
      value: openTickets.length,
      description:
        openRate >= 35
          ? 'Queue load rising; triage new submissions first.'
          : 'Within SLA thresholds for first response.',
      badge: `${openRate.toFixed(0)}% open`,
      badgeIcon: openRate >= 35 ? TrendingUp : TrendingDown,
      footerHeadline: openRate >= 35 ? 'Queue load rising' : 'Queue under control',
      footerHelper: `${openTickets.length} conversations awaiting first response.`,
      icon: MessageCircle,
    },
    {
      key: 'in-progress',
      label: 'In progress',
      value: inProgressTickets.length,
      description: 'Reassign or unblock owners to keep momentum.',
      badge: `${inProgressTickets.length || '0'} active`,
      badgeIcon: inProgressTickets.length > 0 ? TrendingUp : TrendingDown,
      footerHeadline:
        inProgressTickets.length > 0 ? 'Agents actively engaged' : 'No active investigations',
      footerHelper: 'Tickets with ongoing collaboration.',
      icon: Clock,
    },
    {
      key: 'resolved',
      label: 'Resolved',
      value: resolvedTickets.length,
      description: 'Verify satisfaction before closing the loop.',
      badge: `${resolutionRate.toFixed(0)}%`,
      badgeIcon: resolutionRate >= 80 ? TrendingUp : TrendingDown,
      footerHeadline:
        resolutionRate >= 80 ? 'Resolution rate trending up' : 'Monitor for SLA risk',
      footerHelper: 'Marked as solved and pending confirmation.',
      icon: CheckCircle2,
    },
    {
      key: 'closed',
      label: 'Closed',
      value: closedTickets.length,
      description: 'Auto-archived after confirmation.',
      badge: `${closedTickets.length || '0'}`,
      badgeIcon: closedTickets.length > 0 ? TrendingUp : TrendingDown,
      footerHeadline:
        closedTickets.length > 0 ? 'Lifecycle complete' : 'Awaiting confirmations',
      footerHelper: 'Archived conversations for reference.',
      icon: Archive,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 px-0 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const TrendIcon = stat.badgeIcon
        return (
          <Card key={stat.key} className="@container/card">
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle>
                {stat.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline" className="flex items-center gap-1">
                  <TrendIcon className="size-3" aria-hidden="true" />
                  {stat.badge}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex items-center gap-2 font-medium">
                <stat.icon className="size-4" aria-hidden="true" />
                {stat.footerHeadline}
              </div>
              <div className="text-muted-foreground">{stat.footerHelper}</div>
              <div className="text-muted-foreground">{stat.description}</div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
