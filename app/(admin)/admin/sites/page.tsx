import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { createClient } from '@/lib/supabase/server'
import { getAllSites, SitesTable } from '@/features/admin/sites'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { SectionHeader } from '@/features/shared/components'
import { Item, ItemContent } from '@/components/ui/item'

export default async function AdminSitesPage() {
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

  const sites = await getAllSites()

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Client Sites"
        description="Manage all client website deployments"
        align="start"
        actions={
          <Button asChild>
            <Link href="/admin/sites/new">
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Create Site
            </Link>
          </Button>
        }
      />

      <Item variant="outline" className="flex flex-col space-y-4 p-6">
        <SectionHeader
          title="All Sites"
          description={`${sites.length} ${sites.length === 1 ? 'site' : 'sites'} total`}
          align="start"
        />
        <ItemContent className="p-0">
          <SitesTable sites={sites} />
        </ItemContent>
      </Item>
    </div>
  )
}
