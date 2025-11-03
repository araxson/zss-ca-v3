'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Item, ItemContent, ItemTitle, ItemDescription } from '@/components/ui/item'
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
      profile: { contact_name: string | null; company_name: string | null } | null
    }>
    planDistribution: Record<string, number>
    statusDistribution: Record<string, number>
  }
}

export function AdminOverview({ stats }: AdminOverviewProps) {
  return (
    <div className="space-y-6">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle className="text-3xl font-bold tracking-tight">Admin Dashboard</ItemTitle>
          <ItemDescription>Overview of your platform performance and key metrics</ItemDescription>
        </ItemContent>
      </Item>

      <AdminOverviewStats stats={stats} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList aria-label="Admin dashboard sections">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clients">Recent Clients</TabsTrigger>
          <TabsTrigger value="tickets">Recent Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AdminOverviewCharts stats={stats} />
          <AdminOverviewActions />
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <AdminRecentClients clients={stats.recentClients} />
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <AdminRecentTickets tickets={stats.recentTickets} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
