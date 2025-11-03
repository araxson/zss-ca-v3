import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { homeSupportData } from './support.data'

export function HomeSupport() {
  return (
    <ItemGroup className="mx-auto w-full max-w-7xl gap-16">
      <Item className="flex w-full flex-col items-center border-0 p-0 text-center">
        <ItemContent className="max-w-3xl items-center gap-3 text-center">
          <ItemTitle className="justify-center">
            <span className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {homeSupportData.heading}
            </span>
          </ItemTitle>
          <ItemDescription className="text-base text-muted-foreground sm:text-lg">
            {homeSupportData.subheading}
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item className="w-full flex-col">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {homeSupportData.highlights.map((highlight) => {
            const highlightId = `support-${highlight.id}`
            return (
              <Item
                key={highlight.id}
                variant="outline"
                className="flex-col items-start gap-4 p-6"
                aria-labelledby={highlightId}
              >
                <div className="flex items-start gap-3">
                  {highlight.icon ? (
                    <>
                      <ItemMedia variant="icon" aria-hidden="true">
                        <highlight.icon className="size-5" aria-hidden="true" />
                      </ItemMedia>
                      <span className="sr-only">{highlight.iconLabel}</span>
                    </>
                  ) : null}
                  <ItemContent className="gap-2">
                    {highlight.eyebrow ? (
                      <Badge variant="outline">{highlight.eyebrow}</Badge>
                    ) : null}
                    <ItemTitle id={highlightId}>{highlight.title}</ItemTitle>
                    <ItemDescription>{highlight.description}</ItemDescription>
                  </ItemContent>
                </div>
              </Item>
            )
          })}
        </div>
      </Item>
      <Item className="justify-center">
        <Button asChild size="lg">
          <Link aria-label={homeSupportData.cta.ariaLabel} href={homeSupportData.cta.href}>
            {homeSupportData.cta.label}
          </Link>
        </Button>
      </Item>
    </ItemGroup>
  )
}
