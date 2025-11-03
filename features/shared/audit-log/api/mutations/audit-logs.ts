'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import type { CreateAuditLogInput } from '../schema'

type Json = Database['public']['Tables']['audit_log']['Row']['change_summary']

export async function createAuditLogAction(data: CreateAuditLogInput) {
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
    return { error: 'Only admins can create manual audit logs' }
  }

  const { error } = await supabase
    
    .from('audit_log')
    .insert({
      actor_profile_id: user.id,
      profile_id: data.profile_id || null,
      action: data.action,
      resource_table: data.resource_table,
      resource_id: data.resource_id || null,
      change_summary: data.change_summary as Json,
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/audit-logs', 'page')

  return { success: true }
}
