'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, updateTag } from 'next/cache'

export async function updatePaymentMethodAction(_data: Record<string, unknown>): Promise<{ error: string } | { error: null }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // TODO: Implement payment method update logic
  // Example: Update via Stripe API

  // ✅ Next.js 15.1+: Use updateTag() for immediate read-your-writes consistency
  updateTag('billing')
  updateTag(`billing:${user.id}`)

  revalidatePath('/admin/billing', 'page')

  return { error: null }
}
