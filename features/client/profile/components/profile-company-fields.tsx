'use client'

import { Building2, Globe } from 'lucide-react'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
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
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupAddon>
                    <Building2 className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput {...field} placeholder="Acme Inc." />
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company_website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Website</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    placeholder="example.com"
                    className="!pl-1"
                    value={field.value?.replace(/^https?:\/\//i, '') || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <InputGroupAddon>
                    <InputGroupText>https://</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <Globe className="size-4" />
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </FieldGroup>
    </FieldSet>
  )
}
