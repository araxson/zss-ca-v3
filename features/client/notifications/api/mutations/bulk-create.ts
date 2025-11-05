'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { bulkCreateNotificationSchema } from '../schema'

type Json = Database['public']['Tables']['notification']['Row']['metadata']

export async function bulkCreateNotificationAction(
  prevState: unknown,
  formData: FormData
): Promise<{ error: string; fieldErrors?: Record<string, string[]> } | { error: null; success: true; data: { count: number }; fieldErrors: Record<string, string[]> }> {
  // 1. Validate input with Zod
  const result = bulkCreateNotificationSchema.safeParse({
    notification_type: formData.get('notification_type'),
    title: formData.get('title'),
    body: formData.get('body') || null,
    action_url: formData.get('action_url') || null,
    expires_at: formData.get('expires_at') || null,
    metadata: {},
  })

  if (!result.success) {
    return {
      error: 'Validation failed',
      fieldErrors: result.error.flatten().fieldErrors
    }
  }

  // 2. Create authenticated Supabase client
  const supabase = await createClient()

  // 3. Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // 4. Verify admin role
  const { data: profile } = await supabase
    .from('profile')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Only admins can create bulk notifications' }
  }

  // 5. Get all active clients
  const { data: clients, error: clientsError } = await supabase
    .from('profile')
    .select('id')
    .eq('role', 'client')
    .is('deleted_at', null)

  if (clientsError) {
    console.error('Failed to fetch clients:', clientsError)
    return { error: 'Failed to fetch clients' }
  }

  if (!clients || clients.length === 0) {
    return { error: 'No active clients found' }
  }

  // 6. Perform database mutation
  const notifications = clients.map((client) => ({
    profile_id: client.id,
    notification_type: result.data.notification_type,
    title: result.data.title,
    body: result.data.body || null,
    action_url: result.data.action_url || null,
    expires_at: result.data.expires_at || null,
    metadata: (result.data.metadata || {}) as Json,
  }))

  const { error } = await supabase
    .from('notification')
    .insert(notifications)

  if (error) {
    console.error('Bulk notification creation error:', error)
    return { error: 'Failed to create bulk notifications' }
  }

  // 7. Invalidate cache with updateTag for immediate consistency
  updateTag('notifications')
  clients.forEach((client) => {
    updateTag(`notifications:${client.id}`)
  })

  revalidatePath('/admin/notifications', 'page')
  revalidatePath('/client', 'page')

  return { error: null, success: true, data: { count: clients.length }, fieldErrors: {} }
}
