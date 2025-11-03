'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function deleteSiteAction(siteId: string) {
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

  const now = new Date().toISOString()

  const { error } = await supabase
    
    .from('client_site')
    .update({ deleted_at: now })
    .eq('id', siteId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/sites', 'page')
  revalidatePath('/client/dashboard', 'page')

  return { success: true }
}
