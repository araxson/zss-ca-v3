'use client'

import { Mail, Phone, User } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'
import type { UpdateProfileInput } from '../api/schema'

interface ProfileContactFieldsProps {
  form: UseFormReturn<UpdateProfileInput>
}

export function ProfileContactFields({ form }: ProfileContactFieldsProps): React.JSX.Element {
  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Contact details</FieldLegend>
      <FieldGroup className="space-y-4">
        <FormField
          control={form.control}
          name="contact_name"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout label="Full Name">
                <FormControl>
                  <InputGroup>
                    <InputGroupInput {...field} placeholder="John Doe" />
                    <InputGroupAddon align="inline-start" aria-hidden="true">
                      <User className="size-4" />
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
          name="contact_email"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout label="Email">
                <FormControl>
                  <InputGroup>
                    <InputGroupInput {...field} type="email" placeholder="john@example.com" />
                    <InputGroupAddon align="inline-start" aria-hidden="true">
                      <Mail className="size-4" />
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
          name="contact_phone"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout label="Phone Number">
                <FormControl>
                  <InputGroup>
                    <InputGroupInput {...field} type="tel" placeholder="+1 (555) 123-4567" />
                    <InputGroupAddon align="inline-start" aria-hidden="true">
                      <Phone className="size-4" />
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
