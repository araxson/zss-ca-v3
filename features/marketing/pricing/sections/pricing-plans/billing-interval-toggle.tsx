import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Badge } from '@/components/ui/badge'
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'

type BillingInterval = 'monthly' | 'yearly'

interface BillingIntervalToggleProps {
  value: BillingInterval
  onChange: (interval: BillingInterval) => void
}

export function BillingIntervalToggle({ value, onChange }: BillingIntervalToggleProps) {
  return (
    <FieldSet className="space-y-3">
      <FieldLegend>Billing interval</FieldLegend>
      <FieldDescription className="text-sm text-muted-foreground">
        Toggle between monthly and yearly pricing to compare savings.
      </FieldDescription>
      <FieldGroup className="flex justify-center">
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
      </FieldGroup>
    </FieldSet>
  )
}

export type { BillingInterval }
