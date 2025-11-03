import 'server-only'

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { createClient } from '@/lib/supabase/server'
import { getClientSites } from '@/features/client/sites/api/queries'
import { SiteCard } from '@/features/client/sites/components/site-card'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Globe } from 'lucide-react'
import { ItemGroup } from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'

export async function SitesListFeature() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  const sites = await getClientSites()

  return (
    <div className="space-y-6">
      <SectionHeader
        title="My Sites"
        description="View and manage your website deployments"
        align="start"
      />
      {sites.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Globe className="size-6" />
            </EmptyMedia>
            <EmptyTitle>No sites yet</EmptyTitle>
            <EmptyDescription>
              You do not have any sites yet. Contact us to get started on your first project.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild variant="outline">
              <Link href={ROUTES.CLIENT_SUPPORT}>Contact support</Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <ItemGroup className="!grid gap-6 md:grid-cols-2" aria-label="Website cards">
          {sites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </ItemGroup>
      )}
    </div>
  )
}
