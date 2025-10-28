'use client'

import { MapPin } from 'lucide-react'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
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
              <FormLabel>Address Line 1</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupAddon>
                    <MapPin className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput {...field} placeholder="123 Main St" />
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address_line2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Suite 100" />
              </FormControl>
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
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Toronto" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province/State</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="ON" />
                </FormControl>
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
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="M5H 2N2" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Canada" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FieldGroup>
      </FieldGroup>
    </FieldSet>
  )
}
