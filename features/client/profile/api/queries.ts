import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Tables']['profile']['Row']

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profile')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}
