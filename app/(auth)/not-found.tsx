import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyMedia,
} from '@/components/ui/empty'
import { ROUTES } from '@/lib/constants/routes'

export default function AuthNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>404 - Authentication Page Not Found</CardTitle>
          <CardDescription>
            The authentication page you are looking for does not exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <EmptyTitle>404</EmptyTitle>
              </EmptyMedia>
            </EmptyHeader>
          </Empty>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href={ROUTES.LOGIN}>
                Go to Login
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href={ROUTES.SIGNUP}>
                Create Account
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href={ROUTES.HOME}>
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
