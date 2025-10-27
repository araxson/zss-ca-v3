'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database.types'
import type {
  CreateAnalyticsInput,
  UpdateAnalyticsInput,
  DeleteAnalyticsInput,
} from '../schema'

type Json = Database['public']['Tables']['site_analytics']['Row']['metadata']

export async function createAnalyticsAction(data: CreateAnalyticsInput) {
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
    return { error: 'Only admins can create analytics' }
  }

  // Verify site exists
  const { data: site } = await supabase
    .from('client_site')
    .select('id')
    .eq('id', data.client_site_id)
    .single()

  if (!site) {
    return { error: 'Site not found' }
  }

  const { error } = await supabase.from('site_analytics').insert({
    client_site_id: data.client_site_id,
    metric_date: data.metric_date,
    page_views: data.page_views,
    unique_visitors: data.unique_visitors,
    conversions: data.conversions,
    metadata: (data.metadata || {}) as Json,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/sites', 'page')
  revalidatePath(`/admin/sites/${data.client_site_id}`, 'page')

  return { success: true }
}

export async function updateAnalyticsAction(data: UpdateAnalyticsInput) {
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
    return { error: 'Only admins can update analytics' }
  }

  // Build update object with only provided fields
  const updateData: Record<string, unknown> = {}
  if (data.page_views !== undefined) updateData.page_views = data.page_views
  if (data.unique_visitors !== undefined) updateData.unique_visitors = data.unique_visitors
  if (data.conversions !== undefined) updateData.conversions = data.conversions
  if (data.metadata !== undefined) updateData.metadata = data.metadata as Json

  const { error } = await supabase
    .from('site_analytics')
    .update(updateData)
    .eq('id', data.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/sites', 'page')

  return { success: true }
}

export async function deleteAnalyticsAction(data: DeleteAnalyticsInput) {
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
    return { error: 'Only admins can delete analytics' }
  }

  const { error } = await supabase
    .from('site_analytics')
    .delete()
    .eq('id', data.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/sites', 'page')

  return { success: true }
}
