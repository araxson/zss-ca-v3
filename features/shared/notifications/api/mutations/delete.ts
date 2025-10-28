'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { DeleteNotificationInput } from '../../schema'

export async function deleteNotificationAction(data: DeleteNotificationInput) {
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
    return { error: 'Only admins can delete notifications' }
  }

  const { error } = await supabase
    .from('notification')
    .delete()
    .eq('id', data.notificationId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/notifications', 'page')

  return { success: true }
}
