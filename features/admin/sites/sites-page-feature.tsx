import 'server-only'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, Globe, Rocket, Clock, Pause } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import { createClient } from '@/lib/supabase/server'
import { listSites } from './api/queries'
import { SitesCommandMenu, SitesTable } from './components'
import { Button } from '@/components/ui/button'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item'
import { Separator } from '@/components/ui/separator'

export async function SitesPageFeature() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  // ✅ Parallel data fetching to avoid waterfall
  const [profileResult, sites] = await Promise.all([
    supabase.from('profile').select('role').eq('id', user.id).single(),
    listSites(),
  ])

  const { data: profile } = profileResult
  if (!profile || profile.role !== 'admin') redirect(ROUTES.CLIENT_DASHBOARD)

  // Calculate statistics
  const stats = {
    total: sites.length,
    live: sites.filter(s => s.status === 'live').length,
    inProduction: sites.filter(s => s.status === 'in_production').length,
    pending: sites.filter(s => s.status === 'pending' || s.status === 'awaiting_client_content').length,
    paused: sites.filter(s => s.status === 'paused' || s.status === 'archived').length,
  }

  const livePercentage = stats.total > 0 ? Math.round((stats.live / stats.total) * 100) : 0
  const siteSummaries = sites.map((site) => ({
    id: site.id,
    name: site.site_name,
    status: site.status,
    clientName: site.profile.company_name
      || site.profile.contact_name
      || site.profile.contact_email
      || '',
  }))

  return (
    <div className="space-y-6">
      <SitesCommandMenu sites={siteSummaries} />
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Overview</h2>
        <Button asChild>
          <Link href={ROUTES.ADMIN_SITES_NEW} aria-label="Create a new site">
            <Plus className="mr-2 size-4" aria-hidden="true" />
            Create Site
          </Link>
        </Button>
      </div>

      {/* Statistics Overview */}
      <ItemGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Item variant="outline">
          <ItemMedia>
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <Globe className="size-5 text-primary" aria-hidden="true" />
            </div>
          </ItemMedia>
          <ItemContent>
            <ItemDescription>Total Sites</ItemDescription>
            <div className="text-2xl font-semibold">{stats.total}</div>
          </ItemContent>
        </Item>

        <Item variant="outline">
          <ItemMedia>
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10 dark:bg-green-500/20">
              <Rocket className="size-5 text-green-600 dark:text-green-400" aria-hidden="true" />
            </div>
          </ItemMedia>
          <ItemContent>
            <ItemDescription>Live Sites</ItemDescription>
            <div className="text-2xl font-semibold">{stats.live}</div>
          </ItemContent>
        </Item>

        <Item variant="outline">
          <ItemMedia>
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
              <Clock className="size-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            </div>
          </ItemMedia>
          <ItemContent>
            <ItemDescription>In Production</ItemDescription>
            <div className="text-2xl font-semibold">{stats.inProduction}</div>
          </ItemContent>
        </Item>

        <Item variant="outline">
          <ItemMedia>
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10 dark:bg-amber-500/20">
              <Pause className="size-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            </div>
          </ItemMedia>
          <ItemContent>
            <ItemDescription>Pending/Paused</ItemDescription>
            <div className="text-2xl font-semibold">{stats.pending + stats.paused}</div>
          </ItemContent>
        </Item>
      </ItemGroup>

      {/* Deployment Progress */}
      <Item variant="outline">
        <ItemContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <ItemTitle>Deployment Progress</ItemTitle>
              <ItemDescription>{livePercentage}% Live</ItemDescription>
            </div>
            <div className="space-y-2">
              <div
                className="flex h-2 w-full overflow-hidden rounded-full bg-muted"
                role="img"
                aria-label="Deployment progress by status"
              >
                {[
                  { key: 'live', count: stats.live, color: 'bg-emerald-500 dark:bg-emerald-600', label: 'Live' },
                  { key: 'in_production', count: stats.inProduction, color: 'bg-blue-500 dark:bg-blue-600', label: 'In production' },
                  { key: 'pending', count: stats.pending, color: 'bg-amber-500 dark:bg-amber-600', label: 'Pending' },
                  { key: 'paused', count: stats.paused, color: 'bg-muted-foreground/50', label: 'Paused' },
                ].map(({ key, count, color }) => {
                  const width = stats.total > 0 ? (count / stats.total) * 100 : 0
                  return (
                    <span
                      key={key}
                      aria-hidden="true"
                      className={`h-full ${color}`}
                      style={{ width: `${width}%` }}
                    />
                  )
                })}
              </div>
              <dl className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-4">
                {[
                  { label: 'Live', count: stats.live, color: 'bg-emerald-500 dark:bg-emerald-600' },
                  { label: 'Production', count: stats.inProduction, color: 'bg-blue-500 dark:bg-blue-600' },
                  { label: 'Pending', count: stats.pending, color: 'bg-amber-500 dark:bg-amber-600' },
                  { label: 'Paused', count: stats.paused, color: 'bg-muted-foreground/50' },
                ].map(({ label, count, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className={`size-3 rounded-full ${color}`} aria-hidden="true" />
                    <span>
                      <span className="sr-only">{label} sites: </span>
                      {label}: {count}
                    </span>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </ItemContent>
      </Item>

      <Separator />

      <SitesTable sites={sites} />
    </div>
  )
}
