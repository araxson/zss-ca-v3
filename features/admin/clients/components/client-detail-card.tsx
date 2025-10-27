import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
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
        <CardContent>
          <FieldGroup className="space-y-4">
            <Field>
              <FieldLabel>Contact Name</FieldLabel>
              <p className="text-sm font-medium">
                {client.contact_name || 'Not provided'}
              </p>
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <p className="text-sm text-muted-foreground">{client.contact_email}</p>
            </Field>
            <Field>
              <FieldLabel>Company</FieldLabel>
              <p className="text-sm font-medium">
                {client.company_name || 'Not provided'}
              </p>
            </Field>
            <Field>
              <FieldLabel>Phone</FieldLabel>
              <p className="text-sm font-medium">
                {client.contact_phone || 'Not provided'}
              </p>
            </Field>
            <Field>
              <FieldLabel>Joined</FieldLabel>
              <FieldDescription>
                {joinedDate.toLocaleDateString()} at {joinedDate.toLocaleTimeString()}
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card className="h-full">
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Current subscription details</CardDescription>
        </CardHeader>
        <CardContent>
          {client.subscription ? (
            <FieldGroup className="space-y-4">
              <Field>
                <FieldLabel>Plan</FieldLabel>
                <p className="text-sm font-medium">
                  {client.subscription.plan.name}
                </p>
              </Field>
              <Field className="flex items-center justify-between">
                <FieldLabel>Status</FieldLabel>
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
              </Field>

              {client.subscription.current_period_start && client.subscription.current_period_end && (
                <Field>
                  <FieldLabel>Current Period</FieldLabel>
                  <FieldDescription>
                    {new Date(
                      client.subscription.current_period_start
                    ).toLocaleDateString()} –{' '}
                    {new Date(
                      client.subscription.current_period_end
                    ).toLocaleDateString()}
                  </FieldDescription>
                </Field>
              )}

              {client.stripe_customer_id && (
                <Field>
                  <FieldLabel>Stripe Customer</FieldLabel>
                  <p className="font-mono text-xs">
                    {client.stripe_customer_id}
                  </p>
                </Field>
              )}
            </FieldGroup>
          ) : (
            <Empty className="border border-dashed py-6">
              <EmptyHeader>
                <EmptyTitle>No active subscription</EmptyTitle>
                <EmptyDescription>
                  Assign a plan to unlock billing, analytics, and deployment workflows.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
