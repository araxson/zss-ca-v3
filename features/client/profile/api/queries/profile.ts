import 'server-only'

import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Tables']['profile']['Row']

// ✅ Next.js 15+: Use React cache() for request deduplication within same render
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profile')
    .select(`
      id,
      contact_name,
      contact_email,
      contact_phone,
      company_name,
      company_website,
      address_line1,
      address_line2,
      city,
      postal_code,
      country,
      region,
      marketing_opt_in,
      onboarding_notes,
      stripe_customer_id,
      role,
      created_at,
      updated_at,
      deleted_at
    `)
    .eq('id', user.id)
    .single()

  return profile
})
