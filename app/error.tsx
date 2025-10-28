'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Empty className="w-full max-w-md border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CircleAlert className="h-6 w-6" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>Something went wrong</EmptyTitle>
          <EmptyDescription>
            An unexpected error occurred. We apologize for the inconvenience.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="w-full space-y-4">
          {process.env.NODE_ENV === 'development' && (
            <Alert variant="destructive">
              <AlertTitle>Error Details (Development Only)</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {error.digest && (
            <Alert>
              <AlertTitle>Error Reference</AlertTitle>
              <AlertDescription>{error.digest}</AlertDescription>
            </Alert>
          )}

          <ButtonGroup orientation="vertical" className="w-full gap-2">
            <Button onClick={reset} className="w-full">
              Try Again
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href={ROUTES.HOME}>Go Home</Link>
            </Button>
          </ButtonGroup>
        </EmptyContent>
      </Empty>
    </div>
  )
}
