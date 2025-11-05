'use client'

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
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import type { ClientProfile } from '../api/queries'

interface ClientDetailCardProps {
  client: ClientProfile
}

export function ClientDetailCard({ client }: ClientDetailCardProps): React.JSX.Element {
  const joinedDate = new Date(client.created_at)
  const subscription = client.subscription
  const joinedRelative = formatDistanceToNow(joinedDate, { addSuffix: true })

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Client Information</ItemTitle>
          <ItemDescription>Basic details about the client</ItemDescription>
        </ItemContent>
        <ItemContent>
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemContent>
                <ItemTitle>Contact Name</ItemTitle>
                <ItemDescription>{client.contact_name || 'Not provided'}</ItemDescription>
              </ItemContent>
            </Item>
            <Item variant="muted" size="sm">
              <ItemContent>
                <ItemTitle>Email</ItemTitle>
                <ItemDescription>
                  {client.contact_email ? (
                    <a
                      href={`mailto:${client.contact_email}`}
                      aria-label={`Email ${client.contact_name || client.company_name || 'client'}`}
                    >
                      {client.contact_email}
                    </a>
                  ) : (
                    'Not provided'
                  )}
                </ItemDescription>
              </ItemContent>
            </Item>
            <Item variant="muted" size="sm">
              <ItemContent>
                <ItemTitle>Company</ItemTitle>
                <ItemDescription>{client.company_name || 'Not provided'}</ItemDescription>
              </ItemContent>
            </Item>
            <Item variant="muted" size="sm">
              <ItemContent>
                <ItemTitle>Phone</ItemTitle>
                <ItemDescription>
                  {client.contact_phone ? (
                    <a
                      href={`tel:${client.contact_phone}`}
                      aria-label={`Call ${client.contact_name || client.company_name || 'client'}`}
                    >
                      {client.contact_phone}
                    </a>
                  ) : (
                    'Not provided'
                  )}
                </ItemDescription>
              </ItemContent>
            </Item>
            <Item variant="muted" size="sm">
              <ItemContent>
                <ItemTitle>Joined</ItemTitle>
                <ItemDescription>
                  {joinedDate.toLocaleDateString()} at {joinedDate.toLocaleTimeString()}
                </ItemDescription>
                <ItemDescription>{joinedRelative}</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
        </ItemContent>
      </Item>

      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Subscription</ItemTitle>
          <ItemDescription>Current subscription details</ItemDescription>
        </ItemContent>
        {subscription ? (
          <ItemContent>
            <ItemGroup>
              <Item variant="muted" size="sm">
                <ItemContent>
                  <ItemTitle>Plan</ItemTitle>
                  <ItemDescription>{subscription.plan?.name ?? 'Unassigned'}</ItemDescription>
                </ItemContent>
              </Item>
              <Item variant="muted" size="sm">
                <ItemContent>
                  <ItemTitle>Status</ItemTitle>
                </ItemContent>
                <ItemActions>
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
                </ItemActions>
              </Item>
              {subscription.current_period_start && subscription.current_period_end ? (
                <Item variant="muted" size="sm">
                  <ItemContent>
                    <ItemTitle>Current Period</ItemTitle>
                    <ItemDescription>
                      {new Date(subscription.current_period_start).toLocaleDateString()} –{' '}
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </ItemDescription>
                  </ItemContent>
                </Item>
              ) : null}
              {client.stripe_customer_id ? (
                <Item variant="muted" size="sm">
                  <ItemContent>
                    <ItemTitle>Stripe Customer</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <Badge variant="outline">{client.stripe_customer_id}</Badge>
                  </ItemActions>
                </Item>
              ) : null}
            </ItemGroup>
          </ItemContent>
        ) : (
          <ItemContent>
            <Empty className="border border-dashed py-6">
              <EmptyHeader>
                <EmptyTitle>No active subscription</EmptyTitle>
                <EmptyDescription>
                  Assign a plan to unlock billing, analytics, and deployment workflows.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </ItemContent>
        )}
      </Item>
    </div>
  )
}
