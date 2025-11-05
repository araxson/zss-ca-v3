'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Info } from 'lucide-react'
import { AdminOverviewStats } from './admin-overview-stats'
import { AdminOverviewCharts } from './admin-overview-charts'
import { AdminOverviewActions } from './admin-overview-actions'
import { AdminRecentClients } from './admin-recent-clients'
import { AdminRecentTickets } from './admin-recent-tickets'
import type { TicketStatus, TicketPriority } from '@/lib/types/global.types'

interface AdminOverviewProps {
  stats: {
    totalClients: number
    activeSubscriptions: number
    liveSites: number
    openTickets: number
    recentClients: Array<{
      id: string
      contact_name: string | null
      contact_email: string | null
      company_name: string | null
      created_at: string
    }>
    recentTickets: Array<{
      id: string
      subject: string
      status: TicketStatus
      priority: TicketPriority
      created_at: string
      profile_id: string
      profile: { contact_name: string | null; company_name: string | null } | null
    }>
    planDistribution: Record<string, number>
    statusDistribution: Record<string, number>
  }
}

export function AdminOverview({ stats }: AdminOverviewProps): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your platform metrics and activities
        </p>
      </div>

      <AdminOverviewStats stats={stats} />

      {stats.openTickets > 5 ? (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" aria-hidden="true" />
          <AlertTitle>High ticket volume</AlertTitle>
          <AlertDescription>
            {stats.openTickets} open tickets require attention. Review high-priority requests to keep SLAs on track.
          </AlertDescription>
        </Alert>
      ) : null}

      {stats.totalClients > 0 && stats.activeSubscriptions < stats.totalClients * 0.5 ? (
        <Alert>
          <Info className="size-4" aria-hidden="true" />
          <AlertTitle>Conversion opportunity</AlertTitle>
          <AlertDescription>
            Only {Math.round((stats.activeSubscriptions / stats.totalClients) * 100)}% of clients hold active subscriptions. Consider nurturing inactive accounts.
          </AlertDescription>
        </Alert>
      ) : null}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList aria-label="Admin dashboard sections">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clients">Recent Clients</TabsTrigger>
          <TabsTrigger value="tickets">Recent Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AdminOverviewCharts stats={stats} />
          <AdminOverviewActions
            stats={{
              totalClients: stats.totalClients,
              activeSubscriptions: stats.activeSubscriptions,
              liveSites: stats.liveSites,
              openTickets: stats.openTickets,
            }}
          />
        </TabsContent>

        <TabsContent value="clients">
          <AdminRecentClients clients={stats.recentClients} />
        </TabsContent>

        <TabsContent value="tickets">
          <AdminRecentTickets tickets={stats.recentTickets} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
