'use client'

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Calendar } from 'lucide-react'

interface TimelineSectionProps {
  createdAt: string
  updatedAt: string
  deployedAt: string | null
  lastRevisionAt: string | null
  formatDate: (dateString: string | null) => string
}

export function SiteDetailTimelineSection({
  createdAt,
  updatedAt,
  deployedAt,
  lastRevisionAt,
  formatDate,
}: TimelineSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="size-4" aria-hidden="true" />
        <h3 className="text-base font-semibold">Timeline &amp; Milestones</h3>
      </div>
      <FieldGroup className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel>Created</FieldLabel>
          <FieldDescription>{formatDate(createdAt)}</FieldDescription>
        </Field>
        <Field>
          <FieldLabel>Last Updated</FieldLabel>
          <FieldDescription>{formatDate(updatedAt)}</FieldDescription>
        </Field>
        {deployedAt && (
          <Field>
            <FieldLabel>Deployed</FieldLabel>
            <FieldDescription>{formatDate(deployedAt)}</FieldDescription>
          </Field>
        )}
        {lastRevisionAt && (
          <Field>
            <FieldLabel>Last Revision</FieldLabel>
            <FieldDescription>{formatDate(lastRevisionAt)}</FieldDescription>
          </Field>
        )}
      </FieldGroup>
    </section>
  )
}
