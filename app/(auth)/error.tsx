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
import { LockKeyhole } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AuthError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Authentication error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Empty className="w-full max-w-md border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LockKeyhole className="size-6" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>Authentication Error</EmptyTitle>
          <EmptyDescription>
            An error occurred during the authentication process. Please try again.
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
              <Link href={ROUTES.LOGIN}>Back to Login</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href={ROUTES.HOME}>Go Home</Link>
            </Button>
          </ButtonGroup>
        </EmptyContent>
      </Empty>
    </div>
  )
}
