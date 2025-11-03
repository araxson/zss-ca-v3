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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
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

export function SiteCard({ site }: SiteCardProps) {
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
        <FieldGroup
          aria-label="Site timeline"
          className="!grid gap-4 sm:grid-cols-2"
        >
          <Field className="rounded-md border border-dashed border-border/60 bg-muted/60 p-4">
            <FieldLabel>Status</FieldLabel>
            <FieldContent>
              <FieldTitle>{formatStatus(site.status)}</FieldTitle>
              <FieldDescription>Current project phase</FieldDescription>
            </FieldContent>
          </Field>
          <Field className="rounded-md border border-dashed border-border/60 bg-muted/60 p-4">
            <FieldLabel>Created</FieldLabel>
            <FieldContent>
              <FieldTitle>{formatDate(site.created_at)}</FieldTitle>
              <FieldDescription>Project kickoff date</FieldDescription>
            </FieldContent>
          </Field>
          {site.deployed_at ? (
            <Field className="rounded-md border border-dashed border-border/60 bg-muted/60 p-4">
              <FieldLabel>Deployed</FieldLabel>
              <FieldContent>
                <FieldTitle>{formatDate(site.deployed_at)}</FieldTitle>
                <FieldDescription>Initial go-live</FieldDescription>
              </FieldContent>
            </Field>
          ) : null}
          {site.last_revision_at ? (
            <Field className="rounded-md border border-dashed border-border/60 bg-muted/60 p-4">
              <FieldLabel>Last Revision</FieldLabel>
              <FieldContent>
                <FieldTitle>{formatDate(site.last_revision_at)}</FieldTitle>
                <FieldDescription>Most recent update</FieldDescription>
              </FieldContent>
            </Field>
          ) : null}
        </FieldGroup>
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
