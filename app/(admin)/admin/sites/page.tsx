import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { createClient } from '@/lib/supabase/server'
import { getAllSites } from '@/features/admin/sites/api/queries'
import { SitesTable } from '@/features/admin/sites/components/sites-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

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
      <Card className="bg-card">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle>Client Sites</CardTitle>
            <CardDescription>Manage all client website deployments</CardDescription>
          </div>
          <Button asChild>
            <Link href="/admin/sites/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Site
            </Link>
          </Button>
        </CardHeader>
      </Card>

      <Card className="h-full">
        <CardHeader>
          <CardTitle>All Sites</CardTitle>
          <CardDescription>
            {sites.length} {sites.length === 1 ? 'site' : 'sites'} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SitesTable sites={sites} />
        </CardContent>
      </Card>
    </div>
  )
}
