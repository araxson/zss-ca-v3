import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{site.site_name}</CardTitle>
              <CardDescription>Site information and deployment details</CardDescription>
            </div>
            <Badge variant={getStatusVariant(site.status)}>
              {formatStatus(site.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Client</div>
              <Link
                href={`/admin/clients/${site.profile.id}`}
                className="text-sm text-primary hover:underline"
              >
                {site.profile.company_name || site.profile.contact_name}
              </Link>
              <div className="text-xs text-muted-foreground">{site.profile.contact_email}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground">Plan</div>
              <div className="text-sm">{site.plan?.name || 'No plan assigned'}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground">Created</div>
              <div className="text-sm">{formatDate(site.created_at)}</div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
              <div className="text-sm">{formatDate(site.updated_at)}</div>
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
              <div className="mb-1 text-sm font-medium text-muted-foreground">Deployment URL</div>
              <a
                href={site.deployment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {site.deployment_url}
              </a>
            </div>
          )}

          {site.custom_domain && (
            <div>
              <div className="mb-1 text-sm font-medium text-muted-foreground">Custom Domain</div>
              <div className="text-sm">{site.custom_domain}</div>
            </div>
          )}

          {site.deployment_notes && (
            <div>
              <div className="mb-1 text-sm font-medium text-muted-foreground">Deployment Notes</div>
              <div className="whitespace-pre-wrap text-sm">{site.deployment_notes}</div>
            </div>
          )}

          {site.slug && (
            <div>
              <div className="mb-1 text-sm font-medium text-muted-foreground">Slug</div>
              <div className="text-sm font-mono">{site.slug}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
