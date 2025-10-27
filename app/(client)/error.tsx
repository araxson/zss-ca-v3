'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ROUTES } from '@/lib/constants/routes'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ClientError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Client portal error:', error)
  }, [error])

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>
            We encountered an error while loading your dashboard. Please try again or contact support if the issue persists.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error.digest && (
            <Alert>
              <AlertTitle>Error Reference ID</AlertTitle>
              <AlertDescription>
                Share this ID with support: {error.digest}
              </AlertDescription>
            </Alert>
          )}

          {process.env.NODE_ENV === 'development' && (
            <Alert variant="destructive">
              <AlertTitle>Error Details (Development Only)</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={reset} className="flex-1">
              Try Again
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href={ROUTES.CLIENT_DASHBOARD}>
                Dashboard
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href={ROUTES.CLIENT_SUBSCRIPTION}>
                Subscription
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href={ROUTES.CLIENT_SITES}>
                My Sites
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href={ROUTES.CLIENT_SUPPORT}>
                Support
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href={ROUTES.CLIENT_PROFILE}>
                Profile
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
