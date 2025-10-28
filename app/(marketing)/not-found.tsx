import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
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

export default function MarketingNotFound() {
  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center p-4">
      <Empty className="w-full max-w-xl border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Compass className="size-6" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>404 - Page Not Found</EmptyTitle>
          <EmptyDescription>
            The page you are looking for does not exist. It may have been moved or deleted.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="w-full space-y-4">
          <div className="rounded-lg bg-muted py-6 text-center text-4xl font-bold tracking-tight text-muted-foreground">
            404
          </div>
          <ButtonGroup className="flex w-full flex-col gap-2 sm:flex-row sm:gap-3">
            <Button asChild className="w-full sm:flex-1">
              <Link href={ROUTES.HOME}>Go Home</Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:flex-1">
              <Link href={ROUTES.PRICING}>View Pricing</Link>
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
