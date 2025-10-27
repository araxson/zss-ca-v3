import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Plan</div>
              <div className="text-sm">{site.plan?.name || 'No plan assigned'}</div>
            </div>

            {site.plan?.page_limit && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Page Limit</div>
                <div className="text-sm">{site.plan.page_limit} pages</div>
              </div>
            )}

            {site.plan?.revision_limit && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">Monthly Revisions</div>
                <div className="text-sm">{site.plan.revision_limit} revisions</div>
              </div>
            )}

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
            <div>
              <div className="mb-2 text-sm font-medium text-muted-foreground">Website URL</div>
              <div className="flex gap-2">
                <Button asChild>
                  <a
                    href={site.deployment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {site.deployment_url}
                  </a>
                </Button>
              </div>
            </div>
          )}

          {site.custom_domain && (
            <div>
              <div className="mb-1 text-sm font-medium text-muted-foreground">Custom Domain</div>
              <div className="text-sm">{site.custom_domain}</div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="h-full">
        <CardHeader>
          <CardTitle>Status Information</CardTitle>
          <CardDescription>Current state of your website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
