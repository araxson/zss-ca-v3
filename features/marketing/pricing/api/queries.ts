import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'

type Plan = Database['public']['Tables']['plan']['Row']

export async function getActivePlans(): Promise<Plan[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('plan')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (error) {
    console.error('Error fetching plans:', error)
    return []
  }

  return data ?? []
}
