'use client'

import { Building2, Globe } from 'lucide-react'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'
interface ProfileCompanyFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
}

export function ProfileCompanyFields({ form }: ProfileCompanyFieldsProps) {
  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Company information</FieldLegend>
      <FieldGroup className="space-y-4">
        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout label="Company Name">
                <FormControl>
                  <InputGroup>
                    <InputGroupInput {...field} placeholder="Acme Inc." />
                    <InputGroupAddon align="inline-start" aria-hidden="true">
                      <Building2 className="size-4" />
                    </InputGroupAddon>
                  </InputGroup>
                </FormControl>
              </FormFieldLayout>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company_website"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout label="Company Website">
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>https://</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      placeholder="example.com"
                      className="!pl-0.5"
                      value={field.value?.replace(/^https?:\/\//i, '') || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    <InputGroupAddon align="inline-end" aria-hidden="true">
                      <Globe className="size-4" />
                    </InputGroupAddon>
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
