import { SectionHeader } from '@/features/shared/components'
import type { Database } from '@/lib/types/database.types'
import { SiteDetailOverview } from './site-detail-overview'
import { SiteDetailInfo } from './site-detail-info'
import { formatStatus } from '@/features/shared/utils'

type ClientSite = Database['public']['Tables']['client_site']['Row']
type Plan = Database['public']['Tables']['plan']['Row']

type SiteWithPlan = ClientSite & {
  plan: Pick<Plan, 'id' | 'name' | 'slug' | 'page_limit' | 'revision_limit'> | null
}

interface SiteDetailProps {
  site: SiteWithPlan
}

export function SiteDetail({ site }: SiteDetailProps) {
  return (
    <div className="space-y-6">
      <SectionHeader
        title={site.site_name}
        description="Your website details and status"
        align="start"
        kicker={formatStatus(site.status)}
        kickerVariant="badge"
      />
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
