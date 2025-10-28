import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { ExternalLink, LifeBuoy } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import type { Database } from '@/lib/types/database.types'

type ClientSite = Database['public']['Tables']['client_site']['Row']
type Plan = Database['public']['Tables']['plan']['Row']

type SiteWithPlan = ClientSite & {
  plan: Pick<Plan, 'id' | 'name' | 'slug' | 'page_limit' | 'revision_limit'> | null
}

interface SiteCardProps {
  site: SiteWithPlan
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'live':
      return 'default'
    case 'in_production':
      return 'secondary'
    case 'ready_for_review':
      return 'outline'
    case 'pending':
      return 'outline'
    case 'awaiting_client_content':
      return 'secondary'
    case 'paused':
      return 'secondary'
    case 'archived':
      return 'outline'
    default:
      return 'outline'
  }
}

function formatStatus(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

function formatDate(dateString: string | null) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function SiteCard({ site }: SiteCardProps) {
  const planSummary = site.plan
    ? `${site.plan.name} • ${site.plan.page_limit ?? 'Unlimited'} pages`
    : 'No plan assigned'
  return (
    <Item variant="outline" className="flex h-full flex-col">
      <ItemContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <ItemTitle>{site.site_name}</ItemTitle>
            <ItemDescription>{planSummary}</ItemDescription>
          </div>
          <Badge variant={getStatusVariant(site.status)}>
            {formatStatus(site.status)}
          </Badge>
        </div>
        <ItemGroup className="grid grid-cols-2 gap-4">
          <Item variant="muted" size="sm" className="flex flex-col">
            <ItemContent className="space-y-0.5">
              <ItemDescription>Status</ItemDescription>
              <ItemTitle>{formatStatus(site.status)}</ItemTitle>
            </ItemContent>
          </Item>

          <Item variant="muted" size="sm" className="flex flex-col">
            <ItemContent className="space-y-0.5">
              <ItemDescription>Created</ItemDescription>
              <ItemTitle>{formatDate(site.created_at)}</ItemTitle>
            </ItemContent>
          </Item>

          {site.deployed_at ? (
            <Item variant="muted" size="sm" className="flex flex-col">
              <ItemContent className="space-y-0.5">
                <ItemDescription>Deployed</ItemDescription>
                <ItemTitle>{formatDate(site.deployed_at)}</ItemTitle>
              </ItemContent>
            </Item>
          ) : null}

          {site.last_revision_at ? (
            <Item variant="muted" size="sm" className="flex flex-col">
              <ItemContent className="space-y-0.5">
                <ItemDescription>Last Revision</ItemDescription>
                <ItemTitle>{formatDate(site.last_revision_at)}</ItemTitle>
              </ItemContent>
            </Item>
          ) : null}
        </ItemGroup>

        {site.deployment_url && (
          <div className="flex gap-2">
            <Button asChild>
              <a
                href={site.deployment_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Live Site
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href={`${ROUTES.CLIENT_SUPPORT}?siteId=${site.id}`}>
                <LifeBuoy className="mr-2 h-4 w-4" />Request update
              </Link>
            </Button>
          </div>
        )}

        {!site.deployment_url && (
          <div className="text-sm text-muted-foreground">
            Your site is not yet deployed. Our team is working on it.
          </div>
        )}

      </ItemContent>
      <ItemActions className="justify-end">
        <Button asChild variant="outline" size="sm">
          <Link href={`/client/sites/${site.id}`}>View Details</Link>
        </Button>
      </ItemActions>
    </Item>
  )
}
