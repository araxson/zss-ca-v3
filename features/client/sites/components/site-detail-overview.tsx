import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { ExternalLink } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type Plan = Database['public']['Tables']['plan']['Row']

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

interface SiteDetailOverviewProps {
  status: string
  plan: Pick<Plan, 'id' | 'name' | 'slug' | 'page_limit' | 'revision_limit'> | null
  createdAt: string
  deployedAt: string | null
  lastRevisionAt: string | null
  deploymentUrl: string | null
  customDomain: string | null
}

export function SiteDetailOverview({
  status,
  plan,
  createdAt,
  deployedAt,
  lastRevisionAt,
  deploymentUrl,
  customDomain,
}: SiteDetailOverviewProps) {
  return (
    <Item variant="outline" className="flex flex-col">
      <ItemContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <ItemTitle>Plan Overview</ItemTitle>
            <ItemDescription>Limits and timelines for this site</ItemDescription>
          </div>
          <Badge variant={getStatusVariant(status)}>
            {formatStatus(status)}
          </Badge>
        </div>
        <FieldSet className="space-y-4">
          <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Plan</FieldLabel>
              <FieldDescription>
                {plan?.name || 'No plan assigned'}
              </FieldDescription>
            </Field>
            {plan?.page_limit && (
              <Field>
                <FieldLabel>Page Limit</FieldLabel>
                <p className="text-sm font-medium">{plan.page_limit} pages</p>
              </Field>
            )}
            {plan?.revision_limit && (
              <Field>
                <FieldLabel>Monthly Revisions</FieldLabel>
                <p className="text-sm font-medium">
                  {plan.revision_limit} revisions
                </p>
              </Field>
            )}
            <Field>
              <FieldLabel>Created</FieldLabel>
              <FieldDescription>{formatDate(createdAt)}</FieldDescription>
            </Field>
            {deployedAt && (
              <Field>
                <FieldLabel>Deployed</FieldLabel>
                <FieldDescription>{formatDate(deployedAt)}</FieldDescription>
              </Field>
            )}
            {lastRevisionAt && (
              <Field>
                <FieldLabel>Last Revision</FieldLabel>
                <FieldDescription>{formatDate(lastRevisionAt)}</FieldDescription>
              </Field>
            )}
          </FieldGroup>
        </FieldSet>

        <FieldGroup className="space-y-4">
          {deploymentUrl && (
            <Field>
              <FieldLabel>Website URL</FieldLabel>
              <ButtonGroup className="flex gap-2">
                <Button asChild>
                  <a
                    href={deploymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {deploymentUrl}
                  </a>
                </Button>
              </ButtonGroup>
            </Field>
          )}

          {customDomain && (
            <Field>
              <FieldLabel>Custom Domain</FieldLabel>
              <FieldDescription>{customDomain}</FieldDescription>
            </Field>
          )}
        </FieldGroup>
      </ItemContent>
    </Item>
  )
}
