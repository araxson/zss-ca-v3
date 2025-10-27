'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { CheckoutButton } from '@/features/shared/subscription/components/checkout-button'
import { pricingPlansCopy } from './pricing-plans.copy'
import type { PricingPlansProps, PricingPlan } from './pricing-plans.types'
import { BillingIntervalToggle, type BillingInterval } from './billing-interval-toggle'
import { siteConfig } from '@/lib/config/site.config'

type PlanFeature = {
  name: string
  description?: string | null
  included: boolean
}

const YEARLY_DISCOUNT = 0.8

function getPlanFeatures(plan: PricingPlan): PlanFeature[] {
  if (!plan.features || !Array.isArray(plan.features)) {
    return []
  }

  return plan.features.filter((feature): feature is PlanFeature => {
    return Boolean(feature && typeof feature === 'object' && 'name' in feature)
  })
}

function getMonthlyRate(plan: PricingPlan): number {
  const cents = plan.setup_fee_cents ?? 0
  return cents / 100
}

export function PricingPlans({ plans, isAuthenticated, hasSubscription }: PricingPlansProps) {
  const [interval, setInterval] = useState<BillingInterval>('monthly')
  const contactEmail = siteConfig.contact.email

  if (plans.length === 0) {
    return null
  }

  return (
    <section className="space-y-8">
      <BillingIntervalToggle value={interval} onChange={setInterval} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan, index) => {
          const features = getPlanFeatures(plan)
          const isPopular = index === 1
          const monthlyRate = getMonthlyRate(plan)
          const yearlyTotal = Math.round(monthlyRate * 12 * YEARLY_DISCOUNT * 100) / 100
          const displayRate = interval === 'yearly' ? yearlyTotal / 12 : monthlyRate

          return (
            <Item
              key={plan.id}
              variant="outline"
              className={`flex flex-col ${isPopular ? 'border-primary' : ''}`}
            >
              <ItemContent className="space-y-4">
                <div className="flex items-start justify-between">
                  <ItemTitle>{plan.name}</ItemTitle>
                  {isPopular && <Badge>{pricingPlansCopy.popularLabel}</Badge>}
                </div>
                {plan.description ? (
                  <ItemDescription>{plan.description}</ItemDescription>
                ) : null}
                <FieldGroup className="space-y-1">
                  {monthlyRate > 0 ? (
                    <FieldLabel className="flex items-baseline gap-1 text-3xl font-bold">
                      ${displayRate.toFixed(2)}
                      <span className="text-base font-medium text-muted-foreground">/mo</span>
                    </FieldLabel>
                  ) : (
                    <FieldLabel className="text-2xl font-bold text-foreground">
                      Contact for pricing
                    </FieldLabel>
                  )}
                  {interval === 'yearly' && monthlyRate > 0 ? (
                    <FieldDescription className="text-xs text-muted-foreground">
                      ${(yearlyTotal).toFixed(2)} billed annually (20% savings)
                    </FieldDescription>
                  ) : null}
                  {monthlyRate > 0 ? (
                    <FieldDescription className="text-sm text-muted-foreground">
                      {plan.page_limit ? `${plan.page_limit} pages` : 'Unlimited pages'} •{' '}
                      {plan.revision_limit ? `${plan.revision_limit} revisions/mo` : 'Unlimited revisions'}
                    </FieldDescription>
                  ) : null}
                </FieldGroup>
                {features.length > 0 ? (
                  <FieldGroup className="space-y-2">
                    {features
                      .filter((feature) => feature.included)
                      .map((feature) => (
                        <Field key={feature.name} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                          <div>
                            <FieldLabel className="text-sm font-medium text-foreground">
                              {feature.name}
                            </FieldLabel>
                            {feature.description ? (
                              <FieldDescription className="text-xs text-muted-foreground">
                                {feature.description}
                              </FieldDescription>
                            ) : null}
                          </div>
                        </Field>
                      ))}
                  </FieldGroup>
                ) : null}
              </ItemContent>
              <ItemActions className="mt-auto">
                {monthlyRate > 0 ? (
                  <CheckoutButton
                    planId={plan.id}
                    planName={plan.name}
                    billingInterval={interval}
                    isAuthenticated={isAuthenticated}
                    hasSubscription={hasSubscription}
                    variant={isPopular ? 'default' : 'outline'}
                  />
                ) : (
                  <Button asChild variant={isPopular ? 'default' : 'outline'} className="w-full">
                    <a href={`mailto:${contactEmail}`}>Talk to sales</a>
                  </Button>
                )}
              </ItemActions>
            </Item>
          )
        })}
      </div>
    </section>
  )
}
