'use client'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea } from '@/components/ui/input-group'
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'
import { Globe, FileText } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { CreateSiteInput } from '../api/schema'

interface CreateSiteDetailFieldsProps {
  form: UseFormReturn<CreateSiteInput>
}

export function CreateSiteDetailFields({ form }: CreateSiteDetailFieldsProps): React.JSX.Element {
  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Project details</FieldLegend>
      <FieldDescription>Name the project and capture the brief before kickoff.</FieldDescription>
      <FieldGroup className="space-y-4">
        <FormField
          control={form.control}
          name="site_name"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout label="Site Name" description="A descriptive name for the website project">
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <Globe className="size-4" />
                    </InputGroupAddon>
                    <InputGroupInput placeholder="My Business Website" {...field} />
                  </InputGroup>
                </FormControl>
              </FormFieldLayout>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="design_brief"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout label="Design Brief" description="Design requirements and client preferences">
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon align="block-start">
                      <FileText className="size-4" />
                    </InputGroupAddon>
                    <InputGroupTextarea
                      placeholder="Enter design requirements, brand references, and success criteria..."
                      rows={6}
                      value={typeof field.value?.['notes'] === 'string' ? field.value['notes'] : ''}
                      onChange={(event) => field.onChange({ notes: event.target.value })}
                    />
                  </InputGroup>
                </FormControl>
              </FormFieldLayout>
              <FormMessage />
            </FormItem>
          )}
        />
      </FieldGroup>
    </FieldSet>
  )
}
