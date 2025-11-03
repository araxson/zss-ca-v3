import 'server-only'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { createClient } from '@/lib/supabase/server'
import { getClientSiteById } from '@/features/client/sites/api/queries'
import { SiteDetail } from '@/features/client/sites/components/site-detail'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { getSiteAnalytics, getAnalyticsSummary } from '@/features/client/analytics/api/queries'
import { AnalyticsSummaryCards, AnalyticsChart } from '@/features/client/analytics'
import { Item, ItemHeader, ItemTitle, ItemDescription } from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'

interface SiteDetailFeatureProps {
  id: string
}

export async function SiteDetailFeature({ id }: SiteDetailFeatureProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  const site = await getClientSiteById(id)

  if (!site) {
    redirect('/client/sites')
  }

  const days = 30
  const [analytics, summary] = await Promise.all([
    getSiteAnalytics(id, days),
    getAnalyticsSummary(id, days),
  ])

  return (
    <div className="space-y-6">
      <SectionHeader
        title={site.site_name}
        description="Website details and status"
        align="start"
        leading={
          <Button asChild variant="ghost" size="icon" aria-label="Back to sites">
            <Link href={ROUTES.CLIENT_SITES}>
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <SiteDetail site={site} />

      {site.status === 'live' && (
        <>
          <Item variant="outline">
            <ItemHeader>
              <ItemTitle className="text-2xl font-semibold">Analytics</ItemTitle>
              <ItemDescription>Performance metrics for your website</ItemDescription>
            </ItemHeader>
          </Item>

          <AnalyticsSummaryCards summary={summary} days={days} />
          <AnalyticsChart analytics={analytics} />
        </>
      )}
    </div>
  )
}
