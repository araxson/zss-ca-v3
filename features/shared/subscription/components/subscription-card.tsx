import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ManageSubscriptionButtons } from './manage-subscription-buttons'
import type { SubscriptionWithPlan } from '../api/queries'

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
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{plan.name} Plan</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </div>
          <Badge variant={isActive ? 'default' : isPastDue ? 'destructive' : 'secondary'}>
            {subscription.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentPeriodEnd && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Current Period</p>
            <p className="font-medium">
              Renews on {currentPeriodEnd.toLocaleDateString()}
            </p>
          </div>
        )}

        <div>
          <p className="text-sm text-muted-foreground mb-1">Plan Features</p>
          <ul className="space-y-1 text-sm">
            <li>
              {plan.page_limit ? `${plan.page_limit} pages` : 'Unlimited pages'}
            </li>
            <li>
              {plan.revision_limit
                ? `${plan.revision_limit} revisions/month`
                : 'Unlimited revisions'}
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-1">Pricing</p>
          <p className="font-medium">
            ${monthlyPrice}/month or ${yearlyPrice}/year
          </p>
        </div>

        {isPastDue && (
          <div className="bg-destructive/10 p-3 rounded-md">
            <p className="text-sm text-destructive font-medium">
              Payment Failed
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Please update your payment method to continue your subscription.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <ManageSubscriptionButtons subscriptionId={subscription.id} />
      </CardFooter>
    </Card>
  )
}
