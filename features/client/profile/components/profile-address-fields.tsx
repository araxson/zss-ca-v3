'use client'

import { MapPin } from 'lucide-react'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'
interface ProfileAddressFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
}

export function ProfileAddressFields({ form }: ProfileAddressFieldsProps) {
  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Business address</FieldLegend>
      <FieldGroup className="space-y-4">
        <FormField
          control={form.control}
          name="address_line1"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout label="Address Line 1">
                <FormControl>
                  <InputGroup>
                    <InputGroupInput {...field} placeholder="123 Main St" />
                    <InputGroupAddon align="inline-start" aria-hidden="true">
                      <MapPin className="size-4" />
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
          name="address_line2"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout label="Address Line 2">
                <FormControl>
                  <Input {...field} placeholder="Suite 100" />
                </FormControl>
              </FormFieldLayout>
              <FormMessage />
            </FormItem>
          )}
        />

        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormFieldLayout label="City">
                  <FormControl>
                    <Input {...field} placeholder="Toronto" />
                  </FormControl>
                </FormFieldLayout>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormFieldLayout label="Province/State">
                  <FormControl>
                    <Input {...field} placeholder="ON" />
                  </FormControl>
                </FormFieldLayout>
                <FormMessage />
              </FormItem>
            )}
          />
        </FieldGroup>

        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormFieldLayout label="Postal Code">
                  <FormControl>
                    <Input {...field} placeholder="M5H 2N2" />
                  </FormControl>
                </FormFieldLayout>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormFieldLayout label="Country">
                  <FormControl>
                    <Input {...field} placeholder="Canada" />
                  </FormControl>
                </FormFieldLayout>
                <FormMessage />
              </FormItem>
            )}
          />
        </FieldGroup>
      </FieldGroup>
    </FieldSet>
  )
}
