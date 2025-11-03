'use client'

import React from 'react'
import { Item, ItemContent } from '@/components/ui/item'
import { Accordion } from '@/components/ui/accordion'
import type { Database } from '@/lib/types/database.types'
import { SiteDetailQuickStats } from './site-detail-quick-stats'
import { SiteDetailClientSection } from './site-detail-client-section'
import { SiteDetailTimelineSection } from './site-detail-timeline-section'
import { SiteDetailDeploymentSection } from './site-detail-deployment-section'
import { getStatusVariant, formatStatus } from '@/features/shared/utils'
import { formatDate as formatDateUtil } from '@/lib/utils'

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

function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A'
  return formatDateUtil(dateString)
}

export function SiteDetailCard({ site }: SiteDetailCardProps) {
  const daysSinceCreated = React.useMemo(() => {
    return Math.floor(
      // eslint-disable-next-line react-hooks/purity
      (Date.now() - new Date(site.created_at).getTime()) / (1000 * 60 * 60 * 24)
    )
  }, [site.created_at])

  const clientName = site.profile.company_name || site.profile.contact_name || ''

  return (
    <div className="space-y-6">
      <SiteDetailQuickStats
        daysSinceCreated={daysSinceCreated}
        clientName={clientName}
        planName={site.plan?.name || null}
        status={site.status}
        getStatusVariant={getStatusVariant}
        formatStatus={formatStatus}
      />

      <Item variant="outline">
        <ItemContent>
          <Accordion type="multiple" defaultValue={['client', 'timeline', 'deployment']} className="w-full">
            <SiteDetailClientSection profile={site.profile} plan={site.plan} />

            <SiteDetailTimelineSection
              createdAt={site.created_at}
              updatedAt={site.updated_at}
              deployedAt={site.deployed_at}
              lastRevisionAt={site.last_revision_at}
              formatDate={formatDate}
            />

            <SiteDetailDeploymentSection
              deploymentUrl={site.deployment_url}
              customDomain={site.custom_domain}
              slug={site.slug}
              deploymentNotes={site.deployment_notes}
              siteName={site.site_name}
            />
          </Accordion>
        </ItemContent>
      </Item>
    </div>
  )
}
