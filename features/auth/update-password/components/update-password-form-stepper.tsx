'use client'

import { Fragment } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const STEPS = [
  { label: '1. Request Reset', status: 'complete' as const },
  { label: '2. Verify Code', status: 'complete' as const },
  { label: '3. Update Password', status: 'current' as const },
]

export function UpdatePasswordFormStepper(): React.JSX.Element {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {STEPS.map((step, index) => (
          <Fragment key={step.label}>
            <BreadcrumbItem>
              {step.status === 'current' ? (
                <BreadcrumbPage className="font-medium text-foreground">
                  {step.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <span className={step.status === 'complete' ? 'text-foreground' : 'text-muted-foreground'}>
                    {step.label}
                  </span>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < STEPS.length - 1 ? <BreadcrumbSeparator /> : null}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
