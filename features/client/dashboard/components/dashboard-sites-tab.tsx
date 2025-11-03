'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { ItemGroup } from '@/components/ui/item'
import { ROUTES } from '@/lib/constants/routes'
import type { Database } from '@/lib/types/database.types'
import { getSiteStatusLabel } from '@/features/shared/utils'
import { DashboardSitesChart } from './dashboard-sites-chart'
import { DashboardSitesStats } from './dashboard-sites-stats'
import { SitesSearchField } from './sites-search-field'
import { SitesList } from './sites-list'

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
      <SitesSearchField
        query={query}
        onQueryChange={setQuery}
        resultsCount={filteredSites.length}
      />

      {filteredSites.length > 0 ? (
        <>
          <ItemGroup className="!grid gap-4 md:grid-cols-2" aria-label="Website insights">
            <DashboardSitesChart
              chartData={query ? filteredChartData : siteStatusChartData}
            />
            <DashboardSitesStats
              totalSites={query ? filteredSites.length : sites.length}
              activeSitesCount={query ? filteredActiveSitesCount : activeSitesCount}
              sitesInProgressCount={query ? filteredSitesInProgressCount : sitesInProgressCount}
            />
          </ItemGroup>

          <SitesList sites={filteredSites} />
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
