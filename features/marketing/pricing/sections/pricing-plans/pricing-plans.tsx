'use client'

import { useState } from 'react'
import { BillingIntervalToggle } from './billing-interval-toggle'
import { PricingPlanCard } from './pricing-plan-card'
import type { PricingPlansProps, BillingInterval } from './pricing-plans.types'

export function PricingPlans({ plans, isAuthenticated, hasSubscription }: PricingPlansProps) {
  const [interval, setInterval] = useState<BillingInterval>('monthly')

  if (plans.length === 0) {
    return null
  }

  return (
    <section className="space-y-8">
      <BillingIntervalToggle value={interval} onChange={setInterval} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {plans.map((plan, index) => {
          const isPopular = index === 1
          return (
            <PricingPlanCard
              key={plan.id}
              plan={plan}
              isPopular={isPopular}
              interval={interval}
              isAuthenticated={isAuthenticated}
              hasSubscription={hasSubscription}
            />
          )
        })}
      </div>
    </section>
  )
}
