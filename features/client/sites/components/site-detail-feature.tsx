import 'server-only'

import { redirect } from 'next/navigation'
import { ROUTES } from '@/lib/constants/routes'
import { createClient } from '@/lib/supabase/server'
import { getClientSiteById } from '@/features/client/sites/api/queries'
import { SiteDetail } from '@/features/client/sites/components/site-detail'
import { getSiteAnalytics, getAnalyticsSummary } from '@/features/client/analytics/api/queries'
import { AnalyticsSummaryCards, AnalyticsChart } from '@/features/client/analytics'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface SiteDetailFeatureProps {
  id: string
}

export async function SiteDetailFeature({ id }: SiteDetailFeatureProps): Promise<React.JSX.Element> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  const site = await getClientSiteById(id)

  if (!site) {
    redirect(ROUTES.CLIENT_SITES)
  }

  const days = 30
  const [analytics, summary] = await Promise.all([
    getSiteAnalytics(id, days),
    getAnalyticsSummary(id, days),
  ])

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={ROUTES.CLIENT_DASHBOARD}>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={ROUTES.CLIENT_SITES}>Sites</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{site.site_name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col items-start gap-3">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {site.site_name}
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl">
          Website details and status
        </p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Site ID:</span>
          <span className="font-mono text-xs">{site.id}</span>
        </div>
      </div>

      <SiteDetail site={site} />

      {site.status === 'live' && (
        <>
          <div className="space-y-2">
            <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Analytics</h2>
            <p className="text-muted-foreground">Performance metrics for your website</p>
          </div>

          <AnalyticsSummaryCards summary={summary} days={days} />
          <AnalyticsChart analytics={analytics} />
        </>
      )}
    </div>
  )
}
