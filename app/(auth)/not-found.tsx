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
import { Item, ItemContent, ItemTitle } from '@/components/ui/item'
import { LockKeyhole } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'

export default function AuthNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Empty className="w-full max-w-md border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LockKeyhole className="size-6" aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>404 - Authentication Page Not Found</EmptyTitle>
          <EmptyDescription>
            The authentication page you are looking for does not exist.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="w-full space-y-3">
          <Item variant="muted" className="justify-center">
            <ItemContent className="text-3xl font-semibold tracking-tight text-muted-foreground">
              <ItemTitle>404</ItemTitle>
            </ItemContent>
          </Item>
          <ButtonGroup orientation="vertical" className="w-full gap-2">
            <Button asChild className="w-full">
              <Link href={ROUTES.LOGIN}>Go to Login</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href={ROUTES.SIGNUP}>Create Account</Link>
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
