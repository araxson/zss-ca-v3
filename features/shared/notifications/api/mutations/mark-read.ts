'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { MarkNotificationReadInput } from '../../schema'

export async function markNotificationReadAction(data: MarkNotificationReadInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('notification')
    .update({ read_at: new Date().toISOString() })
    .eq('id', data.notificationId)
    .eq('profile_id', user.id)
    .is('read_at', null)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/client/dashboard', 'page')
  revalidatePath('/admin/dashboard', 'page')

  return { success: true }
}

export async function markAllNotificationsReadAction() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const { error } = await supabase
    .from('notification')
    .update({ read_at: new Date().toISOString() })
    .eq('profile_id', user.id)
    .is('read_at', null)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/client/dashboard', 'page')
  revalidatePath('/admin/dashboard', 'page')

  return { success: true }
}
