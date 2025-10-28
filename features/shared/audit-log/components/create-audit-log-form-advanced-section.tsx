'use client'

import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { ChevronDown } from 'lucide-react'

type CreateAuditLogFormAdvancedSectionProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  changeSummary: string
  onChangeSummaryChange: (value: string) => void
}

export function CreateAuditLogFormAdvancedSection({
  isOpen,
  onOpenChange,
  changeSummary,
  onChangeSummaryChange,
}: CreateAuditLogFormAdvancedSectionProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between"
        >
          <span>Advanced: Change Summary (Optional)</span>
          <ChevronDown
            className={`size-4 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 pt-4">
        <FieldGroup className="space-y-2">
          <Field>
            <FieldLabel htmlFor="change-summary">Change Summary (JSON)</FieldLabel>
            <Textarea
              id="change-summary"
              value={changeSummary}
              onChange={(e) => onChangeSummaryChange(e.target.value)}
              placeholder='{"before": {...}, "after": {...}, "reason": "..."}'
              rows={6}
              className="font-mono text-sm"
            />
            <FieldDescription>
              JSON object describing what changed (before/after values, reason, etc.)
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CollapsibleContent>
    </Collapsible>
  )
}
