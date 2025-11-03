'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from '@/components/ui/item'
import { ROUTES } from '@/lib/constants/routes'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

interface DashboardTicketsStatsProps {
  totalTickets: number
  openTicketsCount: number
}

export function DashboardTicketsStats({
  totalTickets,
  openTicketsCount,
}: DashboardTicketsStatsProps) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>Support Summary</ItemTitle>
        <ItemDescription>Your support request overview</ItemDescription>
      </ItemContent>
      <ItemContent className="gap-0">
        <FieldGroup className="gap-0">
          <Field
            orientation="responsive"
            className="border-t border-border py-3 first:border-t-0 first:pt-0 last:pb-0"
          >
            <FieldLabel>Total Tickets</FieldLabel>
            <FieldContent className="flex-row items-start justify-between gap-3">
              <FieldDescription>All support requests</FieldDescription>
              <Badge variant="secondary" className="shrink-0">
                {totalTickets}
              </Badge>
            </FieldContent>
          </Field>
          <Field
            orientation="responsive"
            className="border-t border-border py-3 first:border-t-0 first:pt-0 last:pb-0"
          >
            <FieldLabel>Open Tickets</FieldLabel>
            <FieldContent className="flex-row items-start justify-between gap-3">
              <FieldDescription>Awaiting response</FieldDescription>
              <Badge variant={openTicketsCount > 0 ? 'destructive' : 'secondary'} className="shrink-0">
                {openTicketsCount}
              </Badge>
            </FieldContent>
          </Field>
        </FieldGroup>
      </ItemContent>
      <ItemFooter>
        <Button asChild>
          <Link href={ROUTES.CLIENT_SUPPORT}>View All Tickets</Link>
        </Button>
      </ItemFooter>
    </Item>
  )
}
