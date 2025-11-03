'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { CreateSiteInput } from '../schema'
import type { Json } from '@/lib/types/database.types'

export async function createSiteAction(data: CreateSiteInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Verify user is admin
  const { data: profile } = await supabase
    .from('profile')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    
    .from('client_site')
    .insert({
    profile_id: data.profile_id,
    site_name: data.site_name,
    design_brief: (data.design_brief || {}) as Json,
    plan_id: data.plan_id || null,
    subscription_id: data.subscription_id || null,
    status: 'pending',
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/sites', 'page')
  revalidatePath('/client/dashboard', 'page')

  return { success: true }
}
