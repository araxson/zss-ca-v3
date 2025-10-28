'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendSiteDeployedEmail } from '@/lib/email/send'
import type { DeploySiteInput } from '../../schema'

export async function deploySiteAction(siteId: string, data: DeploySiteInput) {
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

  // Get site info for email notification
  const { data: site } = await supabase
    .from('client_site')
    .select('site_name, profile_id')
    .eq('id', siteId)
    .single()

  const now = new Date().toISOString()

  const { error } = await supabase
    .from('client_site')
    .update({
      deployment_url: data.deployment_url,
      deployment_notes: data.deployment_notes || null,
      deployed_at: now,
      status: 'live',
    })
    .eq('id', siteId)

  if (error) {
    return { error: error.message }
  }

  // Send site deployed email
  if (site) {
    const { data: siteOwner } = await supabase
      .from('profile')
      .select('contact_email, contact_name')
      .eq('id', site.profile_id)
      .single()

    if (siteOwner?.contact_email && siteOwner?.contact_name) {
      await sendSiteDeployedEmail(
        siteOwner.contact_email,
        siteOwner.contact_name,
        site.site_name,
        data.deployment_url
      )
    }
  }

  revalidatePath('/admin/sites', 'page')
  revalidatePath(`/admin/sites/${siteId}`, 'page')
  revalidatePath('/client/dashboard', 'page')

  return { success: true }
}
