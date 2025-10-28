import { Check } from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { aboutValuesData } from './about-values.data'

export function AboutValues() {
  return (
    <section className="space-y-6">
      <SectionHeader title={aboutValuesData.title} align="center" />
      <ItemGroup className="grid gap-4 md:grid-cols-2">
        {aboutValuesData.values.map((value) => (
          <Item key={value.title} variant="outline" className="flex items-start gap-3 p-5">
            <ItemMedia variant="icon">
              <Check className="h-5 w-5 text-primary" aria-hidden />
            </ItemMedia>
            <ItemContent className="space-y-1">
              <ItemTitle className="text-base font-semibold text-foreground">
                {value.title}
              </ItemTitle>
              <ItemDescription className="text-sm text-muted-foreground">
                {value.description}
              </ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </section>
  )
}
