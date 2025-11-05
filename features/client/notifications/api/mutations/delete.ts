'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { deleteNotificationSchema } from '../schema'

export async function deleteNotificationAction(data: unknown) {
  // 1. Validate input with Zod
  const result = deleteNotificationSchema.safeParse(data)

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

  // 4. Verify admin role and get notification info in parallel
  const [
    { data: profile },
    { data: notification }
  ] = await Promise.all([
    supabase
      .from('profile')
      .select('role')
      .eq('id', user.id)
      .single(),

    supabase
      .from('notification')
      .select('profile_id')
      .eq('id', result.data.notificationId)
      .single()
  ])

  if (profile?.role !== 'admin') {
    return { error: 'Only admins can delete notifications' }
  }

  // 5. Perform database mutation
  const { error } = await supabase
    .from('notification')
    .delete()
    .eq('id', result.data.notificationId)

  if (error) {
    console.error('Notification deletion error:', error)
    return { error: 'Failed to delete notification' }
  }

  // 6. Invalidate cache with updateTag for immediate consistency
  updateTag('notifications')
  updateTag(`notification:${result.data.notificationId}`)
  if (notification) {
    updateTag(`notifications:${notification.profile_id}`)
  }

  revalidatePath('/admin/notifications', 'page')

  return { error: null }
}
