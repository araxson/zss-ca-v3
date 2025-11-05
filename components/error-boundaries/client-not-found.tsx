'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Item, ItemContent, ItemGroup, ItemTitle } from '@/components/ui/item'
import { SearchX } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'

export function ClientNotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Empty className="w-full max-w-xl border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchX className="size-6" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>404 - Page Not Found</EmptyTitle>
          <EmptyDescription>
            The page you are looking for does not exist in your client portal.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="w-full space-y-4">
          <div className="flex w-full flex-col gap-2">
            <Button asChild className="w-full">
              <Link href={ROUTES.CLIENT_DASHBOARD}>Back to Dashboard</Link>
            </Button>
          </div>
          <ItemGroup className="grid w-full gap-2 sm:grid-cols-2">
            <Item asChild variant="outline" size="sm">
              <Link href={ROUTES.CLIENT_SUBSCRIPTION}>
                <ItemContent className="flex-1">
                  <ItemTitle>Subscription</ItemTitle>
                </ItemContent>
              </Link>
            </Item>
            <Item asChild variant="outline" size="sm">
              <Link href={ROUTES.CLIENT_SITES}>
                <ItemContent className="flex-1">
                  <ItemTitle>My Sites</ItemTitle>
                </ItemContent>
              </Link>
            </Item>
            <Item asChild variant="outline" size="sm">
              <Link href={ROUTES.CLIENT_SUPPORT}>
                <ItemContent className="flex-1">
                  <ItemTitle>Support</ItemTitle>
                </ItemContent>
              </Link>
            </Item>
            <Item asChild variant="outline" size="sm">
              <Link href={ROUTES.CLIENT_PROFILE}>
                <ItemContent className="flex-1">
                  <ItemTitle>Profile</ItemTitle>
                </ItemContent>
              </Link>
            </Item>
          </ItemGroup>
        </EmptyContent>
      </Empty>
    </div>
  )
}
