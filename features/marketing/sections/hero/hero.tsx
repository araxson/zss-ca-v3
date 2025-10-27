import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { heroData } from './hero.data'

export function Hero() {
  return (
    <Card className="max-w-4xl border-none shadow-none bg-transparent">
      <CardHeader className="space-y-6 text-center">
        <div className="flex justify-center">
          <Badge variant="secondary">
            {heroData.tagline}
          </Badge>
        </div>
        <CardTitle>
          {heroData.title}
        </CardTitle>
        <div className="max-w-2xl mx-auto">
          <CardDescription>{heroData.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link href={heroData.cta.primary.href}>
            {heroData.cta.primary.label}
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href={heroData.cta.secondary.href}>
            {heroData.cta.secondary.label}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
