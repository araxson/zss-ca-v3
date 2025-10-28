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
      <ItemContent className="space-y-3">
        <div className="flex items-center justify-between border-t pt-3">
          <div>
            <div className="font-medium">Total Tickets</div>
            <div className="text-sm text-muted-foreground">All support requests</div>
          </div>
          <Badge variant="secondary">{totalTickets}</Badge>
        </div>
        <div className="flex items-center justify-between border-t pt-3">
          <div>
            <div className="font-medium">Open Tickets</div>
            <div className="text-sm text-muted-foreground">Awaiting response</div>
          </div>
          <Badge variant={openTicketsCount > 0 ? 'destructive' : 'secondary'}>
            {openTicketsCount}
          </Badge>
        </div>
      </ItemContent>
      <ItemFooter>
        <Button asChild>
          <Link href={ROUTES.CLIENT_SUPPORT}>View All Tickets</Link>
        </Button>
      </ItemFooter>
    </Item>
  )
}
