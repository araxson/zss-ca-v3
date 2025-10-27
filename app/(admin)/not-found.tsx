import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ROUTES } from '@/lib/constants/routes'

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>404 - Admin Page Not Found</CardTitle>
          <CardDescription>
            The admin page you are looking for does not exist or you do not have permission to access it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-12 text-center">
            <p className="text-7xl font-bold text-muted-foreground">404</p>
          </div>

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href={ROUTES.ADMIN_DASHBOARD}>
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={ROUTES.ADMIN_CLIENTS}>
                Clients
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={ROUTES.ADMIN_SITES}>
                Sites
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={ROUTES.ADMIN_SUPPORT}>
                Support
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
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
