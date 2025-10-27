import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { ExternalLink } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type ClientSite = Database['public']['Tables']['client_site']['Row']
type Plan = Database['public']['Tables']['plan']['Row']

type SiteWithPlan = ClientSite & {
  plan: Pick<Plan, 'id' | 'name' | 'slug' | 'page_limit' | 'revision_limit'> | null
}

interface SiteDetailProps {
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

export function SiteDetail({ site }: SiteDetailProps) {
  return (
    <div className="space-y-6">
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{site.site_name}</CardTitle>
              <CardDescription>Your website details and status</CardDescription>
            </div>
            <Badge variant={getStatusVariant(site.status)}>
              {formatStatus(site.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <FieldSet className="space-y-4">
            <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>Plan</FieldLabel>
                <FieldDescription>
                  {site.plan?.name || 'No plan assigned'}
                </FieldDescription>
              </Field>
              {site.plan?.page_limit && (
                <Field>
                  <FieldLabel>Page Limit</FieldLabel>
                  <p className="text-sm font-medium">{site.plan.page_limit} pages</p>
                </Field>
              )}
              {site.plan?.revision_limit && (
                <Field>
                  <FieldLabel>Monthly Revisions</FieldLabel>
                  <p className="text-sm font-medium">
                    {site.plan.revision_limit} revisions
                  </p>
                </Field>
              )}
              <Field>
                <FieldLabel>Created</FieldLabel>
                <FieldDescription>{formatDate(site.created_at)}</FieldDescription>
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
          </FieldSet>

          <FieldGroup className="space-y-4">
            {site.deployment_url && (
              <Field>
                <FieldLabel>Website URL</FieldLabel>
                <div className="flex gap-2">
                  <Button asChild>
                    <a
                      href={site.deployment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {site.deployment_url}
                    </a>
                  </Button>
                </div>
              </Field>
            )}

            {site.custom_domain && (
              <Field>
                <FieldLabel>Custom Domain</FieldLabel>
                <FieldDescription>{site.custom_domain}</FieldDescription>
              </Field>
            )}
          </FieldGroup>
        </CardContent>
      </Card>

      <Card className="h-full">
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>More details about your website</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="status">
            <AccordionItem value="status">
              <AccordionTrigger>Status Information</AccordionTrigger>
              <AccordionContent className="space-y-4">
                {site.status === 'pending' && (
                  <div className="text-sm">
                    Your website project has been created and is in the queue. Our team will begin
                    working on it shortly.
                  </div>
                )}

                {site.status === 'in_production' && (
                  <div className="text-sm">
                    Our team is actively working on your website. We will notify you when it is
                    ready for review.
                  </div>
                )}

                {site.status === 'awaiting_client_content' && (
                  <div className="text-sm">
                    We are waiting for content or feedback from you. Please check your email for
                    our request or contact support if you need assistance.
                  </div>
                )}

                {site.status === 'ready_for_review' && (
                  <div className="text-sm">
                    Your website is ready for review! Please check the preview and let us know if
                    any changes are needed.
                  </div>
                )}

                {site.status === 'live' && (
                  <div className="text-sm">
                    Your website is live and accessible to the public. Thank you for choosing our
                    service!
                  </div>
                )}

                {site.status === 'paused' && (
                  <div className="text-sm">
                    Your website project has been paused. Please contact support if you would like
                    to resume development.
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {site.plan && (
              <AccordionItem value="plan">
                <AccordionTrigger>Plan Details</AccordionTrigger>
                <AccordionContent>
                  <FieldGroup className="space-y-3">
                    <Field>
                      <FieldLabel>Plan Name</FieldLabel>
                      <FieldDescription>{site.plan.name}</FieldDescription>
                    </Field>
                    {site.plan.page_limit && (
                      <Field>
                        <FieldLabel>Page Limit</FieldLabel>
                        <FieldDescription>{site.plan.page_limit} pages</FieldDescription>
                      </Field>
                    )}
                    {site.plan.revision_limit && (
                      <Field>
                        <FieldLabel>Monthly Revisions</FieldLabel>
                        <FieldDescription>
                          {site.plan.revision_limit} revisions
                        </FieldDescription>
                      </Field>
                    )}
                  </FieldGroup>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
