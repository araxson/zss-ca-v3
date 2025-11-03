'use client'

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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
    <AccordionItem value="timeline">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-2">
          <Calendar className="size-4" />
          <span className="font-semibold">Timeline & Milestones</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <FieldGroup className="grid gap-4 pt-4 sm:grid-cols-2">
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
      </AccordionContent>
    </AccordionItem>
  )
}
