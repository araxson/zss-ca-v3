import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { Badge } from '@/components/ui/badge'
import { SectionHeader } from '@/features/shared/components'
import { caseGridData } from './case-grid.data'

export function CaseGrid() {
  return (
    <section className="space-y-6">
      <SectionHeader title={caseGridData.heading} align="center" />
      <ItemGroup className="grid gap-4 md:grid-cols-2">
        {caseGridData.cases.map((item) => (
          <Item key={item.id} variant="outline" className="flex flex-col">
            <ItemContent className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <ItemTitle>{item.name}</ItemTitle>
                <Badge variant="secondary">{item.industry}</Badge>
              </div>
              <ItemDescription>{item.summary}</ItemDescription>
              <ItemGroup className="flex flex-wrap gap-2" aria-label="Services delivered">
                {item.services.map((service) => (
                  <Item
                    key={service}
                    variant="muted"
                    size="sm"
                    className="w-fit bg-muted px-3 py-1"
                  >
                    <ItemTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {service}
                    </ItemTitle>
                  </Item>
                ))}
              </ItemGroup>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </section>
  )
}
