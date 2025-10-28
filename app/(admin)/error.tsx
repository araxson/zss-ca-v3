'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { ShieldAlert } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AdminError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Admin portal error:', error)
  }, [error])

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Empty className="w-full max-w-xl border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ShieldAlert className="h-6 w-6" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>Error in Admin Portal</EmptyTitle>
          <EmptyDescription>
            An error occurred while processing your request. This has been logged for review.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="w-full space-y-4">
          {error.digest && (
            <Alert>
              <AlertTitle>Error Reference ID</AlertTitle>
              <AlertDescription>{error.digest}</AlertDescription>
            </Alert>
          )}

          {process.env.NODE_ENV === 'development' && (
            <Alert variant="destructive">
              <AlertTitle>Error Details (Development Only)</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <ButtonGroup className="flex w-full flex-col gap-2 sm:flex-row">
            <Button onClick={reset} className="w-full sm:flex-1">
              Try Again
            </Button>
            <Button asChild variant="outline" className="w-full sm:flex-1">
              <Link href={ROUTES.ADMIN_DASHBOARD}>Dashboard</Link>
            </Button>
          </ButtonGroup>

          <ItemGroup className="grid w-full gap-2 sm:grid-cols-2">
            <Item asChild variant="outline" size="sm">
              <Link href={ROUTES.ADMIN_CLIENTS}>
                <ItemContent className="flex-1">
                  <ItemTitle>Clients</ItemTitle>
                </ItemContent>
              </Link>
            </Item>
            <Item asChild variant="outline" size="sm">
              <Link href={ROUTES.ADMIN_SITES}>
                <ItemContent className="flex-1">
                  <ItemTitle>Sites</ItemTitle>
                </ItemContent>
              </Link>
            </Item>
            <Item asChild variant="outline" size="sm">
              <Link href={ROUTES.ADMIN_SUPPORT}>
                <ItemContent className="flex-1">
                  <ItemTitle>Support</ItemTitle>
                </ItemContent>
              </Link>
            </Item>
            <Item asChild variant="outline" size="sm">
              <Link href={ROUTES.ADMIN_AUDIT_LOGS}>
                <ItemContent className="flex-1">
                  <ItemTitle>Audit Logs</ItemTitle>
                </ItemContent>
              </Link>
            </Item>
          </ItemGroup>
        </EmptyContent>
      </Empty>
    </div>
  )
}
