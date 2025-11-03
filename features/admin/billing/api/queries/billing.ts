import 'server-only'
import { createClient } from '@/lib/supabase/server'

export async function getBillingData() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  // TODO: Implement billing queries
  // Example: Invoices, payment methods, billing history
  return {
    invoices: [],
    paymentMethods: [],
    billingHistory: [],
  }
}
