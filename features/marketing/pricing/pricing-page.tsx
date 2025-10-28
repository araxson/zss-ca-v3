import { createClient } from '@/lib/supabase/server'
import { getActivePlans } from './api/queries'
import { PricingHero } from './sections/pricing-hero'
import { PricingPlans } from './sections/pricing-plans'
import { ItemGroup } from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'

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
    <ItemGroup className="container mx-auto flex flex-col gap-16 px-4 py-16 md:py-24">
      <SectionHeader
        title="Choose the subscription that fits"
        description="Monthly and annual plans crafted for ongoing website production and support."
        align="center"
      />
      <PricingHero />
      <PricingPlans
        plans={plans}
        isAuthenticated={Boolean(user)}
        hasSubscription={hasSubscription}
      />
    </ItemGroup>
  )
}
