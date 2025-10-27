import { createClient } from '@/lib/supabase/server'
import { getActivePlans } from '@/features/marketing/pricing/api/queries'
import { PricingCards } from '@/features/marketing/pricing/components/pricing-cards'

export default async function PricingPage() {
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
      .single()

    hasSubscription = !!subscription
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that best fits your business needs. All plans include hosting, SSL, and ongoing support.
          </p>
        </div>
        <PricingCards
          plans={plans}
          isAuthenticated={!!user}
          hasSubscription={hasSubscription}
        />
      </div>
    </div>
  )
}
