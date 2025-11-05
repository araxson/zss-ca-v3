'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FieldGroup } from '@/components/ui/field'
import { DashboardSearchField } from './dashboard-search-field'
import { ROUTES } from '@/lib/constants/routes'
import { getStatusVariant, formatStatus } from '@/features/shared/utils'

interface SitesSearchFieldProps {
  query: string
  onQueryChange: (query: string) => void
  resultsCount: number
  sites: Array<{
    id: string
    site_name: string | null
    custom_domain: string | null
    deployment_url: string | null
    status: string
  }>
}

export function SitesSearchField({
  query,
  onQueryChange,
  resultsCount,
  sites,
}: SitesSearchFieldProps): React.JSX.Element {
  const suggestions = sites.slice(0, 6).map((site) => ({
    value: site.site_name || site.custom_domain || site.id,
    label: site.site_name || 'Untitled site',
    href: `${ROUTES.CLIENT_SITES}/${site.id}`,
    description: site.custom_domain || site.deployment_url || 'No domain yet',
    badge: formatStatus(site.status),
    badgeVariant: getStatusVariant(site.status),
  }))

  return (
    <FieldGroup>
      <DashboardSearchField
        label="Search websites"
        placeholder="Search by name, domain, or status"
        value={query}
        onChange={onQueryChange}
        resultsCount={resultsCount}
        suggestions={suggestions}
        description="Filter your website list. Charts and stats reflect the current results."
        ariaLabel="Search websites"
      />

      <div className="flex flex-wrap gap-2" role="group" aria-label="Website actions">
        <Button asChild>
          <Link href={ROUTES.CLIENT_SITES}>Manage Sites</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={ROUTES.CLIENT_SUPPORT_NEW}>Request New Site</Link>
        </Button>
      </div>
    </FieldGroup>
  )
}
