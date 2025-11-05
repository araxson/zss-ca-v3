'use client'

import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea } from '@/components/ui/input-group'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Globe, FileText } from 'lucide-react'

interface CreateSiteDetailFieldsNativeProps {
  errors?: Record<string, string[]>
  isPending: boolean
}

export function CreateSiteDetailFieldsNative({ errors, isPending }: CreateSiteDetailFieldsNativeProps): React.JSX.Element {
  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Project details</FieldLegend>
      <FieldDescription>Name the project and capture the brief before kickoff.</FieldDescription>
      <FieldGroup className="space-y-4">
        <Field data-invalid={!!errors?.['site_name']}>
          <FieldLabel htmlFor="site_name">
            Site Name
            <span className="text-destructive" aria-label="required"> *</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="site_name"
              name="site_name"
              placeholder="My Business Website"
              required
              disabled={isPending}
              aria-required="true"
              aria-invalid={!!errors?.['site_name']}
              aria-describedby={errors?.['site_name'] ? 'site_name-error site_name-hint' : 'site_name-hint'}
            />
            <InputGroupAddon align="inline-start" aria-hidden="true">
              <Globe className="size-4" />
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription id="site_name-hint">
            A descriptive name for the website project
          </FieldDescription>
          <FieldError errors={errors?.['site_name']?.map(msg => ({ message: msg }))} />
        </Field>

        <Field data-invalid={!!errors?.['design_brief']}>
          <FieldLabel htmlFor="design_brief_notes">Design Brief</FieldLabel>
          <InputGroup>
            <InputGroupTextarea
              id="design_brief_notes"
              name="design_brief_notes"
              placeholder="Enter design requirements, brand references, and success criteria..."
              rows={6}
              disabled={isPending}
              aria-invalid={!!errors?.['design_brief']}
              aria-describedby={errors?.['design_brief'] ? 'design_brief-error design_brief-hint' : 'design_brief-hint'}
            />
            <InputGroupAddon align="block-start" aria-hidden="true">
              <FileText className="size-4" />
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription id="design_brief-hint">
            Design requirements and client preferences
          </FieldDescription>
          <FieldError errors={errors?.['design_brief']?.map(msg => ({ message: msg }))} />
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
