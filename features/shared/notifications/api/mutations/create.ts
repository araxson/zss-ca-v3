'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import type { CreateNotificationInput } from '../schema'

type Json = Database['public']['Tables']['notification']['Row']['metadata']

export async function createNotificationAction(data: CreateNotificationInput) {
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
    return { error: 'Only admins can create notifications' }
  }

  const { error } = await supabase
    
    .from('notification')
    .insert({
    profile_id: data.profile_id,
    notification_type: data.notification_type,
    title: data.title,
    body: data.body || null,
    action_url: data.action_url || null,
    expires_at: data.expires_at || null,
    metadata: (data.metadata || {}) as Json,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/notifications', 'page')
  revalidatePath('/client/dashboard', 'page')

  return { success: true }
}
