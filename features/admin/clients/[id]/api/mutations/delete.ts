'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { DeleteClientInput } from '../schema'

export async function deleteClientAction(data: DeleteClientInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('profile')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Only admins can delete client profiles' }
  }

  // Soft delete by setting deleted_at
  const { error } = await supabase

    .from('profile')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', data.profileId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/clients', 'page')

  return { success: true }
}
