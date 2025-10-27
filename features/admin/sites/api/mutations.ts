'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendSiteDeployedEmail, sendSiteStatusChangedEmail } from '@/lib/email/send'
import type { CreateSiteInput, UpdateSiteInput, DeploySiteInput } from '../schema'
import type { Json } from '@/lib/types/database.types'

export async function createSiteAction(data: CreateSiteInput) {
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

  const { error } = await supabase.from('client_site').insert({
    profile_id: data.profile_id,
    site_name: data.site_name,
    design_brief: (data.design_brief || {}) as Json,
    plan_id: data.plan_id || null,
    subscription_id: data.subscription_id || null,
    status: 'pending',
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/sites', 'page')
  revalidatePath('/client/dashboard', 'page')

  return { success: true }
}

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

export async function deleteSiteAction(siteId: string) {
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

  const now = new Date().toISOString()

  const { error } = await supabase
    .from('client_site')
    .update({ deleted_at: now })
    .eq('id', siteId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/sites', 'page')
  revalidatePath('/client/dashboard', 'page')

  return { success: true }
}
