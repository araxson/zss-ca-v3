import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { homeIndustriesData } from './industries.data'

export function HomeIndustries() {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold tracking-tight">{homeIndustriesData.heading}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We partner with Canadian organizations who rely on compelling storytelling and consistent lead flow.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {homeIndustriesData.industries.map((industry) => (
          <Item key={industry.id} variant="outline" className="flex flex-col">
            <ItemContent className="space-y-2">
              <ItemTitle>{industry.name}</ItemTitle>
              <ItemDescription>{industry.description}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </div>
    </section>
  )
}
