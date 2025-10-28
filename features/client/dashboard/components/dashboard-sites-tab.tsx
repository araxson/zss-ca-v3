'use client'

import { Fragment, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { ItemGroup, ItemSeparator } from '@/components/ui/item'
import { ROUTES } from '@/lib/constants/routes'
import type { Database } from '@/lib/types/database.types'
import { getSiteStatusLabel } from './dashboard-site-helpers'
import { DashboardSiteCard } from './dashboard-site-card'
import { DashboardSitesChart } from './dashboard-sites-chart'
import { DashboardSitesStats } from './dashboard-sites-stats'

type Subscription = Database['public']['Tables']['subscription']['Row'] | null
type ClientSite = Database['public']['Tables']['client_site']['Row']

interface DashboardSitesTabProps {
  sites: ClientSite[]
  subscription: Subscription
  siteStatusChartData: Array<{ name: string; count: number }>
  activeSitesCount: number
  sitesInProgressCount: number
}

export function DashboardSitesTab({
  sites,
  subscription,
  siteStatusChartData,
  activeSitesCount,
  sitesInProgressCount,
}: DashboardSitesTabProps) {
  const [query, setQuery] = useState('')

  const filteredSites = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return sites

    return sites.filter((site) => {
      const values = [
        site.site_name,
        site.custom_domain,
        site.deployment_url,
        getSiteStatusLabel(site.status),
      ]

      return values.some((value) => value?.toLowerCase().includes(term))
    })
  }, [sites, query])

  const inProgressStatuses = useMemo(
    () => new Set(['pending', 'in_production', 'awaiting_client_content', 'ready_for_review']),
    [],
  )

  const filteredActiveSitesCount = useMemo(
    () => filteredSites.filter((site) => site.status === 'live').length,
    [filteredSites],
  )
  const filteredSitesInProgressCount = useMemo(
    () => filteredSites.filter((site) => inProgressStatuses.has(site.status)).length,
    [filteredSites, inProgressStatuses],
  )

  const filteredChartData = useMemo(() => {
    if (!filteredSites.length) return []

    const counts = filteredSites.reduce<Record<string, number>>((acc, site) => {
      const label = getSiteStatusLabel(site.status)
      acc[label] = (acc[label] ?? 0) + 1
      return acc
    }, {})

    return Object.entries(counts).map(([name, count]) => ({ name, count }))
  }, [filteredSites])

  if (sites.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No websites yet</EmptyTitle>
          <EmptyDescription>Subscribe to a plan to get started with your website</EmptyDescription>
        </EmptyHeader>
        {!subscription && (
          <EmptyContent>
            <Button asChild>
              <Link href={ROUTES.PRICING}>View Plans</Link>
            </Button>
          </EmptyContent>
        )}
      </Empty>
    )
  }

  return (
    <>
      <FieldGroup>
        <Field orientation="responsive">
          <FieldLabel htmlFor="client-sites-search">Search websites</FieldLabel>
          <FieldContent>
            <InputGroup>
              <InputGroupInput
                id="client-sites-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, domain, or status"
                aria-label="Search websites"
              />
              <InputGroupAddon align="inline-start" aria-hidden="true">
                <Search className="size-4" />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupText aria-live="polite">
                  {filteredSites.length} results
                </InputGroupText>
                {query ? (
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
            <FieldDescription>Filter your website list. Charts and stats reflect the current results.</FieldDescription>
          </FieldContent>
        </Field>

        <ButtonGroup aria-label="Website actions">
          <Button asChild>
            <Link href={ROUTES.CLIENT_SITES}>Manage Sites</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={ROUTES.CLIENT_SITES_NEW}>Request New Site</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={ROUTES.CLIENT_SUPPORT_NEW}>Create Support Ticket</Link>
          </Button>
        </ButtonGroup>
      </FieldGroup>

      {filteredSites.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <DashboardSitesChart
              chartData={query ? filteredChartData : siteStatusChartData}
            />
            <DashboardSitesStats
              totalSites={query ? filteredSites.length : sites.length}
              activeSitesCount={query ? filteredActiveSitesCount : activeSitesCount}
              sitesInProgressCount={query ? filteredSitesInProgressCount : sitesInProgressCount}
            />
          </div>

          <ScrollArea aria-label="Client sites list">
            <ItemGroup>
              {filteredSites.map((site, index) => (
                <Fragment key={site.id}>
                  <DashboardSiteCard site={site} />
                  {index < filteredSites.length - 1 ? <ItemSeparator /> : null}
                </Fragment>
              ))}
            </ItemGroup>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>No matching websites</EmptyTitle>
            <EmptyDescription>Adjust your search terms or clear the filter to view all sites</EmptyDescription>
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
