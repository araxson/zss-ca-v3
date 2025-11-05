import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import {
  Item,
  ItemActions,
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

export function SubscriptionCard({ subscription }: SubscriptionCardProps): React.JSX.Element {
  const plan = subscription.plan
  const currentPeriodEnd = subscription.current_period_end ? new Date(subscription.current_period_end) : null
  const isActive = subscription.status === 'active'
  const isPastDue = subscription.status === 'past_due'

  // Temporary: Price should come from Stripe
  const monthlyPrice = plan.setup_fee_cents ? plan.setup_fee_cents / 100 : 0
  const yearlyPrice = monthlyPrice * 12

  return (
    <Item variant="outline">
      <ItemContent className="basis-full">
        <div className="space-y-6 p-6">
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>{plan.name} Plan</ItemTitle>
              <ItemDescription>{plan.description}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant={isActive ? 'default' : isPastDue ? 'destructive' : 'secondary'}>
                {subscription.status}
              </Badge>
            </ItemActions>
          </Item>

          <FieldSet className="space-y-4">
            <FieldLegend>Billing details</FieldLegend>
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
                        <Check className="size-4 text-muted-foreground" aria-hidden="true" />
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
                        <Check className="size-4 text-muted-foreground" aria-hidden="true" />
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
          </FieldSet>

          {isPastDue && (
            <Alert variant="destructive" aria-live="assertive">
              <AlertTitle>Payment Failed</AlertTitle>
              <AlertDescription>
                Please update your payment method to continue your subscription.
              </AlertDescription>
            </Alert>
          )}

          <ManageSubscriptionButtons subscriptionId={subscription.id} />
        </div>
      </ItemContent>
    </Item>
  )
}
