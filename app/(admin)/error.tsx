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

export default function AdminError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Admin portal error:', error)
  }, [error])

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Error in Admin Portal</CardTitle>
          <CardDescription>
            An error occurred while processing your request. This has been logged for review.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={reset} className="flex-1">
              Try Again
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href={ROUTES.ADMIN_DASHBOARD}>
                Dashboard
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href={ROUTES.ADMIN_CLIENTS}>
                Clients
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href={ROUTES.ADMIN_SITES}>
                Sites
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href={ROUTES.ADMIN_SUPPORT}>
                Support
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href={ROUTES.ADMIN_AUDIT_LOGS}>
                Audit Logs
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
