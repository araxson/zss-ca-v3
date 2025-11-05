'use server'

import { updateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendSiteStatusChangedEmail } from '@/lib/email/send'
import { updateSiteSchema } from '../schema'
import type { Json } from '@/lib/types/database.types'

export async function updateSiteAction(
  prevState: { error: string; fieldErrors?: Record<string, string[]> } | { error: null } | null,
  formData: FormData
): Promise<{ error: string; fieldErrors?: Record<string, string[]> } | { error: null }> {
  // Extract site_id from hidden field
  const siteId = formData.get('site_id') as string

  // 1. Validate input with Zod
  const result = updateSiteSchema.safeParse({
    site_name: formData.get('site_name'),
    status: formData.get('status'),
    deployment_url: formData.get('deployment_url'),
    custom_domain: formData.get('custom_domain'),
    deployment_notes: formData.get('deployment_notes'),
  })

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

  // 3. Verify user is admin
  const { data: profile } = await supabase
    .from('profile')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  // 4. Get old status for email notification
  const { data: oldSite } = await supabase
    .from('client_site')
    .select('status, site_name, profile_id')
    .eq('id', siteId)
    .single()

  // 5. Build update data
  const updateData = {
    ...result.data,
    design_brief: result.data.design_brief ? (result.data.design_brief as Json) : undefined,
  }

  // 6. Perform database mutation
  const { error } = await supabase
    .from('client_site')
    .update(updateData)
    .eq('id', siteId)

  if (error) {
    console.error('Site update error:', error)
    return { error: 'Failed to update site' }
  }

  // 7. Send status change email if status changed
  if (result.data.status && oldSite && result.data.status !== oldSite.status) {
    const { data: siteOwner } = await supabase
      .from('profile')
      .select('contact_email, contact_name')
      .eq('id', oldSite.profile_id)
      .single()

    if (siteOwner?.contact_email && siteOwner?.contact_name) {
      await sendSiteStatusChangedEmail(
        siteOwner.contact_email,
        siteOwner.contact_name,
        oldSite.site_name,
        oldSite.status,
        result.data.status
      )
    }
  }

  // 8. Invalidate cache with updateTag for immediate consistency
  updateTag('sites')
  updateTag(`site:${siteId}`)
  if (oldSite) {
    updateTag(`sites:${oldSite.profile_id}`)
  }

  return { error: null }
}
