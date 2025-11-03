import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, Globe, Rocket, Clock, Pause } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import { createClient } from '@/lib/supabase/server'
import { listSites } from './api/queries'
import { SitesTable } from './components'
import { Button } from '@/components/ui/button'
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/components/ui/item'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

export async function SitesPageFeature() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  const { data: profile } = await supabase.from('profile').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') redirect(ROUTES.CLIENT_DASHBOARD)

  const sites = await listSites()

  // Calculate statistics
  const stats = {
    total: sites.length,
    live: sites.filter(s => s.status === 'live').length,
    inProduction: sites.filter(s => s.status === 'in_production').length,
    pending: sites.filter(s => s.status === 'pending' || s.status === 'awaiting_client_content').length,
    paused: sites.filter(s => s.status === 'paused' || s.status === 'archived').length,
  }

  const livePercentage = stats.total > 0 ? Math.round((stats.live / stats.total) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">Client Sites</h1>
          <p className="text-muted-foreground">Manage all client website deployments across the platform</p>
        </div>
        <Button asChild>
          <Link href="/admin/sites/new" aria-label="Create a new site">
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
            <ItemTitle className="text-2xl">{stats.total}</ItemTitle>
          </ItemContent>
        </Item>

        <Item variant="outline">
          <ItemMedia>
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
              <Rocket className="size-5 text-green-600" aria-hidden="true" />
            </div>
          </ItemMedia>
          <ItemContent>
            <ItemDescription>Live Sites</ItemDescription>
            <ItemTitle className="text-2xl">{stats.live}</ItemTitle>
          </ItemContent>
        </Item>

        <Item variant="outline">
          <ItemMedia>
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Clock className="size-5 text-blue-600" aria-hidden="true" />
            </div>
          </ItemMedia>
          <ItemContent>
            <ItemDescription>In Production</ItemDescription>
            <ItemTitle className="text-2xl">{stats.inProduction}</ItemTitle>
          </ItemContent>
        </Item>

        <Item variant="outline">
          <ItemMedia>
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Pause className="size-5 text-amber-600" aria-hidden="true" />
            </div>
          </ItemMedia>
          <ItemContent>
            <ItemDescription>Pending/Paused</ItemDescription>
            <ItemTitle className="text-2xl">{stats.pending + stats.paused}</ItemTitle>
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
            <Progress value={livePercentage} className="h-2" />
            <div className="grid gap-2 text-sm sm:grid-cols-4">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Live: {stats.live}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">Production: {stats.inProduction}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-amber-500" />
                <span className="text-muted-foreground">Pending: {stats.pending}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-gray-500" />
                <span className="text-muted-foreground">Paused: {stats.paused}</span>
              </div>
            </div>
          </div>
        </ItemContent>
      </Item>

      <Separator />

      <SitesTable sites={sites} />
    </div>
  )
}
