import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { ManageSubscriptionButtons } from './manage-subscription-buttons'
import type { SubscriptionWithPlan } from '../api/queries'
import { Check } from 'lucide-react'

interface SubscriptionCardProps {
  subscription: SubscriptionWithPlan
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const plan = subscription.plan
  const currentPeriodEnd = subscription.current_period_end ? new Date(subscription.current_period_end) : null
  const isActive = subscription.status === 'active'
  const isPastDue = subscription.status === 'past_due'

  // Temporary: Price should come from Stripe
  const monthlyPrice = plan.setup_fee_cents ? plan.setup_fee_cents / 100 : 0
  const yearlyPrice = monthlyPrice * 12

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <CardTitle>{plan.name} Plan</CardTitle>
          <CardDescription>{plan.description}</CardDescription>
        </div>
        <Badge className="w-fit" variant={isActive ? 'default' : isPastDue ? 'destructive' : 'secondary'}>
          {subscription.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldGroup className="space-y-4">
          {currentPeriodEnd && (
            <>
              <Field>
                <FieldLabel>Current Period</FieldLabel>
                <FieldDescription>
                  Renews on {currentPeriodEnd.toLocaleDateString()}
                </FieldDescription>
              </Field>
              <Separator />
            </>
          )}

          <Field>
            <FieldLabel>Plan Features</FieldLabel>
            <FieldDescription>
              <div className="space-y-2">
                <Item variant="outline" size="sm">
                  <ItemMedia>
                    <Check className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>
                      {plan.page_limit ? `${plan.page_limit} pages` : 'Unlimited pages'}
                    </ItemTitle>
                    <ItemDescription>Page allotment included in this plan</ItemDescription>
                  </ItemContent>
                </Item>
                <Item variant="outline" size="sm">
                  <ItemMedia>
                    <Check className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>
                      {plan.revision_limit
                        ? `${plan.revision_limit} revisions/month`
                        : 'Unlimited revisions'}
                    </ItemTitle>
                    <ItemDescription>Revision capacity per billing cycle</ItemDescription>
                  </ItemContent>
                </Item>
              </div>
            </FieldDescription>
          </Field>

          <Separator />

          <Field>
            <FieldLabel>Pricing</FieldLabel>
            <p className="font-medium">
              ${monthlyPrice}/month or ${yearlyPrice}/year
            </p>
          </Field>
        </FieldGroup>

        {isPastDue && (
          <Alert variant="destructive">
            <AlertTitle>Payment Failed</AlertTitle>
            <AlertDescription>
              Please update your payment method to continue your subscription.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <ManageSubscriptionButtons subscriptionId={subscription.id} />
      </CardFooter>
    </Card>
  )
}
