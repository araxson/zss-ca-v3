import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SectionHeader } from '@/features/shared/components'
import { ROUTES } from '@/lib/constants/routes'
import { getPlansForPreview } from './api/queries'

type PlanFeature = {
  name: string
  description: string
  included: boolean
}

export async function PricingPreview() {
  const plans = await getPlansForPreview()

  if (plans.length === 0) {
    return null
  }

  return (
    <section className="mx-auto w-full max-w-7xl space-y-12">
      <SectionHeader
        title="Simple, Transparent Pricing"
        description="Choose the plan that fits your business. All plans include hosting, support, and maintenance."
        align="center"
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan, index) => {
          const features = Array.isArray(plan.features)
            ? (plan.features as PlanFeature[])
            : []
          const isPopular = index === 1

          return (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{plan.name}</CardTitle>
                  {isPopular && <Badge variant="default">Popular</Badge>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {plan.priceMonthly ? (
                      <>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold">${plan.priceMonthly}</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                        {plan.priceYearly && (
                          <p className="text-sm text-muted-foreground">
                            or ${plan.priceYearly}/year
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="text-2xl font-bold">Contact for pricing</div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {plan.page_limit ? `${plan.page_limit} pages` : 'Unlimited pages'}
                      {plan.revision_limit ? ` • ${plan.revision_limit} revisions/mo` : ''}
                    </p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    {features
                      .filter((feature) => feature.included)
                      .slice(0, 5)
                      .map((feature) => (
                        <div key={feature.name} className="flex items-start gap-3">
                          <span className="mt-1 text-primary" aria-hidden="true">
                            <Check className="size-4" />
                          </span>
                          <div>
                            <p className="text-sm font-medium text-foreground">{feature.name}</p>
                            {feature.description ? (
                              <p className="text-sm text-muted-foreground">{feature.description}</p>
                            ) : null}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant={isPopular ? 'default' : 'outline'}>
                  <Link className="block w-full" href={ROUTES.PRICING}>
                    Get Started
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
      <div className="text-center">
        <Button asChild variant="outline" size="lg">
          <Link href={ROUTES.PRICING}>View All Plans</Link>
        </Button>
      </div>
    </section>
  )
}
