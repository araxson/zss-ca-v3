'use client'

import { Fragment } from 'react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { ItemGroup, ItemSeparator } from '@/components/ui/item'
import type { Database } from '@/lib/types/database.types'
import { DashboardSiteCard } from './dashboard-site-card'

type ClientSite = Database['public']['Tables']['client_site']['Row']

interface SitesListProps {
  sites: ClientSite[]
}

export function SitesList({ sites }: SitesListProps) {
  return (
    <ScrollArea aria-label="Client sites list">
      <ItemGroup>
        {sites.map((site, index) => (
          <Fragment key={site.id}>
            <DashboardSiteCard site={site} />
            {index < sites.length - 1 ? <ItemSeparator /> : null}
          </Fragment>
        ))}
      </ItemGroup>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  )
}
