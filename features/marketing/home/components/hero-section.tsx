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

export function HeroSection() {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>
          Welcome to Zenith Strategic Solutions
        </CardTitle>
        <CardDescription>
          Professional website plans for Canadian small businesses
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground">
          Subscription-based website development with predictable monthly pricing
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href={ROUTES.PRICING}>View Pricing</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={ROUTES.LOGIN}>Sign In</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
