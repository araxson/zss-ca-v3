import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { ExternalLink } from 'lucide-react'
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
  return (
    <Item variant="outline" className="flex h-full flex-col">
      <ItemContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <ItemTitle>{site.site_name}</ItemTitle>
            <ItemDescription>
              {site.plan ? `${site.plan.name} Plan` : 'No plan assigned'}
            </ItemDescription>
          </div>
          <Badge variant={getStatusVariant(site.status)}>
            {formatStatus(site.status)}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">Status</div>
            <div className="text-sm">{formatStatus(site.status)}</div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">Created</div>
            <div className="text-sm">{formatDate(site.created_at)}</div>
          </div>

          {site.deployed_at && (
            <div>
              <div className="text-sm font-medium text-muted-foreground">Deployed</div>
              <div className="text-sm">{formatDate(site.deployed_at)}</div>
            </div>
          )}

          {site.last_revision_at && (
            <div>
              <div className="text-sm font-medium text-muted-foreground">Last Revision</div>
              <div className="text-sm">{formatDate(site.last_revision_at)}</div>
            </div>
          )}
        </div>

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
