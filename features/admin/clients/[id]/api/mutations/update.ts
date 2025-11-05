'use server'

import { updateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { updateClientProfileSchema } from '../schema'

export async function updateClientProfileAction(data: unknown): Promise<{ error: string; fieldErrors?: Record<string, string[]> } | { error: null }> {
  // 1. Validate input with Zod
  const result = updateClientProfileSchema.safeParse(data)

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
    return { error: 'Only admins can update client profiles' }
  }

  // 4. Build updates object from validated data
  const updates: Record<string, unknown> = {}
  if (result.data.fullName !== undefined) updates['contact_name'] = result.data.fullName
  if (result.data.company !== undefined) updates['company_name'] = result.data.company
  if (result.data.phone !== undefined) updates['contact_phone'] = result.data.phone

  // 5. Perform database mutation
  const { error } = await supabase
    .from('profile')
    .update(updates)
    .eq('id', result.data.profileId)

  if (error) {
    console.error('Profile update error:', error)
    return { error: 'Failed to update client profile' }
  }

  // 6. Invalidate cache with updateTag for immediate consistency
  updateTag('clients')
  updateTag(`client:${result.data.profileId}`)

  return { error: null }
}
