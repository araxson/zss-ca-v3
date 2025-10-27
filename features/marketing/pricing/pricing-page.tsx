import { createClient } from '@/lib/supabase/server'
import { getActivePlans } from './api/queries'
import { PricingHero } from './sections/pricing-hero'
import { PricingPlans } from './sections/pricing-plans'

export async function PricingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const plans = await getActivePlans()

  let hasSubscription = false
  if (user) {
    const { data: subscription } = await supabase
      .from('subscription')
      .select('id')
      .eq('profile_id', user.id)
      .in('status', ['active', 'trialing', 'past_due'])
      .maybeSingle()

    hasSubscription = Boolean(subscription)
  }

  return (
    <div className="container mx-auto flex flex-col gap-16 px-4 py-16 md:py-24">
      <PricingHero />
      <PricingPlans
        plans={plans}
        isAuthenticated={Boolean(user)}
        hasSubscription={hasSubscription}
      />
    </div>
  )
}
