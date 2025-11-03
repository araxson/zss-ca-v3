import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Separator } from '@/components/ui/separator'
import { ROUTES } from '@/lib/constants/routes'
import { getPlansForPreview } from '@/features/marketing/pricing/api/queries'

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
    <ItemGroup className="mx-auto w-full max-w-7xl gap-16">
      <Item className="flex w-full flex-col items-center border-0 p-0 text-center">
        <ItemContent className="max-w-3xl items-center gap-3 text-center">
          <ItemTitle className="justify-center">
            <span className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Simple, Transparent Pricing
            </span>
          </ItemTitle>
          <ItemDescription className="text-base text-muted-foreground sm:text-lg">
            Choose the plan that fits your business. All plans include hosting, support, and
            maintenance.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item className="w-full flex-col">
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
                <CardContent className="space-y-4">
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
                  <ItemGroup className="gap-2">
                    {features
                      .filter((feature) => feature.included)
                      .slice(0, 5)
                      .map((feature) => (
                        <Item key={feature.name} className="items-start gap-3 p-3">
                          <ItemMedia variant="icon" aria-hidden="true">
                            <Check className="size-4 text-primary" aria-hidden="true" />
                          </ItemMedia>
                          <ItemContent className="gap-1">
                            <ItemTitle className="text-sm font-medium text-foreground">
                              {feature.name}
                            </ItemTitle>
                            {feature.description ? (
                              <ItemDescription className="line-clamp-none text-xs text-muted-foreground">
                                {feature.description}
                              </ItemDescription>
                            ) : null}
                          </ItemContent>
                        </Item>
                      ))}
                  </ItemGroup>
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
      </Item>
      <Item className="justify-center">
        <Button asChild variant="outline" size="lg">
          <Link href={ROUTES.PRICING}>View All Plans</Link>
        </Button>
      </Item>
    </ItemGroup>
  )
}
