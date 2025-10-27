import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ctaData } from './cta.data'

export function Cta() {
  return (
    <section className="w-full max-w-4xl mx-auto">
      <Card className="bg-primary text-primary-foreground">
        <CardHeader className="text-center space-y-4">
          <CardTitle>
            {ctaData.heading}
          </CardTitle>
          <CardDescription>
            {ctaData.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="secondary">
            <Link href={ctaData.cta.primary.href}>
              {ctaData.cta.primary.label}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={ctaData.cta.secondary.href}>
              {ctaData.cta.secondary.label}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
