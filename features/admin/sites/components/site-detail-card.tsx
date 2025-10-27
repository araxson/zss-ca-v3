import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import type { Database } from '@/lib/types/database.types'

type ClientSite = Database['public']['Tables']['client_site']['Row']
type Profile = Database['public']['Tables']['profile']['Row']
type Plan = Database['public']['Tables']['plan']['Row']
type Subscription = Database['public']['Tables']['subscription']['Row']

type SiteWithRelations = ClientSite & {
  profile: Pick<Profile, 'id' | 'contact_name' | 'contact_email' | 'company_name'>
  plan: Pick<Plan, 'id' | 'name' | 'slug'> | null
  subscription: Pick<Subscription, 'id' | 'status'> | null
}

interface SiteDetailCardProps {
  site: SiteWithRelations
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

export function SiteDetailCard({ site }: SiteDetailCardProps) {
  return (
    <div className="space-y-6">
      <FieldSet className="h-full space-y-6 rounded-lg border p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <FieldLegend className="text-lg font-semibold text-foreground">
              {site.site_name}
            </FieldLegend>
            <FieldDescription>Site information and deployment details</FieldDescription>
          </div>
          <Badge variant={getStatusVariant(site.status)}>
            {formatStatus(site.status)}
          </Badge>
        </div>
        <FieldGroup className="space-y-4">
          <Field>
            <FieldLabel>Client</FieldLabel>
            <Item variant="outline" size="sm">
              <ItemContent>
                <ItemTitle>{site.profile.company_name || site.profile.contact_name}</ItemTitle>
                <ItemDescription>{site.profile.contact_email}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button asChild variant="link" size="sm">
                  <Link href={`/admin/clients/${site.profile.id}`}>Open client</Link>
                </Button>
              </ItemActions>
            </Item>
          </Field>
          <Field>
            <FieldLabel>Plan</FieldLabel>
            <p className="text-sm font-medium">
              {site.plan?.name || 'No plan assigned'}
            </p>
          </Field>
        </FieldGroup>

        <FieldGroup className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Created</FieldLabel>
            <FieldDescription>{formatDate(site.created_at)}</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Last Updated</FieldLabel>
            <FieldDescription>{formatDate(site.updated_at)}</FieldDescription>
          </Field>
          {site.deployed_at && (
            <Field>
              <FieldLabel>Deployed</FieldLabel>
              <FieldDescription>{formatDate(site.deployed_at)}</FieldDescription>
            </Field>
          )}
          {site.last_revision_at && (
            <Field>
              <FieldLabel>Last Revision</FieldLabel>
              <FieldDescription>{formatDate(site.last_revision_at)}</FieldDescription>
            </Field>
          )}
        </FieldGroup>

        <FieldGroup className="space-y-4">
          {site.deployment_url && (
            <Field>
              <FieldLabel>Deployment URL</FieldLabel>
              <FieldDescription>
                <a
                  href={site.deployment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {site.deployment_url}
                </a>
              </FieldDescription>
            </Field>
          )}
          {site.custom_domain && (
            <Field>
              <FieldLabel>Custom Domain</FieldLabel>
              <p className="text-sm font-medium">{site.custom_domain}</p>
            </Field>
          )}
          {site.deployment_notes && (
            <Field>
              <FieldLabel>Deployment Notes</FieldLabel>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {site.deployment_notes}
              </p>
            </Field>
          )}
          {site.slug && (
            <Field>
              <FieldLabel>Slug</FieldLabel>
              <p className="font-mono text-xs">{site.slug}</p>
            </Field>
          )}
        </FieldGroup>
      </FieldSet>
    </div>
  )
}
