'use server'

import { updateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function deleteSiteAction(siteId: string): Promise<{ error: string } | { error: null }> {
  // 1. Create authenticated Supabase client
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // 2. Verify user is admin
  const { data: profile } = await supabase
    .from('profile')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  // 3. Get site info before deletion for cache invalidation
  const { data: site } = await supabase
    .from('client_site')
    .select('profile_id')
    .eq('id', siteId)
    .single()

  // 4. Perform soft delete
  const { error } = await supabase
    .from('client_site')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', siteId)

  if (error) {
    console.error('Site deletion error:', error)
    return { error: 'Failed to delete site' }
  }

  // 5. Invalidate cache with updateTag for immediate consistency
  updateTag('sites')
  updateTag(`site:${siteId}`)
  if (site) {
    updateTag(`sites:${site.profile_id}`)
  }

  return { error: null }
}
