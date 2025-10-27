import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getCurrentSubscription } from '@/features/shared/subscription/api/queries'
import { SubscriptionCard } from '@/features/shared/subscription/components/subscription-card'

export default async function SubscriptionPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(ROUTES.LOGIN)
  }

  const subscription = await getCurrentSubscription(user.id)

  if (!subscription) {
    return (
      <div className="space-y-6">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Manage your subscription plan</CardDescription>
          </CardHeader>
        </Card>

        <Alert>
          <AlertTitle>No Active Subscription</AlertTitle>
          <AlertDescription>
            You don&apos;t have an active subscription yet. Choose a plan to get started.
          </AlertDescription>
        </Alert>

        <Button asChild>
          <Link href="/pricing">View Plans</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Manage your subscription plan</CardDescription>
        </CardHeader>
      </Card>

      <SubscriptionCard subscription={subscription} />
    </div>
  )
}
