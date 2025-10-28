import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import { createClient } from '@/lib/supabase/server'
import { getSiteById, SiteDetailCard, EditSiteForm, DeploySiteForm } from '@/features/admin/sites'
import { SectionHeader } from '@/features/shared/components'
import { Button } from '@/components/ui/button'

interface AdminSiteDetailFeatureProps {
  params: Promise<{ id: string }>
}

export async function AdminSiteDetailFeature({ params }: AdminSiteDetailFeatureProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  const { data: profile } = await supabase.from('profile').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect(ROUTES.CLIENT_DASHBOARD)

  const site = await getSiteById(id)
  if (!site) redirect('/admin/sites')

  return (
    <div className="space-y-6">
      <SectionHeader
        title={site.site_name}
        description="Site details and management"
        align="start"
        leading={
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/sites" aria-label="Back to sites overview">
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <SiteDetailCard site={site} />

      <div className="grid gap-6 lg:grid-cols-2">
        <EditSiteForm site={site} siteId={id} />
        <DeploySiteForm siteId={id} siteName={site.site_name} isLive={site.status === 'live'} />
      </div>
    </div>
  )
}
