'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updatePaymentMethodAction(data: Record<string, unknown>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // TODO: Implement payment method update logic
  // Example: Update via Stripe API

  revalidatePath('/admin/billing')

  return { success: true }
}
