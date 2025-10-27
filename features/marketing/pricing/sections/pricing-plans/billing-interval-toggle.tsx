import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'

type BillingInterval = 'monthly' | 'yearly'

interface BillingIntervalToggleProps {
  value: BillingInterval
  onChange: (interval: BillingInterval) => void
}

export function BillingIntervalToggle({ value, onChange }: BillingIntervalToggleProps) {
  return (
    <Item variant="outline" className="flex flex-col gap-3 p-4">
      <ItemContent className="space-y-2 text-center sm:text-left">
        <ItemTitle className="text-sm font-semibold uppercase tracking-wide">
          Billing interval
        </ItemTitle>
        <ItemDescription className="text-sm text-muted-foreground">
          Toggle between monthly and yearly pricing to compare savings.
        </ItemDescription>
      </ItemContent>
      <div className="flex justify-center">
        <ToggleGroup
          type="single"
          value={value}
          onValueChange={(interval) => interval && onChange(interval as BillingInterval)}
        >
          <ToggleGroupItem value="monthly" aria-label="Monthly billing">
            Monthly
          </ToggleGroupItem>
          <ToggleGroupItem value="yearly" aria-label="Yearly billing" className="gap-2">
            Yearly
            <Badge variant="secondary">Save 20%</Badge>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </Item>
  )
}

export type { BillingInterval }
