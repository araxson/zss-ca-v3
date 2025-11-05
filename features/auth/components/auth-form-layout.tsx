'use client'

import type { ReactNode } from 'react'
import { Item } from '@/components/ui/item'
import { FieldLegend, FieldSet } from '@/components/ui/field'

interface AuthFormLayoutProps {
  legend: string
  title: string
  description: string
  children: ReactNode
  stepper?: ReactNode
  infoPanel?: ReactNode
  headingAdornment?: ReactNode
  beforeForm?: ReactNode
  className?: string
}

export function AuthFormLayout({
  legend,
  title,
  description,
  children,
  stepper,
  infoPanel,
  headingAdornment,
  beforeForm,
}: AuthFormLayoutProps): React.JSX.Element {
  return (
    <Item variant="outline" className="max-w-7xl w-full overflow-hidden bg-card">
      <div className="grid w-full gap-0 p-0 md:grid-cols-2">
        <FieldSet className="space-y-6 p-6 md:p-8">
          <FieldLegend className="sr-only">{legend}</FieldLegend>
          {stepper}
          <div className="flex flex-col items-center gap-2 text-center">
            {headingAdornment}
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="text-sm text-muted-foreground text-balance">{description}</p>
          </div>
          {beforeForm}
          {children}
        </FieldSet>

        {infoPanel ? (
          <div className="relative hidden rounded-md bg-muted p-8 text-center md:flex md:items-center md:justify-center">
            {infoPanel}
          </div>
        ) : null}
      </div>
    </Item>
  )
}
