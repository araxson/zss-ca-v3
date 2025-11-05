import 'server-only'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import { createClient } from '@/lib/supabase/server'
import { getSiteById } from './api/queries'
import { SiteDetailCard } from './components'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getStatusVariant, formatStatus } from '@/features/shared/utils'

interface SiteDetailPageFeatureProps {
  siteId: string
}

export async function SiteDetailPageFeature({ siteId }: SiteDetailPageFeatureProps) {
  const id = siteId
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  // ✅ Parallel data fetching to avoid waterfall
  const [profileResult, site] = await Promise.all([
    supabase.from('profile').select('role').eq('id', user.id).single(),
    getSiteById(id),
  ])

  const { data: profile } = profileResult
  if (!profile || profile.role !== 'admin') redirect(ROUTES.CLIENT_DASHBOARD)

  if (!site) redirect(ROUTES.ADMIN_SITES)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">{site.site_name}</h2>
          <Badge variant={getStatusVariant(site.status)}>
            {formatStatus(site.status)}
          </Badge>
        </div>
        <Button asChild variant="ghost" size="icon">
          <Link href={ROUTES.ADMIN_SITES} aria-label="Back to sites overview">
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <SiteDetailCard site={site} />
    </div>
  )
}
