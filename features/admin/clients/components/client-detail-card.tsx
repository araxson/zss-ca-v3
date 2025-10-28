import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import type { ClientProfile } from '../api/queries'

interface ClientDetailCardProps {
  client: ClientProfile
}

export function ClientDetailCard({ client }: ClientDetailCardProps) {
  const joinedDate = new Date(client.created_at)
  const subscription = client.subscription
  const joinedRelative = formatDistanceToNow(joinedDate, { addSuffix: true })

  return (
    <ItemGroup className="grid gap-6 md:grid-cols-2">
      <Item variant="outline" className="flex flex-col gap-4 p-6">
        <ItemHeader className="flex flex-col gap-1">
          <ItemTitle>Client Information</ItemTitle>
          <ItemDescription>Basic details about the client</ItemDescription>
        </ItemHeader>
        <ItemGroup className="space-y-3">
          <Item variant="muted" size="sm" className="flex flex-col gap-1">
            <ItemTitle className="text-sm font-medium text-foreground">
              Contact Name
            </ItemTitle>
            <ItemDescription className="text-sm text-muted-foreground">
              {client.contact_name || 'Not provided'}
            </ItemDescription>
          </Item>
          <Item variant="muted" size="sm" className="flex flex-col gap-1">
            <ItemTitle className="text-sm font-medium text-foreground">Email</ItemTitle>
            <ItemDescription className="text-sm text-muted-foreground">
              {client.contact_email ? (
                <a className="hover:text-primary" href={`mailto:${client.contact_email}`}>
                  {client.contact_email}
                </a>
              ) : (
                'Not provided'
              )}
            </ItemDescription>
          </Item>
          <Item variant="muted" size="sm" className="flex flex-col gap-1">
            <ItemTitle className="text-sm font-medium text-foreground">Company</ItemTitle>
            <ItemDescription className="text-sm text-muted-foreground">
              {client.company_name || 'Not provided'}
            </ItemDescription>
          </Item>
          <Item variant="muted" size="sm" className="flex flex-col gap-1">
            <ItemTitle className="text-sm font-medium text-foreground">Phone</ItemTitle>
            <ItemDescription className="text-sm text-muted-foreground">
              {client.contact_phone ? (
                <a className="hover:text-primary" href={`tel:${client.contact_phone}`}>
                  {client.contact_phone}
                </a>
              ) : (
                'Not provided'
              )}
            </ItemDescription>
          </Item>
          <Item variant="muted" size="sm" className="flex flex-col gap-1">
            <ItemTitle className="text-sm font-medium text-foreground">Joined</ItemTitle>
            <ItemDescription className="text-sm text-muted-foreground">
              {joinedDate.toLocaleDateString()} at {joinedDate.toLocaleTimeString()}
            </ItemDescription>
            <ItemDescription className="text-xs text-muted-foreground">
              {joinedRelative}
            </ItemDescription>
          </Item>
        </ItemGroup>
      </Item>

      <Item variant="outline" className="flex flex-col gap-4 p-6">
        <ItemHeader className="flex flex-col gap-1">
          <ItemTitle>Subscription</ItemTitle>
          <ItemDescription>Current subscription details</ItemDescription>
        </ItemHeader>
        {subscription ? (
          <ItemGroup className="space-y-3">
            <Item variant="muted" size="sm" className="flex flex-col gap-1">
              <ItemTitle className="text-sm font-medium text-foreground">Plan</ItemTitle>
              <ItemDescription className="text-sm text-muted-foreground">
                {subscription.plan?.name ?? 'Unassigned'}
              </ItemDescription>
            </Item>
            <Item
              variant="muted"
              size="sm"
              className="flex items-center justify-between gap-3"
            >
              <ItemTitle className="text-sm font-medium text-foreground">Status</ItemTitle>
              <Badge
                variant={
                  subscription.status === 'active'
                    ? 'default'
                    : subscription.status === 'past_due'
                      ? 'destructive'
                      : 'secondary'
                }
              >
                {subscription.status}
              </Badge>
            </Item>
            {subscription.current_period_start && subscription.current_period_end ? (
              <Item variant="muted" size="sm" className="flex flex-col gap-1">
                <ItemTitle className="text-sm font-medium text-foreground">
                  Current Period
                </ItemTitle>
                <ItemDescription className="text-sm text-muted-foreground">
                  {new Date(subscription.current_period_start).toLocaleDateString()} –{' '}
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </ItemDescription>
              </Item>
            ) : null}
            {client.stripe_customer_id ? (
              <Item variant="muted" size="sm" className="flex flex-col gap-1">
                <ItemTitle className="text-sm font-medium text-foreground">
                  Stripe Customer
                </ItemTitle>
                <ItemDescription className="font-mono text-xs text-muted-foreground">
                  {client.stripe_customer_id}
                </ItemDescription>
              </Item>
            ) : null}
          </ItemGroup>
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
      </Item>
    </ItemGroup>
  )
}
