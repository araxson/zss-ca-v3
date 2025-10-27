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

export function PortalCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
      <Card>
        <CardHeader>
          <CardTitle>For Clients</CardTitle>
          <CardDescription>Manage your subscription and site</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="w-full">
            <Link href={ROUTES.CLIENT_DASHBOARD}>Client Portal</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>For Admins</CardTitle>
          <CardDescription>Manage clients, sites, and support</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="w-full">
            <Link href={ROUTES.ADMIN_DASHBOARD}>Admin Portal</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Learn More</CardTitle>
          <CardDescription>About our services and team</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="w-full">
            <Link href={ROUTES.ABOUT}>About Us</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
