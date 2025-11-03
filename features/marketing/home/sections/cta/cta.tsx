import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { ctaData } from './cta.data'

export function Cta() {
  return (
    <ItemGroup className="mx-auto w-full max-w-7xl gap-16">
      <Item className="flex w-full flex-col items-center border-0 p-0 text-center">
        <ItemContent className="max-w-3xl items-center gap-3 text-center">
          <ItemTitle className="justify-center">
            <span className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {ctaData.heading}
            </span>
          </ItemTitle>
          <ItemDescription className="text-base text-muted-foreground sm:text-lg">
            {ctaData.description}
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item className="w-full flex-col items-center gap-4">
        <div className="w-full rounded-xl bg-primary px-8 py-10 text-center text-primary-foreground">
          <div
            className="flex flex-wrap justify-center gap-3"
            role="group"
            aria-label={ctaData.ariaLabel}
          >
            <Button asChild variant="secondary">
              <Link href={ctaData.cta.primary.href}>{ctaData.cta.primary.label}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={ctaData.cta.secondary.href}>{ctaData.cta.secondary.label}</Link>
            </Button>
          </div>
        </div>
      </Item>
    </ItemGroup>
  )
}
