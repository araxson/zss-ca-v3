import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { homeSupportData } from './support.data'

export function HomeSupport() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold tracking-tight">{homeSupportData.heading}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {homeSupportData.subheading}
        </p>
      </div>
      <ItemGroup className="grid gap-4 md:grid-cols-3">
        {homeSupportData.highlights.map((highlight) => (
          <Item key={highlight.title} variant="outline" className="flex flex-col">
            <ItemContent className="space-y-3">
              <ItemTitle>{highlight.title}</ItemTitle>
              <ItemDescription>{highlight.description}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
      <div className="flex justify-center">
        <Button asChild size="lg">
          <Link href={homeSupportData.cta.href}>{homeSupportData.cta.label}</Link>
        </Button>
      </div>
    </section>
  )
}
