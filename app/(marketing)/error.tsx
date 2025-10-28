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
import { CircleAlert } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function MarketingError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Marketing page error:', error)
  }, [error])

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center p-4">
      <Empty className="w-full max-w-xl border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CircleAlert className="size-6" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>Oops! Something went wrong</EmptyTitle>
          <EmptyDescription>
            We encountered an error while loading this page. Please try again.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="w-full space-y-4">
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
              <Link href={ROUTES.HOME}>Go Home</Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:flex-1">
              <Link href={ROUTES.CONTACT}>Contact Us</Link>
            </Button>
          </ButtonGroup>
        </EmptyContent>
      </Empty>
    </div>
  )
}
