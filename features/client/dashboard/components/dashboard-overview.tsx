'use client'

import Link from 'next/link'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ROUTES } from '@/lib/constants/routes'
import type { Database } from '@/lib/types/database.types'
import { DashboardSummaryCards } from './dashboard-summary-cards'
import { DashboardSitesChart } from './dashboard-sites-chart'
import { DashboardSitesStats } from './dashboard-sites-stats'
import { DashboardTicketsStats } from './dashboard-tickets-stats'
import { DashboardTicketsTable } from './dashboard-tickets-table'
import { SitesList } from './sites-list'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import { getSiteStatusLabel } from '@/features/shared/utils'
import { AlertCircle, ArrowRight } from 'lucide-react'

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

  return (
    <div className="space-y-6">
      {!subscription && (
        <div className="space-y-3">
          <Alert>
            <AlertCircle className="size-4" aria-hidden="true" />
            <AlertTitle>No active subscription</AlertTitle>
            <AlertDescription>
              Subscribe to a plan to get started with your website.
            </AlertDescription>
          </Alert>
          <div className="flex justify-start sm:justify-end">
            <Button asChild>
              <Link href={ROUTES.PRICING}>View Plans</Link>
            </Button>
          </div>
        </div>
      )}

      <DashboardSummaryCards
        subscription={subscription}
        sitesCount={sites.length}
        activeSitesCount={activeSites.length}
        sitesInProgressCount={sitesInProgress.length}
        openTicketsCount={openTicketsCount}
      />

      <Separator aria-hidden="true" />

      <div className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <DashboardSitesChart chartData={siteStatusChartData} />
          <DashboardSitesStats
            totalSites={sites.length}
            activeSitesCount={activeSites.length}
            sitesInProgressCount={sitesInProgress.length}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <DashboardTicketsStats
            totalTickets={tickets.length}
            openTicketsCount={openTicketsCount}
          />

          <Item variant="outline">
            <ItemHeader>
              <ItemTitle>Support Performance</ItemTitle>
              <ItemDescription>Latest ticket activity and quick actions</ItemDescription>
            </ItemHeader>
            <ItemContent>
              {tickets.length > 0 ? (
                <DashboardTicketsTable tickets={tickets.slice(0, 5)} />
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>No tickets yet</EmptyTitle>
                    <EmptyDescription>Create a support ticket to get started.</EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button asChild>
                      <Link href={ROUTES.CLIENT_SUPPORT_NEW}>Create Ticket</Link>
                    </Button>
                  </EmptyContent>
                </Empty>
              )}
            </ItemContent>
            {tickets.length > 5 ? (
              <ItemFooter className="justify-end">
                <Button asChild variant="link">
                  <Link href={ROUTES.CLIENT_SUPPORT}>
                    View all tickets
                    <ArrowRight className="ml-1 size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </ItemFooter>
            ) : null}
          </Item>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Item variant="outline">
            <ItemHeader>
              <ItemTitle>Recent Websites</ItemTitle>
              <ItemDescription>Latest updates across your site portfolio</ItemDescription>
            </ItemHeader>
            <ItemContent>
              {sites.length > 0 ? (
                <SitesList sites={sites.slice(0, 5)} />
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle>No websites yet</EmptyTitle>
                    <EmptyDescription>Subscribe to a plan to start building your website.</EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button asChild>
                      <Link href={ROUTES.PRICING}>View Plans</Link>
                    </Button>
                  </EmptyContent>
                </Empty>
              )}
            </ItemContent>
            {sites.length > 5 ? (
              <ItemFooter className="justify-end">
                <Button asChild variant="link">
                  <Link href={ROUTES.CLIENT_SITES}>
                    View all sites
                    <ArrowRight className="ml-1 size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </ItemFooter>
            ) : null}
          </Item>

          <Item variant="outline">
            <ItemHeader>
              <ItemTitle>Account Snapshot</ItemTitle>
              <ItemDescription>Ensure your profile details are up to date</ItemDescription>
            </ItemHeader>
            <ItemContent>
              <FieldGroup>
                <Field orientation="responsive">
                  <FieldLabel>Name</FieldLabel>
                  <FieldContent>
                    <FieldTitle>{profile?.contact_name ?? '—'}</FieldTitle>
                    {!profile?.contact_name ? (
                      <FieldDescription>Add your name so our team knows who to contact.</FieldDescription>
                    ) : null}
                  </FieldContent>
                </Field>
                <Field orientation="responsive">
                  <FieldLabel>Email</FieldLabel>
                  <FieldContent>
                    <FieldTitle>{profile?.contact_email ?? '—'}</FieldTitle>
                    {!profile?.contact_email ? (
                      <FieldDescription>Keep your email up to date for important notifications.</FieldDescription>
                    ) : null}
                  </FieldContent>
                </Field>
                <Field orientation="responsive">
                  <FieldLabel>Company</FieldLabel>
                  <FieldContent>
                    <FieldTitle>{profile?.company_name ?? '—'}</FieldTitle>
                  </FieldContent>
                </Field>
                <Field orientation="responsive">
                  <FieldLabel>Phone</FieldLabel>
                  <FieldContent>
                    <FieldTitle>{profile?.contact_phone ?? '—'}</FieldTitle>
                    {!profile?.contact_phone ? (
                      <FieldDescription>Adding a phone number helps with urgent updates.</FieldDescription>
                    ) : null}
                  </FieldContent>
                </Field>
              </FieldGroup>
            </ItemContent>
            <ItemFooter className="justify-end">
              <Button asChild variant="outline">
                <Link href={ROUTES.CLIENT_PROFILE}>Edit Profile</Link>
              </Button>
            </ItemFooter>
          </Item>
        </div>
      </div>
    </div>
  )
}
