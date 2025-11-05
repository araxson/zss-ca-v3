import 'server-only'

import { cache } from 'react'
import { createClient, requireAuth, requireAdminRole } from '@/lib/supabase'
import { EMPTY_ANALYTICS_SUMMARY } from '@/lib/constants'
import type { Database } from '@/lib/types/database.types'

export type SiteAnalytics = Database['public']['Tables']['site_analytics']['Row']

export interface AnalyticsSummary {
  totalPageViews: number
  totalUniqueVisitors: number
  totalConversions: number
  averagePageViews: number
  averageUniqueVisitors: number
  averageConversions: number
}

// ✅ Next.js 15+: Use React cache() for request deduplication within same render
export const getSiteAnalytics = cache(async (
  siteId: string,
  days = 30
): Promise<SiteAnalytics[]> => {
  const supabase = await createClient()
  await requireAuth(supabase)

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('site_analytics')
    .select(`
      id,
      client_site_id,
      metric_date,
      page_views,
      unique_visitors,
      conversions,
      metadata,
      created_at,
      updated_at
    `)
    .eq('client_site_id', siteId)
    .gte('metric_date', startDate.toISOString().split('T')[0])
    .order('metric_date', { ascending: true })

  if (error) {
    console.error('Error fetching site analytics:', error)
    return []
  }

  return data || []
})

// ✅ Next.js 15+: Use React cache() for request deduplication within same render
export const getAnalyticsSummary = cache(async (
  siteId: string,
  days = 30
): Promise<AnalyticsSummary> => {
  const analytics = await getSiteAnalytics(siteId, days)

  if (analytics.length === 0) {
    return { ...EMPTY_ANALYTICS_SUMMARY }
  }

  const totals = analytics.reduce(
    (acc, item) => ({
      pageViews: acc.pageViews + item.page_views,
      uniqueVisitors: acc.uniqueVisitors + item.unique_visitors,
      conversions: acc.conversions + item.conversions,
    }),
    { pageViews: 0, uniqueVisitors: 0, conversions: 0 }
  )

  return {
    totalPageViews: totals.pageViews,
    totalUniqueVisitors: totals.uniqueVisitors,
    totalConversions: totals.conversions,
    averagePageViews: Math.round(totals.pageViews / analytics.length),
    averageUniqueVisitors: Math.round(totals.uniqueVisitors / analytics.length),
    averageConversions: Math.round(totals.conversions / analytics.length),
  }
})

// ✅ Next.js 15+: Use React cache() for request deduplication within same render
export const getProfileAnalyticsSummary = cache(async (
  profileId: string,
  days = 30
): Promise<AnalyticsSummary> => {
  const supabase = await createClient()
  await requireAuth(supabase)

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  // Get all sites for this profile
  const { data: sites } = await supabase
    .from('client_site')
    .select('id')
    .eq('profile_id', profileId)
    .is('deleted_at', null)

  if (!sites || sites.length === 0) {
    return { ...EMPTY_ANALYTICS_SUMMARY }
  }

  const siteIds = sites.map((site) => site.id)

  // ✅ Next.js 15+: Query analytics (no waterfall needed here as we need sites first)
  const { data: analytics, error } = await supabase
    .from('site_analytics')
    .select(`
      id,
      client_site_id,
      metric_date,
      page_views,
      unique_visitors,
      conversions,
      metadata,
      created_at,
      updated_at
    `)
    .in('client_site_id', siteIds)
    .gte('metric_date', startDate.toISOString().split('T')[0])

  if (error || !analytics || analytics.length === 0) {
    return { ...EMPTY_ANALYTICS_SUMMARY }
  }

  const totals = analytics.reduce(
    (acc, item) => ({
      pageViews: acc.pageViews + item.page_views,
      uniqueVisitors: acc.uniqueVisitors + item.unique_visitors,
      conversions: acc.conversions + item.conversions,
    }),
    { pageViews: 0, uniqueVisitors: 0, conversions: 0 }
  )

  return {
    totalPageViews: totals.pageViews,
    totalUniqueVisitors: totals.uniqueVisitors,
    totalConversions: totals.conversions,
    averagePageViews: Math.round(totals.pageViews / analytics.length),
    averageUniqueVisitors: Math.round(totals.uniqueVisitors / analytics.length),
    averageConversions: Math.round(totals.conversions / analytics.length),
  }
})

export type SiteWithAnalytics = SiteAnalytics & {
  client_site: {
    id: string
    site_name: string
    profile: {
      contact_name: string | null
      contact_email: string | null
    }
  }
}

// ✅ Next.js 15+: Use React cache() for request deduplication within same render
export const listAnalytics = cache(async (limit = 100): Promise<SiteWithAnalytics[]> => {
  const supabase = await createClient()
  const user = await requireAuth(supabase)
  await requireAdminRole(supabase, user.id)

  const { data, error } = await supabase
    .from('site_analytics')
    .select(
      `
      id,
      client_site_id,
      metric_date,
      page_views,
      unique_visitors,
      conversions,
      bounce_rate,
      avg_session_duration,
      created_at,
      client_site:client_site_id(
        id,
        site_name,
        profile:profile_id(contact_name, contact_email)
      )
    `
    )
    .order('metric_date', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching all analytics:', error)
    return []
  }

  return (data as unknown as SiteWithAnalytics[]) || []
})
