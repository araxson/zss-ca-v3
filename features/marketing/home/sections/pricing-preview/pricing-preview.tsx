import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Separator } from '@/components/ui/separator'
import { SectionHeader } from '@/features/shared/components'
import { ROUTES } from '@/lib/constants/routes'
import { getPlansForPreview } from './api/queries'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

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
    <section className="w-full max-w-7xl mx-auto">
      <SectionHeader
        title="Simple, Transparent Pricing"
        description="Choose the plan that fits your business. All plans include hosting, support, and maintenance."
        align="center"
        className="mb-12"
      />
      <ItemGroup className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
        {plans.map((plan, index) => {
          const features = Array.isArray(plan.features)
            ? (plan.features as PlanFeature[])
            : []
          const isPopular = index === 1 // Mark second plan (Business) as popular

          return (
            <Item
              key={plan.id}
              variant="outline"
              className={cn(
                'flex flex-col',
                isPopular && 'border-primary shadow-lg'
              )}
            >
              <ItemHeader className="gap-2">
                <div className="flex items-center justify-between">
                  <ItemTitle>{plan.name}</ItemTitle>
                  {isPopular && <Badge variant="default">Popular</Badge>}
                </div>
                <ItemDescription>{plan.description}</ItemDescription>
              </ItemHeader>
              <ItemContent className="space-y-4">
                <div>
                  {plan.priceMonthly ? (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold">
                          ${plan.priceMonthly}
                        </span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      {plan.priceYearly && (
                        <p className="text-sm text-muted-foreground mt-1">
                          or ${plan.priceYearly}/year
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="text-2xl font-bold">Contact for pricing</div>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    {plan.page_limit ? `${plan.page_limit} pages` : 'Unlimited pages'}
                    {plan.revision_limit &&
                      ` • ${plan.revision_limit} revisions/mo`}
                  </p>
                </div>
                <Separator />
                <ItemGroup className="space-y-2">
                  {features
                    .filter((f) => f.included)
                    .slice(0, 5)
                    .map((feature) => (
                      <Item
                        key={feature.name}
                        variant="muted"
                        size="sm"
                        className="items-start gap-3"
                      >
                        <ItemMedia variant="icon">
                          <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>{feature.name}</ItemTitle>
                        </ItemContent>
                      </Item>
                    ))}
                </ItemGroup>
              </ItemContent>
              <ItemFooter>
                <Button
                  asChild
                  className="w-full"
                  variant={isPopular ? 'default' : 'outline'}
                >
                  <Link href={ROUTES.PRICING}>Get Started</Link>
                </Button>
              </ItemFooter>
            </Item>
          )
        })}
      </ItemGroup>
      <div className="text-center">
        <Button asChild variant="outline" size="lg">
          <Link href={ROUTES.PRICING}>View All Plans</Link>
        </Button>
      </div>
    </section>
  )
}
