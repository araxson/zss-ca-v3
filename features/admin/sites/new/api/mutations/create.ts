'use server'

import { updateTag } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createSiteSchema } from '../schema'
import type { Json } from '@/lib/types/database.types'

type ActionResult =
  | { error: string; fieldErrors?: Record<string, string[]> }
  | { error: null; data: { id: string } }

export async function createSiteAction(prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  // 1. Validate input with Zod
  const design_brief_notes = formData.get('design_brief_notes') as string
  const result = createSiteSchema.safeParse({
    profile_id: formData.get('profile_id'),
    site_name: formData.get('site_name'),
    design_brief: design_brief_notes ? { notes: design_brief_notes } : {},
    plan_id: formData.get('plan_id') || null,
    subscription_id: formData.get('subscription_id') || null,
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

  // 4. Perform database mutation
  const { error, data: site } = await supabase
    .from('client_site')
    .insert({
      profile_id: result.data.profile_id,
      site_name: result.data.site_name,
      design_brief: (result.data.design_brief || {}) as Json,
      plan_id: result.data.plan_id || null,
      subscription_id: result.data.subscription_id || null,
      status: 'pending',
    })
    .select('id, profile_id')
    .single()

  if (error) {
    console.error('Site creation error:', error)
    return { error: 'Failed to create site' }
  }

  // 5. Invalidate cache with updateTag for immediate consistency
  updateTag('sites')
  updateTag(`sites:${result.data.profile_id}`)
  updateTag(`site:${site.id}`)

  return { error: null, data: { id: site.id } }
}
