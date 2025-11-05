import 'server-only'

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

  // ✅ Parallel data fetching to avoid waterfall
  const [profileResult, clientsResult, plansResult] = await Promise.all([
    supabase.from('profile').select('role').eq('id', user.id).single(),
    supabase.from('profile').select('id, contact_name, contact_email, company_name').eq('role', 'client').is('deleted_at', null).order('contact_name', { ascending: true, nullsFirst: false }),
    supabase.from('plan').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
  ])

  const { data: profile } = profileResult
  if (profile?.role !== 'admin') redirect(ROUTES.CLIENT_DASHBOARD)

  const { data: clients } = clientsResult
  const { data: plans } = plansResult

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button asChild variant="ghost" size="icon">
          <Link href={ROUTES.ADMIN_SITES} aria-label="Back to sites">
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <CreateSiteForm clients={clients || []} plans={plans || []} />
    </div>
  )
}
