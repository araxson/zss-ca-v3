'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import type { BulkCreateNotificationInput } from '../../schema'

type Json = Database['public']['Tables']['notification']['Row']['metadata']

export async function bulkCreateNotificationAction(data: BulkCreateNotificationInput) {
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
    return { error: 'Only admins can create bulk notifications' }
  }

  // Get all active clients
  const { data: clients, error: clientsError } = await supabase
    .from('profile')
    .select('id')
    .eq('role', 'client')
    .is('deleted_at', null)

  if (clientsError) {
    return { error: 'Failed to fetch clients: ' + clientsError.message }
  }

  if (!clients || clients.length === 0) {
    return { error: 'No active clients found' }
  }

  // Create notification for each client
  const notifications = clients.map((client) => ({
    profile_id: client.id,
    notification_type: data.notification_type,
    title: data.title,
    body: data.body || null,
    action_url: data.action_url || null,
    expires_at: data.expires_at || null,
    metadata: (data.metadata || {}) as Json,
  }))

  const { error } = await supabase.from('notification').insert(notifications)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/notifications', 'page')
  revalidatePath('/client/dashboard', 'page')

  return { success: true, count: clients.length }
}
