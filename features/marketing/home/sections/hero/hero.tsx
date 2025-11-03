import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { heroData } from './hero.data'

export function Hero() {
  return (
    <ItemGroup className="mx-auto w-full max-w-7xl gap-16">
      <Item className="flex w-full flex-col items-center gap-6 border-0 p-0 text-center">
        {heroData.tagline ? <Badge variant="outline">{heroData.tagline}</Badge> : null}
        <ItemContent className="max-w-3xl items-center gap-4 text-center">
          <ItemTitle className="justify-center">
            <span className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              {heroData.title}
            </span>
          </ItemTitle>
          <ItemDescription className="text-base text-muted-foreground sm:text-lg">
            {heroData.description}
          </ItemDescription>
        </ItemContent>
        <div
          className="flex flex-wrap justify-center gap-3"
          role="group"
          aria-label={heroData.ctaAriaLabel}
        >
          <Button asChild size="lg">
            <Link href={heroData.cta.primary.href}>{heroData.cta.primary.label}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={heroData.cta.secondary.href}>{heroData.cta.secondary.label}</Link>
          </Button>
        </div>
      </Item>
    </ItemGroup>
  )
}
