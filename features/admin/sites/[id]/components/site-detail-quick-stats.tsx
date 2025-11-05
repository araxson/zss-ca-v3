'use client'

import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Calendar, User, Package, Globe } from 'lucide-react'

interface QuickStatsProps {
  daysSinceCreated: number
  clientName: string
  planName: string | null
  status: string
  getStatusVariant: (status: string) => 'default' | 'secondary' | 'outline' | 'destructive'
  formatStatus: (status: string) => string
}

export function SiteDetailQuickStats({
  daysSinceCreated,
  clientName,
  planName,
  status,
  getStatusVariant,
  formatStatus,
}: QuickStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Item variant="outline">
        <ItemMedia>
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Calendar className="size-5 text-primary" aria-hidden="true" />
          </div>
        </ItemMedia>
        <ItemContent>
          <ItemDescription>Site Age</ItemDescription>
          <ItemTitle>
            <span className="text-xl">{daysSinceCreated} days</span>
          </ItemTitle>
        </ItemContent>
      </Item>

      <Item variant="outline">
        <ItemMedia>
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
            <User className="size-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          </div>
        </ItemMedia>
        <ItemContent className="min-w-0">
          <ItemDescription>Client</ItemDescription>
          <ItemTitle>
            <span className="truncate text-base">{clientName}</span>
          </ItemTitle>
        </ItemContent>
      </Item>

      <Item variant="outline">
        <ItemMedia>
          <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10 dark:bg-purple-500/20">
            <Package className="size-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
          </div>
        </ItemMedia>
        <ItemContent className="min-w-0">
          <ItemDescription>Plan</ItemDescription>
          <ItemTitle>
            <span className="truncate text-base">{planName || 'No plan'}</span>
          </ItemTitle>
        </ItemContent>
      </Item>

      <Item variant="outline">
        <ItemMedia>
          <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10 dark:bg-green-500/20">
            <Globe className="size-5 text-green-600 dark:text-green-400" aria-hidden="true" />
          </div>
        </ItemMedia>
        <ItemContent>
          <ItemDescription>Status</ItemDescription>
          <Badge variant={getStatusVariant(status)} className="mt-1">
            {formatStatus(status)}
          </Badge>
        </ItemContent>
      </Item>
    </div>
  )
}
