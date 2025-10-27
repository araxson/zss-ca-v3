'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
            <span className="ml-2 text-xs bg-primary/10 px-2 py-0.5 rounded">
              Save 20%
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
