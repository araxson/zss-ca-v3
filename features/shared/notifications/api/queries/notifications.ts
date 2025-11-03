import 'server-only'

import { createClient, requireAuth, requireAdminRole } from '@/lib/supabase'
import type { Database } from '@/lib/types/database.types'

export type Notification = Database['public']['Tables']['notification']['Row']

export type NotificationWithProfile = Notification & {
  profile: {
    id: string
    contact_name: string | null
    contact_email: string | null
  }
}

export async function getUnreadNotifications(
  userId: string
): Promise<Notification[]> {
  const supabase = await createClient()
  await requireAuth(supabase)

  const { data, error } = await supabase
    .from('notification')
    .select('*')
    .eq('profile_id', userId)
    .is('read_at', null)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching unread notifications:', error)
    return []
  }

  return data || []
}

export async function listNotifications(
  userId: string,
  limit = 50
): Promise<Notification[]> {
  const supabase = await createClient()
  await requireAuth(supabase)

  const { data, error } = await supabase
    .from('notification')
    .select('*')
    .eq('profile_id', userId)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching notifications:', error)
    return []
  }

  return data || []
}

export async function getUnreadNotificationCount(
  userId: string
): Promise<number> {
  const supabase = await createClient()
  await requireAuth(supabase)

  const { count, error } = await supabase
    .from('notification')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', userId)
    .is('read_at', null)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)

  if (error) {
    console.error('Error fetching unread notification count:', error)
    return 0
  }

  return count || 0
}

export async function listNotificationsAdmin(
  limit = 100
): Promise<NotificationWithProfile[]> {
  const supabase = await createClient()
  const user = await requireAuth(supabase)
  await requireAdminRole(supabase, user.id)

  const { data, error } = await supabase
    .from('notification')
    .select(
      `
      *,
      profile:profile_id(id, contact_name, contact_email)
    `
    )
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching all notifications:', error)
    return []
  }

  return (data as unknown as NotificationWithProfile[]) || []
}
