'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BillingIntervalToggle } from './billing-interval-toggle'
import { CheckoutButton } from '@/features/shared/subscription/components/checkout-button'
import type { Database } from '@/lib/types/database.types'

type Plan = Database['public']['Tables']['plan']['Row']
type BillingInterval = 'monthly' | 'yearly'

type PlanFeature = {
  name: string
  description: string
  included: boolean
}

interface PricingCardsProps {
  plans: Plan[]
  isAuthenticated: boolean
  hasSubscription: boolean
}

export function PricingCards({
  plans,
  isAuthenticated,
  hasSubscription,
}: PricingCardsProps) {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('monthly')

  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No active plans available at the moment. Please check back later.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <BillingIntervalToggle onIntervalChange={setBillingInterval} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {plans.map((plan, index) => {
          const features = Array.isArray(plan.features)
            ? (plan.features as PlanFeature[])
            : []
          const isPopular = index === 1 // Mark Business plan as popular

          // Temporary: Pricing should come from Stripe
          // For now, use setup fee as placeholder or show "Contact for pricing"
          const monthlyPrice = plan.setup_fee_cents ? plan.setup_fee_cents / 100 : 0
          const yearlyPrice = monthlyPrice * 12
          const price = billingInterval === 'yearly' ? yearlyPrice / 12 : monthlyPrice
          const totalYearly = yearlyPrice

          return (
            <Card key={plan.id} className={isPopular ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{plan.name}</CardTitle>
                  {isPopular && <Badge>Popular</Badge>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      ${price.toFixed(2)}
                    </span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  {billingInterval === 'yearly' && (
                    <p className="text-xs text-muted-foreground">
                      ${totalYearly.toFixed(2)} billed annually
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.page_limit
                      ? `${plan.page_limit} pages`
                      : 'Unlimited pages'}
                    {' • '}
                    {plan.revision_limit
                      ? `${plan.revision_limit} revisions/mo`
                      : 'Unlimited revisions'}
                  </p>
                </div>
                <ul className="space-y-2">
                  {features
                    .filter((f) => f.included)
                    .map((feature) => (
                      <li
                        key={feature.name}
                        className="text-sm flex items-start gap-2"
                      >
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">{feature.name}</span>
                          {feature.description && (
                            <p className="text-muted-foreground text-xs">
                              {feature.description}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                </ul>
              </CardContent>
              <CardFooter>
                <CheckoutButton
                  planId={plan.id}
                  planName={plan.name}
                  billingInterval={billingInterval}
                  isAuthenticated={isAuthenticated}
                  hasSubscription={hasSubscription}
                  variant={isPopular ? 'default' : 'outline'}
                />
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
