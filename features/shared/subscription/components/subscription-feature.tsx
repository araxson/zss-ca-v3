import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ROUTES } from '@/lib/constants/routes'
import { Button } from '@/components/ui/button'
import { getCurrentSubscription } from '@/features/shared/subscription/api/queries'
import { SubscriptionCard } from '@/features/shared/subscription'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { SectionHeader } from '@/features/shared/components'
import { CreditCard } from 'lucide-react'

export async function SubscriptionFeature() {
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
        <SectionHeader
          title="Subscription"
          description="Manage your subscription plan"
          align="start"
        />

        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CreditCard className="size-6" aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>No Active Subscription</EmptyTitle>
            <EmptyDescription>
              You don&apos;t have an active subscription yet. Choose a plan to get started.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/pricing">View Plans</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Subscription"
        description="Manage your subscription plan"
        align="start"
      />

      <SubscriptionCard subscription={subscription} />
    </div>
  )
}
