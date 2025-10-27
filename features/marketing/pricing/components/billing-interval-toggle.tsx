'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

type BillingInterval = 'monthly' | 'yearly'

interface BillingIntervalToggleProps {
  onIntervalChange: (interval: BillingInterval) => void
}

export function BillingIntervalToggle({ onIntervalChange }: BillingIntervalToggleProps) {
  const [interval, setInterval] = useState<BillingInterval>('monthly')

  function handleChange(value: string) {
    const newInterval = value as BillingInterval
    setInterval(newInterval)
    onIntervalChange(newInterval)
  }

  return (
    <div className="flex justify-center mb-8">
      <Tabs value={interval} onValueChange={handleChange}>
        <TabsList>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">
            Yearly
            <Badge variant="secondary" className="ml-2">
              Save 20%
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
