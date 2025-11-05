'use server'

import { updateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { deleteClientSchema } from '../schema'

export async function deleteClientAction(data: unknown): Promise<{ error: string; fieldErrors?: Record<string, string[]> } | { error: null }> {
  // 1. Validate input with Zod
  const result = deleteClientSchema.safeParse(data)

  if (!result.success) {
    return {
      error: 'Validation failed',
      fieldErrors: result.error.flatten().fieldErrors
    }
  }

  // 2. Create authenticated Supabase client
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // 3. Verify admin role
  const { data: profile } = await supabase
    .from('profile')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Only admins can delete client profiles' }
  }

  // 4. Perform soft delete by setting deleted_at
  const { error } = await supabase
    .from('profile')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', result.data.profileId)

  if (error) {
    console.error('Delete client error:', error)
    return { error: 'Failed to delete client profile' }
  }

  // 5. Invalidate cache with updateTag for immediate consistency
  updateTag('clients')
  updateTag(`client:${result.data.profileId}`)

  return { error: null }
}
