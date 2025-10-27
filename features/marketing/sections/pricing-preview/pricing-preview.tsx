import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
    <section className="w-full max-w-7xl mx-auto">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Simple, Transparent Pricing
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your business. All plans include hosting,
          support, and maintenance.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan, index) => {
          const features = Array.isArray(plan.features)
            ? (plan.features as PlanFeature[])
            : []
          const isPopular = index === 1 // Mark second plan (Business) as popular

          return (
            <Card
              key={plan.id}
              className={isPopular ? 'border-primary shadow-lg' : ''}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {isPopular && <Badge variant="default">Popular</Badge>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                <ul className="space-y-2">
                  {features
                    .filter((f) => f.included)
                    .slice(0, 5)
                    .map((feature) => (
                      <li key={feature.name} className="flex items-start gap-2">
                        <span className="text-primary mt-1">✓</span>
                        <span className="text-sm">{feature.name}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full"
                  variant={isPopular ? 'default' : 'outline'}
                >
                  <Link href={ROUTES.PRICING}>Get Started</Link>
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
