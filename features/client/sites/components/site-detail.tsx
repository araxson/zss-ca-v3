import type { Database } from '@/lib/types/database.types'
import { Badge } from '@/components/ui/badge'
import { SiteDetailOverview } from './site-detail-overview'
import { SiteDetailInfo } from './site-detail-info'
import { formatStatus, getStatusVariant } from '@/features/shared/utils'

type ClientSite = Database['public']['Tables']['client_site']['Row']
type Plan = Database['public']['Tables']['plan']['Row']

type SiteWithPlan = ClientSite & {
  plan: Pick<Plan, 'id' | 'name' | 'slug' | 'page_limit' | 'revision_limit'> | null
}

interface SiteDetailProps {
  site: SiteWithPlan
}

export function SiteDetail({ site }: SiteDetailProps): React.JSX.Element {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start text-left gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-start gap-3">
          <Badge variant={getStatusVariant(site.status)} className="uppercase tracking-wide">
            {formatStatus(site.status)}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {site.site_name}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">
            Your website details and status
          </p>
        </div>
      </div>
      <SiteDetailOverview
        status={site.status}
        plan={site.plan}
        createdAt={site.created_at}
        deployedAt={site.deployed_at}
        lastRevisionAt={site.last_revision_at}
        deploymentUrl={site.deployment_url}
        customDomain={site.custom_domain}
      />
      <SiteDetailInfo
        status={site.status}
        plan={site.plan}
      />
    </div>
  )
}
