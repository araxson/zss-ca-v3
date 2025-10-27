'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROUTES } from '@/lib/constants/routes'
import type { Database } from '@/lib/types/database.types'
import { DashboardSummaryCards } from './dashboard-summary-cards'
import { DashboardSitesTab } from './dashboard-sites-tab'
import { DashboardTicketsTab } from './dashboard-tickets-tab'
import { DashboardAccountTab } from './dashboard-account-tab'
import { getSiteStatusLabel } from './dashboard-site-helpers'

type Profile = Database['public']['Tables']['profile']['Row']
type Subscription = Database['public']['Tables']['subscription']['Row'] & {
  plan: Database['public']['Tables']['plan']['Row'] | null
}
type ClientSite = Database['public']['Tables']['client_site']['Row']
type SupportTicket = Database['public']['Tables']['support_ticket']['Row']

interface DashboardOverviewProps {
  profile: Profile | null
  subscription: Subscription | null
  sites: ClientSite[]
  tickets: SupportTicket[]
  openTicketsCount: number
}

export function DashboardOverview({
  profile,
  subscription,
  sites,
  tickets,
  openTicketsCount,
}: DashboardOverviewProps) {
  const router = useRouter()
  const activeSites = sites.filter(site => site.status === 'live')
  const sitesInProgress = sites.filter(site =>
    ['pending', 'in_production', 'awaiting_client_content', 'ready_for_review'].includes(site.status)
  )

  const sitesByStatus = sites.reduce((acc, site) => {
    const label = getSiteStatusLabel(site.status)
    acc[label] = (acc[label] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const siteStatusChartData = Object.entries(sitesByStatus).map(([name, count]) => ({
    name,
    count,
  }))

  const ticketsByStatus = tickets.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const ticketChartData = Object.entries(ticketsByStatus).map(([status, count]) => ({
    name: status.replace('_', ' '),
    count,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{profile?.company_name ? `, ${profile.company_name}` : ''}
        </h1>
        <p className="text-muted-foreground">Here&apos;s an overview of your account</p>
      </div>

      <Separator />

      {!subscription && (
        <Alert>
          <AlertTitle>No active subscription</AlertTitle>
          <AlertDescription>
            Subscribe to a plan to get started with your website.
          </AlertDescription>
          <div className="mt-4 flex justify-start sm:justify-end">
            <Button asChild>
              <Link href={ROUTES.PRICING}>View Plans</Link>
            </Button>
          </div>
        </Alert>
      )}

      <DashboardSummaryCards
        subscription={subscription}
        sitesCount={sites.length}
        activeSitesCount={activeSites.length}
        sitesInProgressCount={sitesInProgress.length}
        openTicketsCount={openTicketsCount}
      />

      <Tabs defaultValue="sites" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sites">My Websites</TabsTrigger>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="sites" className="space-y-4">
          <DashboardSitesTab
            sites={sites}
            subscription={subscription}
            siteStatusChartData={siteStatusChartData}
            activeSitesCount={activeSites.length}
            sitesInProgressCount={sitesInProgress.length}
          />
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <DashboardTicketsTab
            tickets={tickets}
            ticketChartData={ticketChartData}
            openTicketsCount={openTicketsCount}
          />
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <DashboardAccountTab
            profile={profile}
            onNavigate={(path) => router.push(path)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
