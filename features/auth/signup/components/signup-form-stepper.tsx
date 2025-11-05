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
  { label: '1. Create Account', status: 'current' as const },
  { label: '2. Verify Email', status: 'upcoming' as const },
  { label: '3. Get Started', status: 'upcoming' as const },
]

export function SignupFormStepper(): React.JSX.Element {
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
                  <span className="text-muted-foreground">{step.label}</span>
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
