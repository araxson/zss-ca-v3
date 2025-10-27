import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { featuresData } from './features.data'

export function Features() {
  return (
    <section className="w-full max-w-7xl mx-auto">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          {featuresData.heading}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {featuresData.subheading}
        </p>
      </div>
      <ItemGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuresData.features.map((feature) => (
          <Item key={feature.id} variant="outline" className="flex flex-col">
            <ItemHeader className="items-center gap-4">
              <ItemMedia variant="icon">
                <span aria-hidden="true">{feature.icon}</span>
              </ItemMedia>
              <ItemTitle>{feature.title}</ItemTitle>
            </ItemHeader>
            <ItemContent>
              <ItemDescription>{feature.description}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </section>
  )
}
