'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface GlobalErrorProps {
  error: Error & { digest?: string; stack?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const isDevelopment = process.env.NODE_ENV === 'development'

  useEffect(() => {
    console.error('Global application error:', error)
  }, [error])

  const stackTrace = error.stack || error.message

  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <div className="flex min-h-screen items-center justify-center p-6">
          <Card className="w-full max-w-xl">
            <CardHeader className="space-y-3">
              <Badge variant="secondary" className="w-fit">
                System alert
              </Badge>
              <CardTitle>Critical error</CardTitle>
              <CardDescription>
                A fatal error occurred. Try again or return home. Contact support if the
                problem continues.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {isDevelopment && (
                <Alert variant="destructive">
                  <AlertTitle>Error details (development only)</AlertTitle>
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              )}

              {isDevelopment && stackTrace && (
                <div className="space-y-2">
                  <Separator />
                  <ScrollArea className="max-h-48 rounded-md border">
                    <pre className="p-4 text-xs font-mono whitespace-pre-wrap">
                      {stackTrace}
                    </pre>
                  </ScrollArea>
                </div>
              )}

              {error.digest && (
                <Alert>
                  <AlertTitle>Error reference</AlertTitle>
                  <AlertDescription>{error.digest}</AlertDescription>
                </Alert>
              )}
            </CardContent>

            <CardFooter className="flex-col gap-4">
              <ButtonGroup className="w-full" orientation="horizontal">
                <Button onClick={reset} className="flex-1">
                  Try again
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/">Go home</Link>
                </Button>
              </ButtonGroup>
              <Button
                variant="link"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Reload page
              </Button>
            </CardFooter>
          </Card>
        </div>
      </body>
    </html>
  )
}
