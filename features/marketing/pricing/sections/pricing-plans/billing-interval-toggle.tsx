'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { BillingInterval } from './pricing-plans.types'

type BillingIntervalToggleProps = {
  value: BillingInterval
  onChange: (interval: BillingInterval) => void
}

export function BillingIntervalToggle({ value, onChange }: BillingIntervalToggleProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing interval</CardTitle>
        <CardDescription>Toggle between monthly and yearly pricing to compare savings.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <ToggleGroup
            type="single"
            aria-label="Billing interval options"
            value={value}
            onValueChange={(interval) => interval && onChange(interval as BillingInterval)}
          >
            <ToggleGroupItem value="monthly" aria-label="Monthly billing">
              Monthly
            </ToggleGroupItem>
            <ToggleGroupItem value="yearly" aria-label="Yearly billing">
              <span className="flex items-center gap-2">
                Yearly
                <Badge variant="secondary">Save 20%</Badge>
              </span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardContent>
    </Card>
  )
}
