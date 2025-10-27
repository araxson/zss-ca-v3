import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { createClient } from '@/lib/supabase/server'
import { getSiteById } from '@/features/admin/sites/api/queries'
import { SiteDetailCard } from '@/features/admin/sites/components/site-detail-card'
import { EditSiteForm } from '@/features/admin/sites/components/edit-site-form'
import { DeploySiteForm } from '@/features/admin/sites/components/deploy-site-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface AdminSiteDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminSiteDetailPage({ params }: AdminSiteDetailPageProps) {
  const resolvedParams = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profile')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect(ROUTES.CLIENT_DASHBOARD)
  }

  const site = await getSiteById(resolvedParams.id)

  if (!site) {
    redirect('/admin/sites')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon">
              <Link href="/admin/sites">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="space-y-1">
              <CardTitle>{site.site_name}</CardTitle>
              <CardDescription>Site details and management</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <SiteDetailCard site={site} />

      <div className="grid gap-6 lg:grid-cols-2">
        <EditSiteForm site={site} siteId={resolvedParams.id} />
        <DeploySiteForm
          siteId={resolvedParams.id}
          siteName={site.site_name}
          isLive={site.status === 'live'}
        />
      </div>
    </div>
  )
}
