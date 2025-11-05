'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, updateTag } from 'next/cache'

export async function updateSettingsAction(_data: Record<string, unknown>): Promise<{ error: string } | { error: null }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // TODO: Implement settings update logic
  // Example: Update system configurations

  // ✅ Next.js 15.1+: Use updateTag() for immediate read-your-writes consistency
  updateTag('settings')
  updateTag(`settings:${user.id}`)

  revalidatePath('/admin/settings', 'page')

  return { error: null }
}
