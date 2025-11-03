import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { CreateSiteForm } from './components'
import { Button } from '@/components/ui/button'

export async function CreateSitePageFeature() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(ROUTES.LOGIN)

  const { data: profile } = await supabase.from('profile').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect(ROUTES.CLIENT_DASHBOARD)

  const { data: clients } = await supabase.from('profile').select('id, contact_name, contact_email, company_name').eq('role', 'client').is('deleted_at', null).order('contact_name', { ascending: true, nullsFirst: false })
  const { data: plans } = await supabase.from('plan').select('*').eq('is_active', true).order('sort_order', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-3xl font-bold tracking-tight">Create New Site</h1>
          <p className="text-muted-foreground">Set up a new website project for a client</p>
        </div>
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/sites" aria-label="Back to sites">
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <CreateSiteForm clients={clients || []} plans={plans || []} />
    </div>
  )
}
