import 'server-only'

import { cache } from 'react'
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

// ✅ Next.js 15+: Use React cache() for request deduplication within same render
export const getUnreadNotifications = cache(async (
  userId: string
): Promise<Notification[]> => {
  const supabase = await createClient()
  await requireAuth(supabase)

  const { data, error } = await supabase
    .from('notification')
    .select('id, profile_id, title, body, notification_type, read_at, created_at, expires_at, action_url, metadata, updated_at')
    .eq('profile_id', userId)
    .is('read_at', null)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching unread notifications:', error)
    return []
  }

  return data || []
})

// ✅ Next.js 15+: Use React cache() for request deduplication within same render
export const listNotifications = cache(async (
  userId: string,
  limit = 50
): Promise<Notification[]> => {
  const supabase = await createClient()
  await requireAuth(supabase)

  const { data, error } = await supabase
    .from('notification')
    .select('id, profile_id, title, body, notification_type, read_at, created_at, expires_at, action_url, metadata, updated_at')
    .eq('profile_id', userId)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching notifications:', error)
    return []
  }

  return data || []
})

// ✅ Next.js 15+: Use React cache() for request deduplication within same render
export const getUnreadNotificationCount = cache(async (
  userId: string
): Promise<number> => {
  const supabase = await createClient()
  await requireAuth(supabase)

  const { count, error } = await supabase
    .from('notification')
    .select('id', { count: 'exact', head: true })
    .eq('profile_id', userId)
    .is('read_at', null)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)

  if (error) {
    console.error('Error fetching unread notification count:', error)
    return 0
  }

  return count || 0
})

// ✅ Next.js 15+: Use React cache() for request deduplication within same render
export const listNotificationsAdmin = cache(async (
  limit = 100
): Promise<NotificationWithProfile[]> => {
  const supabase = await createClient()
  const user = await requireAuth(supabase)
  await requireAdminRole(supabase, user.id)

  const { data, error } = await supabase
    .from('notification')
    .select(
      `
      id,
      profile_id,
      title,
      body,
      notification_type,
      read_at,
      created_at,
      updated_at,
      expires_at,
      action_url,
      metadata,
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
})
