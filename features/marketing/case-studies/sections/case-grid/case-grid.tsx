import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import {
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Badge } from '@/components/ui/badge'
import { caseGridData } from './case-grid.data'

export function CaseGrid() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{caseGridData.heading}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {caseGridData.cases.map((item) => (
          <Item key={item.id} variant="outline" className="flex flex-col">
            <ItemContent className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <ItemTitle>{item.name}</ItemTitle>
                <Badge variant="secondary">{item.industry}</Badge>
              </div>
              <ItemDescription>{item.summary}</ItemDescription>
              <FieldGroup className="flex flex-wrap gap-2">
                {item.services.map((service) => (
                  <FieldLabel
                    key={service}
                    className="rounded-full bg-muted px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    {service}
                  </FieldLabel>
                ))}
              </FieldGroup>
            </ItemContent>
          </Item>
        ))}
      </div>
    </section>
  )
}
