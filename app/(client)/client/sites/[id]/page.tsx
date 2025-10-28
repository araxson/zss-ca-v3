import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { createClient } from '@/lib/supabase/server'
import { getClientSiteById } from '@/features/client/sites/api/queries'
import { SiteDetail } from '@/features/client/sites/components/site-detail'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { getSiteAnalytics, getAnalyticsSummary, AnalyticsSummaryCards, AnalyticsChart } from '@/features/admin/analytics'
import { SectionHeader } from '@/features/shared/components'

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
      <SectionHeader
        title={site.site_name}
        description="Website details and status"
        align="start"
        leading={
          <Button asChild variant="ghost" size="icon">
            <Link href="/client/sites">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <SiteDetail site={site} />

      {site.status === 'live' && (
        <>
          <SectionHeader
            title="Analytics"
            description="Performance metrics for your website"
            align="start"
          />

          <AnalyticsSummaryCards summary={summary} days={days} />
          <AnalyticsChart analytics={analytics} />
        </>
      )}
    </div>
  )
}
