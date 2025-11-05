'use server'

import { revalidatePath, updateTag } from 'next/cache'
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

  // Verify admin role and site existence in parallel
  const [
    { data: profile },
    { data: site },
  ] = await Promise.all([
    supabase
      .from('profile')
      .select('role')
      .eq('id', user.id)
      .single(),
    supabase
      .from('client_site')
      .select('id')
      .eq('id', data.client_site_id)
      .single(),
  ])

  if (profile?.role !== 'admin') {
    return { error: 'Only admins can create analytics' }
  }

  if (!site) {
    return { error: 'Site not found' }
  }

  const { error, data: analytics } = await supabase

    .from('site_analytics')
    .insert({
      client_site_id: data.client_site_id,
      metric_date: data.metric_date,
      page_views: data.page_views,
      unique_visitors: data.unique_visitors,
      conversions: data.conversions,
      metadata: (data.metadata || {}) as Json,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Database error:', error)
    return { error: 'Operation failed' }
  }

  // ✅ Next.js 15.1+: Use updateTag() for immediate read-your-writes consistency
  updateTag('analytics')
  updateTag(`analytics:${data.client_site_id}`)
  if (analytics) {
    updateTag(`analytics:${analytics.id}`)
  }

  revalidatePath('/admin/sites', 'page')
  revalidatePath(`/admin/sites/${data.client_site_id}`, 'page')

  return { error: null }
}

export async function updateAnalyticsAction(data: UpdateAnalyticsInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // ✅ Next.js 15+: Use Promise.all to avoid sequential waterfall
  const [
    { data: profile },
    { data: analytics }
  ] = await Promise.all([
    // Verify admin role
    supabase
      .from('profile')
      .select('role')
      .eq('id', user.id)
      .single(),

    // Get site_id before update for cache invalidation
    supabase
      .from('site_analytics')
      .select('client_site_id')
      .eq('id', data.id)
      .single()
  ])

  if (profile?.role !== 'admin') {
    return { error: 'Only admins can update analytics' }
  }

  // Build update object with only provided fields
  const updateData: Record<string, unknown> = {}
  if (data.page_views !== undefined) updateData['page_views'] = data.page_views
  if (data.unique_visitors !== undefined) updateData['unique_visitors'] = data.unique_visitors
  if (data.conversions !== undefined) updateData['conversions'] = data.conversions
  if (data.metadata !== undefined) updateData['metadata'] = data.metadata as Json

  const { error } = await supabase

    .from('site_analytics')
    .update(updateData)
    .eq('id', data.id)

  if (error) {
    console.error('Database error:', error)
    return { error: 'Operation failed' }
  }

  // ✅ Next.js 15.1+: Use updateTag() for immediate read-your-writes consistency
  updateTag('analytics')
  updateTag(`analytics:${data.id}`)
  if (analytics?.client_site_id) {
    updateTag(`analytics:${analytics.client_site_id}`)
  }

  revalidatePath('/admin/sites', 'page')

  return { error: null }
}

export async function deleteAnalyticsAction(data: DeleteAnalyticsInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // ✅ Next.js 15+: Use Promise.all to avoid sequential waterfall
  const [
    { data: profile },
    { data: analytics }
  ] = await Promise.all([
    // Verify admin role
    supabase
      .from('profile')
      .select('role')
      .eq('id', user.id)
      .single(),

    // Get site_id before delete for cache invalidation
    supabase
      .from('site_analytics')
      .select('client_site_id')
      .eq('id', data.id)
      .single()
  ])

  if (profile?.role !== 'admin') {
    return { error: 'Only admins can delete analytics' }
  }

  const { error } = await supabase

    .from('site_analytics')
    .delete()
    .eq('id', data.id)

  if (error) {
    console.error('Database error:', error)
    return { error: 'Operation failed' }
  }

  // ✅ Next.js 15.1+: Use updateTag() for immediate read-your-writes consistency
  updateTag('analytics')
  updateTag(`analytics:${data.id}`)
  if (analytics?.client_site_id) {
    updateTag(`analytics:${analytics.client_site_id}`)
  }

  revalidatePath('/admin/sites', 'page')

  return { error: null }
}
