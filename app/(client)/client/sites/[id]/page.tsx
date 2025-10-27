import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { createClient } from '@/lib/supabase/server'
import { getClientSiteById } from '@/features/client/sites/api/queries'
import { SiteDetail } from '@/features/client/sites/components/site-detail'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getSiteAnalytics, getAnalyticsSummary } from '@/features/admin/analytics/api/queries'
import { AnalyticsSummaryCards } from '@/features/admin/analytics/components/analytics-summary-cards'
import { AnalyticsChart } from '@/features/admin/analytics/components/analytics-chart'

interface ClientSiteDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ClientSiteDetailPage({ params }: ClientSiteDetailPageProps) {
  const resolvedParams = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  const site = await getClientSiteById(resolvedParams.id)

  if (!site) {
    redirect('/client/sites')
  }

  const days = 30
  const [analytics, summary] = await Promise.all([
    getSiteAnalytics(resolvedParams.id, days),
    getAnalyticsSummary(resolvedParams.id, days),
  ])

  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon">
              <Link href="/client/sites">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="space-y-1">
              <CardTitle>{site.site_name}</CardTitle>
              <CardDescription>Website details and status</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <SiteDetail site={site} />

      {site.status === 'live' && (
        <>
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Performance metrics for your website
              </CardDescription>
            </CardHeader>
          </Card>

          <AnalyticsSummaryCards summary={summary} days={days} />
          <AnalyticsChart analytics={analytics} />
        </>
      )}
    </div>
  )
}
