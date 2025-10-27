import { Check } from 'lucide-react'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { aboutValuesData } from './about-values.data'

export function AboutValues() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{aboutValuesData.title}</h2>
      </div>
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
