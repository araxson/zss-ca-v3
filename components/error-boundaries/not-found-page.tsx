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
import { Compass } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Empty className="w-full max-w-md border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Compass className="size-6" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>404 - Page Not Found</EmptyTitle>
          <EmptyDescription>
            The page you are looking for does not exist or has been moved.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="w-full space-y-4">
          <div className="rounded-lg bg-muted py-6 text-center text-4xl font-bold tracking-tight text-muted-foreground">
            404
          </div>
          <div className="flex w-full flex-col gap-2">
            <Button asChild className="w-full">
              <Link href={ROUTES.HOME}>Go Home</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href={ROUTES.CONTACT}>Contact Support</Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  )
}
