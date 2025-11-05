'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import { createAuditLogSchema } from '../schema'

type Json = Database['public']['Tables']['audit_log']['Row']['change_summary']

export async function createAuditLogAction(data: unknown): Promise<{ error: string; fieldErrors?: Record<string, string[]> } | { error: null }> {
  // 1. Validate input with Zod
  const result = createAuditLogSchema.safeParse(data)

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
    return { error: 'Only admins can create manual audit logs' }
  }

  // 5. Perform database mutation
  const { error, data: auditLog } = await supabase
    .from('audit_log')
    .insert({
      actor_profile_id: user.id,
      profile_id: result.data.profile_id || null,
      action: result.data.action,
      resource_table: result.data.resource_table,
      resource_id: result.data.resource_id || null,
      change_summary: result.data.change_summary as Json,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Audit log creation error:', error)
    return { error: 'Failed to create audit log' }
  }

  // 6. Invalidate cache with updateTag for immediate consistency
  updateTag('audit-logs')
  if (auditLog) {
    updateTag(`audit-log:${auditLog.id}`)
  }

  revalidatePath('/admin/audit-logs', 'page')

  return { error: null }
}
