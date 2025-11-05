import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { ExternalLink, LifeBuoy } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import type { Database } from '@/lib/types/database.types'
import { getStatusVariant, formatStatus } from '@/features/shared/utils'
import { formatDate } from '@/lib/utils'

type ClientSite = Database['public']['Tables']['client_site']['Row']
type Plan = Database['public']['Tables']['plan']['Row']

type SiteWithPlan = ClientSite & {
  plan: Pick<Plan, 'id' | 'name' | 'slug' | 'page_limit' | 'revision_limit'> | null
}

interface SiteCardProps {
  site: SiteWithPlan
}

export function SiteCard({ site }: SiteCardProps): React.JSX.Element {
  const planSummary = site.plan
    ? `${site.plan.name} • ${site.plan.page_limit ?? 'Unlimited'} pages`
    : 'No plan assigned'
  return (
    <Item variant="outline" className="flex h-full flex-col" role="listitem">
      <ItemHeader>
        <div className="space-y-1">
          <ItemTitle>{site.site_name}</ItemTitle>
          <ItemDescription>{planSummary}</ItemDescription>
        </div>
        <Badge variant={getStatusVariant(site.status)}>
          {formatStatus(site.status)}
        </Badge>
      </ItemHeader>

      <ItemContent>
        <div
          aria-label="Site timeline"
          className="grid gap-4 sm:grid-cols-2"
        >
          <Item variant="muted" size="sm">
            <ItemContent>
              <ItemTitle className="text-sm font-medium">Status</ItemTitle>
              <ItemDescription className="text-base font-semibold">{formatStatus(site.status)}</ItemDescription>
              <ItemDescription className="text-xs text-muted-foreground">Current project phase</ItemDescription>
            </ItemContent>
          </Item>
          <Item variant="muted" size="sm">
            <ItemContent>
              <ItemTitle className="text-sm font-medium">Created</ItemTitle>
              <ItemDescription className="text-base font-semibold">{formatDate(site.created_at)}</ItemDescription>
              <ItemDescription className="text-xs text-muted-foreground">Project kickoff date</ItemDescription>
            </ItemContent>
          </Item>
          {site.deployed_at ? (
            <Item variant="muted" size="sm">
              <ItemContent>
                <ItemTitle className="text-sm font-medium">Deployed</ItemTitle>
                <ItemDescription className="text-base font-semibold">{formatDate(site.deployed_at)}</ItemDescription>
                <ItemDescription className="text-xs text-muted-foreground">Initial go-live</ItemDescription>
              </ItemContent>
            </Item>
          ) : null}
          {site.last_revision_at ? (
            <Item variant="muted" size="sm">
              <ItemContent>
                <ItemTitle className="text-sm font-medium">Last Revision</ItemTitle>
                <ItemDescription className="text-base font-semibold">{formatDate(site.last_revision_at)}</ItemDescription>
                <ItemDescription className="text-xs text-muted-foreground">Most recent update</ItemDescription>
              </ItemContent>
            </Item>
          ) : null}
        </div>
      </ItemContent>

      {site.deployment_url ? (
        <ItemContent>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Site actions">
            <Button asChild>
              <a
                href={site.deployment_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 size-4" aria-hidden="true" />
                Visit site
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href={`${ROUTES.CLIENT_SUPPORT}?siteId=${site.id}`}>
                <LifeBuoy className="mr-2 size-4" aria-hidden="true" />
                Request update
              </Link>
            </Button>
          </div>
        </ItemContent>
      ) : (
        <ItemContent>
          <ItemDescription>
            Your site is not yet deployed. Our team is working on it.
          </ItemDescription>
        </ItemContent>
      )}

      <ItemFooter>
        <ItemActions className="justify-end">
          <Button asChild variant="outline">
            <Link href={`/client/sites/${site.id}`}>View details</Link>
          </Button>
        </ItemActions>
      </ItemFooter>
    </Item>
  )
}
