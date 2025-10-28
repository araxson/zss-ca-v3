'use client'

import { Spinner } from '@/components/ui/spinner'
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

export default function AdminDashboardLoading() {
  return (
    <main className="flex min-h-[50vh] items-center justify-center">
      <Item variant="muted">
        <ItemMedia>
          <Spinner />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Loading admin dashboard...</ItemTitle>
        </ItemContent>
      </Item>
    </main>
  )
}
