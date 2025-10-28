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
import { SectionHeader } from '@/features/shared/components'
import { homeSupportData } from './support.data'

export function HomeSupport() {
  return (
    <section className="space-y-8">
      <SectionHeader
        title={homeSupportData.heading}
        description={homeSupportData.subheading}
        align="center"
      />
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
