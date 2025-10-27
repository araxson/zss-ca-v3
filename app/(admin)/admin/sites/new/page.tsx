import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { CreateSiteForm } from '@/features/admin/sites/components/create-site-form'

export default async function AdminCreateSitePage() {
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

  if (profile?.role !== 'admin') {
    redirect(ROUTES.CLIENT_DASHBOARD)
  }

  // Get all clients for the dropdown
  const { data: clients } = await supabase
    .from('profile')
    .select('id, contact_name, contact_email, company_name')
    .eq('role', 'client')
    .is('deleted_at', null)
    .order('contact_name', { ascending: true, nullsFirst: false })

  // Get all active plans
  const { data: plans } = await supabase
    .from('plan')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/sites">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Site</h1>
          <p className="text-muted-foreground">Set up a new website project for a client</p>
        </div>
      </div>

      <CreateSiteForm clients={clients || []} plans={plans || []} />
    </div>
  )
}
