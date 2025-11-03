import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field'
import { ExternalLink } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'
import { getStatusVariant, formatStatus } from '@/features/shared/utils'
import { formatDate } from '@/lib/utils'

type Plan = Database['public']['Tables']['plan']['Row']

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
              <FieldContent>
                <FieldTitle>{plan?.name || 'No plan assigned'}</FieldTitle>
              </FieldContent>
            </Field>
            {plan?.page_limit ? (
              <Field>
                <FieldLabel>Page Limit</FieldLabel>
                <FieldContent>
                  <FieldTitle>{plan.page_limit} pages</FieldTitle>
                </FieldContent>
              </Field>
            ) : null}
            {plan?.revision_limit ? (
              <Field>
                <FieldLabel>Monthly Revisions</FieldLabel>
                <FieldContent>
                  <FieldTitle>{plan.revision_limit} revisions</FieldTitle>
                </FieldContent>
              </Field>
            ) : null}
            <Field>
              <FieldLabel>Created</FieldLabel>
              <FieldContent>
                <FieldDescription>{formatDate(createdAt)}</FieldDescription>
              </FieldContent>
            </Field>
            {deployedAt ? (
              <Field>
                <FieldLabel>Deployed</FieldLabel>
                <FieldContent>
                  <FieldDescription>{formatDate(deployedAt)}</FieldDescription>
                </FieldContent>
              </Field>
            ) : null}
            {lastRevisionAt ? (
              <Field>
                <FieldLabel>Last Revision</FieldLabel>
                <FieldContent>
                  <FieldDescription>{formatDate(lastRevisionAt)}</FieldDescription>
                </FieldContent>
              </Field>
            ) : null}
          </FieldGroup>
        </FieldSet>

        <FieldGroup className="space-y-4">
          {deploymentUrl && (
            <Field>
              <FieldLabel>Website URL</FieldLabel>
              <FieldContent>
                <FieldTitle className="truncate">{deploymentUrl}</FieldTitle>
                <div className="flex" role="group" aria-label="Website actions">
                  <Button asChild>
                    <a
                      href={deploymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 size-4" aria-hidden="true" />
                      Visit site
                    </a>
                  </Button>
                </div>
              </FieldContent>
            </Field>
          )}

          {customDomain && (
            <Field>
              <FieldLabel>Custom Domain</FieldLabel>
              <FieldContent>
                <FieldDescription>{customDomain}</FieldDescription>
              </FieldContent>
            </Field>
          )}
        </FieldGroup>
      </ItemContent>
    </Item>
  )
}
