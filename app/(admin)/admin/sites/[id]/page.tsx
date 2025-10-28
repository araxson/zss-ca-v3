import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { createClient } from '@/lib/supabase/server'
import { getSiteById, SiteDetailCard, EditSiteForm, DeploySiteForm } from '@/features/admin/sites'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { SectionHeader } from '@/features/shared/components'

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
      <SectionHeader
        title={site.site_name}
        description="Site details and management"
        align="start"
        leading={
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/sites">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        }
      />

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
