'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { createNotificationSchema } from '../schema'

type Json = Database['public']['Tables']['notification']['Row']['metadata']

export async function createNotificationAction(prevState: unknown, formData: FormData) {
  // 1. Validate input with Zod
  const result = createNotificationSchema.safeParse({
    profile_id: formData.get('profile_id'),
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
    return { error: 'Only admins can create notifications' }
  }

  // 5. Perform database mutation
  const { error, data: notification } = await supabase
    .from('notification')
    .insert({
      profile_id: result.data.profile_id,
      notification_type: result.data.notification_type,
      title: result.data.title,
      body: result.data.body || null,
      action_url: result.data.action_url || null,
      expires_at: result.data.expires_at || null,
      metadata: (result.data.metadata || {}) as Json,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Notification creation error:', error)
    return { error: 'Failed to create notification' }
  }

  // 6. Invalidate cache with updateTag for immediate consistency
  updateTag('notifications')
  updateTag(`notifications:${result.data.profile_id}`)
  if (notification) {
    updateTag(`notification:${notification.id}`)
  }

  revalidatePath('/admin/notifications', 'page')
  revalidatePath('/client', 'page')

  return { error: null, success: true, fieldErrors: {} }
}
