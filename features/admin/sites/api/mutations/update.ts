'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendSiteStatusChangedEmail } from '@/lib/email/send'
import type { UpdateSiteInput } from '../../schema'
import type { Json } from '@/lib/types/database.types'

export async function updateSiteAction(siteId: string, data: UpdateSiteInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Verify user is admin
  const { data: profile } = await supabase
    .from('profile')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  // Get old status for email notification
  const { data: oldSite } = await supabase
    .from('client_site')
    .select('status, site_name, profile_id')
    .eq('id', siteId)
    .single()

  const updateData = {
    ...data,
    design_brief: data.design_brief ? (data.design_brief as Json) : undefined,
  }

  const { error } = await supabase
    .from('client_site')
    .update(updateData)
    .eq('id', siteId)

  if (error) {
    return { error: error.message }
  }

  // Send status change email if status changed
  if (data.status && oldSite && data.status !== oldSite.status) {
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
        data.status
      )
    }
  }

  revalidatePath('/admin/sites', 'page')
  revalidatePath(`/admin/sites/${siteId}`, 'page')
  revalidatePath('/client/dashboard', 'page')

  return { success: true }
}
