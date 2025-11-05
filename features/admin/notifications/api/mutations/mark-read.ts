'use server'

import { updateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { markNotificationReadSchema } from '../schema'

export async function markNotificationReadAction(data: unknown) {
  // 1. Validate input with Zod
  const result = markNotificationReadSchema.safeParse(data)

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

  // 4. Perform database mutation
  const { error } = await supabase
    .from('notification')
    .update({ read_at: new Date().toISOString() })
    .eq('id', result.data.notificationId)
    .eq('profile_id', user.id)
    .is('read_at', null)

  if (error) {
    console.error('Mark notification read error:', error)
    return { error: 'Failed to mark notification as read' }
  }

  // 5. Invalidate cache with updateTag for immediate consistency
  updateTag('notifications')
  updateTag(`notifications:${user.id}`)
  updateTag(`notification:${result.data.notificationId}`)

  return { error: null }
}

export async function markAllNotificationsReadAction() {
  // 1. Create authenticated Supabase client
  const supabase = await createClient()

  // 2. Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // 3. Perform database mutation
  const { error } = await supabase
    .from('notification')
    .update({ read_at: new Date().toISOString() })
    .eq('profile_id', user.id)
    .is('read_at', null)

  if (error) {
    console.error('Mark all notifications read error:', error)
    return { error: 'Failed to mark all notifications as read' }
  }

  // 4. Invalidate cache with updateTag for immediate consistency
  updateTag('notifications')
  updateTag(`notifications:${user.id}`)

  return { error: null }
}
