'use client'

import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckoutButton } from '@/features/shared/subscription'
import { pricingPlansCopy } from './pricing-plans-copy'
import type { PricingPlan } from './pricing-plans.types'
import type { BillingInterval } from './billing-interval-toggle'
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

type PricingPlanCardProps = {
  plan: PricingPlan
  isPopular: boolean
  interval: BillingInterval
  isAuthenticated: boolean
  hasSubscription: boolean
}

export function PricingPlanCard({
  plan,
  isPopular,
  interval,
  isAuthenticated,
  hasSubscription,
}: PricingPlanCardProps) {
  const features = getPlanFeatures(plan)
  const monthlyRate = getMonthlyRate(plan)
  const yearlyTotal = Math.round(monthlyRate * 12 * YEARLY_DISCOUNT * 100) / 100
  const displayRate = interval === 'yearly' ? yearlyTotal / 12 : monthlyRate
  const contactEmail = siteConfig.contact.email

  return (
    <Card>
      <CardHeader>
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle>{plan.name}</CardTitle>
            {isPopular && <Badge>{pricingPlansCopy.popularLabel}</Badge>}
          </div>
          {plan.description ? (
            <CardDescription>{plan.description}</CardDescription>
          ) : null}
          <div className="space-y-1">
            {monthlyRate > 0 ? (
              <p className="flex items-baseline gap-1 text-3xl font-bold">
                ${displayRate.toFixed(2)}
                <span className="text-base font-medium text-muted-foreground">/mo</span>
              </p>
            ) : (
              <p className="text-2xl font-bold text-foreground">Contact for pricing</p>
            )}
            {interval === 'yearly' && monthlyRate > 0 ? (
              <p className="text-xs text-muted-foreground">
                ${yearlyTotal.toFixed(2)} billed annually (20% savings)
              </p>
            ) : null}
            {monthlyRate > 0 ? (
              <p className="text-sm text-muted-foreground">
                {plan.page_limit ? `${plan.page_limit} pages` : 'Unlimited pages'} •{' '}
                {plan.revision_limit ? `${plan.revision_limit} revisions/mo` : 'Unlimited revisions'}
              </p>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {features.length > 0 ? (
          <div className="space-y-3" aria-label={`${plan.name} features`}>
            {features
              .filter((feature) => feature.included)
              .map((feature) => (
                <div key={feature.name} className="flex items-start gap-3 rounded-md bg-muted/40 p-3">
                  <span className="mt-1 text-primary" aria-hidden="true">
                    <Check className="size-4" />
                  </span>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{feature.name}</p>
                    {feature.description ? (
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    ) : null}
                  </div>
                </div>
              ))}
          </div>
        ) : null}
      </CardContent>
      <CardFooter>
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
          <Button asChild variant={isPopular ? 'default' : 'outline'}>
            <a className="block w-full" href={`mailto:${contactEmail}`}>
              Talk to sales
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
