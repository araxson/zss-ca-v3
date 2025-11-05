'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendSiteDeployedEmail } from '@/lib/email/send'
import { deploySiteSchema } from '../schema'

export async function deploySiteAction(
  prevState: { error: string; fieldErrors?: Record<string, string[]> } | { error: null } | null,
  formData: FormData
): Promise<{ error: string; fieldErrors?: Record<string, string[]> } | { error: null }> {
  // Extract site_id from hidden field
  const siteId = formData.get('site_id') as string

  // 1. Validate input with Zod
  const result = deploySiteSchema.safeParse({
    deployment_url: formData.get('deployment_url'),
    deployment_notes: formData.get('deployment_notes'),
  })

  if (!result.success) {
    return {
      error: 'Validation failed',
      fieldErrors: result.error.flatten().fieldErrors
    }
  }

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
      deployment_url: result.data.deployment_url,
      deployment_notes: result.data.deployment_notes || null,
      deployed_at: now,
      status: 'live',
    })
    .eq('id', siteId)

  if (error) {
    console.error('Site deployment error:', error)
    return { error: 'Failed to deploy site' }
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
        result.data.deployment_url
      )
    }
  }

  // ✅ Next.js 15.1+: Use updateTag() for immediate read-your-writes consistency
  updateTag('sites')
  updateTag(`site:${siteId}`)
  if (site) {
    updateTag(`sites:${site.profile_id}`)
  }

  revalidatePath('/admin/sites', 'page')
  revalidatePath(`/admin/sites/${siteId}`, 'page')
  revalidatePath('/client', 'page')

  return { error: null }
}
