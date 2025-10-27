import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { ClientProfile } from '../api/queries'

interface ClientDetailCardProps {
  client: ClientProfile
}

export function ClientDetailCard({ client }: ClientDetailCardProps) {
  const joinedDate = new Date(client.created_at)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="h-full">
        <CardHeader>
        <CardTitle>Client Information</CardTitle>
        <CardDescription>Basic details about the client</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-1 text-sm text-muted-foreground">Contact Name</div>
          <div className="font-medium">{client.contact_name || 'Not provided'}</div>
        </div>

        <Separator />

        <div>
          <div className="mb-1 text-sm text-muted-foreground">Email</div>
          <div className="font-medium">{client.contact_email}</div>
        </div>

        <Separator />

        <div>
          <div className="mb-1 text-sm text-muted-foreground">Company</div>
          <div className="font-medium">{client.company_name || 'Not provided'}</div>
        </div>

        <Separator />

        <div>
          <div className="mb-1 text-sm text-muted-foreground">Phone</div>
          <div className="font-medium">{client.contact_phone || 'Not provided'}</div>
        </div>

        <Separator />

        <div>
          <div className="mb-1 text-sm text-muted-foreground">Joined</div>
          <div className="font-medium">
            {joinedDate.toLocaleDateString()} at{' '}
            {joinedDate.toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="h-full">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Current subscription details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {client.subscription ? (
            <>
              <div>
                <div className="mb-1 text-sm text-muted-foreground">Plan</div>
                <div className="font-medium">{client.subscription.plan.name}</div>
              </div>

              <Separator />

              <div>
                <div className="mb-1 text-sm text-muted-foreground">Status</div>
                <Badge
                  variant={
                    client.subscription.status === 'active'
                      ? 'default'
                      : client.subscription.status === 'past_due'
                        ? 'destructive'
                        : 'secondary'
                  }
                >
                  {client.subscription.status}
                </Badge>
              </div>

              <Separator />

              {client.subscription.current_period_start && client.subscription.current_period_end && (
                <div>
                  <div className="mb-1 text-sm text-muted-foreground">Current Period</div>
                  <div className="font-medium">
                    {new Date(
                      client.subscription.current_period_start
                    ).toLocaleDateString()}{' '}
                    -{' '}
                    {new Date(
                      client.subscription.current_period_end
                    ).toLocaleDateString()}
                  </div>
                </div>
              )}

              <Separator />

              {client.stripe_customer_id && (
                <>
                  <Separator />
                  <div>
                    <div className="mb-1 text-sm text-muted-foreground">Stripe Customer</div>
                    <div className="font-mono text-xs">
                      {client.stripe_customer_id}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-muted-foreground">No active subscription</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
