import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import { createClient } from '@/lib/supabase/server'
import { getSiteById } from './api/queries'
import { SiteDetailCard, EditSiteForm, DeploySiteForm } from './components'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getStatusVariant, formatStatus } from '@/features/shared/utils'

interface SiteDetailPageFeatureProps {
  params: Promise<{ id: string }>
}

export async function SiteDetailPageFeature({ params }: SiteDetailPageFeatureProps) {
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
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">{site.site_name}</h1>
            <Badge variant={getStatusVariant(site.status)}>
              {formatStatus(site.status)}
            </Badge>
          </div>
          <p className="text-muted-foreground">Site details and management controls</p>
        </div>
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/sites" aria-label="Back to sites overview">
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <SiteDetailCard site={site} />

      <Separator />

      <div className="grid gap-6 lg:grid-cols-2">
        <EditSiteForm site={site} siteId={id} />
        <DeploySiteForm siteId={id} siteName={site.site_name} isLive={site.status === 'live'} />
      </div>
    </div>
  )
}
