'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { UpdateClientProfileInput, DeleteClientInput } from '../schema'

export async function updateClientProfileAction(data: UpdateClientProfileInput) {
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
    return { error: 'Only admins can update client profiles' }
  }

  const updates: Record<string, unknown> = {}
  if (data.fullName !== undefined) updates.contact_name = data.fullName
  if (data.company !== undefined) updates.company_name = data.company
  if (data.phone !== undefined) updates.contact_phone = data.phone

  const { error } = await supabase
    .from('profile')
    .update(updates)
    .eq('id', data.profileId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/clients', 'page')
  revalidatePath(`/admin/clients/${data.profileId}`, 'page')

  return { success: true }
}

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
