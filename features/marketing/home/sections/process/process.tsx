import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { homeProcessData } from './process.data'

export function HomeProcess() {
  return (
    <ItemGroup className="mx-auto w-full max-w-7xl gap-16">
      <Item className="flex w-full flex-col items-center border-0 p-0 text-center">
        <ItemContent className="max-w-3xl items-center gap-3 text-center">
          <ItemTitle className="justify-center">
            <span className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {homeProcessData.heading}
            </span>
          </ItemTitle>
          <ItemDescription className="text-base text-muted-foreground sm:text-lg">
            {homeProcessData.subheading}
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item className="w-full flex-col">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {homeProcessData.steps.map((step) => (
            <Item
              key={step.id}
              variant="outline"
              className="flex-col items-start gap-3 p-6"
              aria-labelledby={`process-step-${step.id}`}
            >
              <Badge variant="outline">{step.label}</Badge>
              <ItemContent className="gap-2">
                <ItemTitle id={`process-step-${step.id}`}>{step.title}</ItemTitle>
                <ItemDescription>{step.description}</ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </div>
      </Item>
    </ItemGroup>
  )
}
