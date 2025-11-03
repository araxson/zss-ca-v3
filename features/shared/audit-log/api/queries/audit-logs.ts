import 'server-only'

import { createClient, requireAuth, requireAdminRole } from '@/lib/supabase'
import type { Database } from '@/lib/types/database.types'

export type AuditLog = Database['public']['Tables']['audit_log']['Row']

export type AuditLogWithProfiles = AuditLog & {
  actor_profile: {
    id: string
    contact_name: string | null
    contact_email: string | null
    role: string
  } | null
  profile: {
    id: string
    contact_name: string | null
    contact_email: string | null
    role: string
  } | null
}

export async function getAuditLogs(
  limit = 100,
  offset = 0
): Promise<AuditLogWithProfiles[]> {
  const supabase = await createClient()
  const user = await requireAuth(supabase)
  await requireAdminRole(supabase, user.id)

  const { data, error } = await supabase
    .from('audit_log')
    .select(
      `
      *,
      actor_profile:actor_profile_id(id, contact_name, contact_email, role),
      profile:profile_id(id, contact_name, contact_email, role)
    `
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching audit logs:', error)
    return []
  }

  return (data || []) as unknown as AuditLogWithProfiles[]
}

export async function getAuditLogsByResource(
  resourceTable: string,
  resourceId: string,
  limit = 50
): Promise<AuditLogWithProfiles[]> {
  const supabase = await createClient()
  const user = await requireAuth(supabase)
  await requireAdminRole(supabase, user.id)

  const { data, error } = await supabase
    .from('audit_log')
    .select(
      `
      *,
      actor_profile:actor_profile_id(id, contact_name, contact_email, role),
      profile:profile_id(id, contact_name, contact_email, role)
    `
    )
    .eq('resource_table', resourceTable)
    .eq('resource_id', resourceId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching audit logs by resource:', error)
    return []
  }

  return (data || []) as unknown as AuditLogWithProfiles[]
}

export async function getAuditLogsByUser(
  userId: string,
  limit = 50
): Promise<AuditLogWithProfiles[]> {
  const supabase = await createClient()
  const user = await requireAuth(supabase)
  await requireAdminRole(supabase, user.id)

  const { data, error } = await supabase
    .from('audit_log')
    .select(
      `
      *,
      actor_profile:actor_profile_id(id, contact_name, contact_email, role),
      profile:profile_id(id, contact_name, contact_email, role)
    `
    )
    .eq('actor_profile_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching audit logs by user:', error)
    return []
  }

  return (data || []) as unknown as AuditLogWithProfiles[]
}
