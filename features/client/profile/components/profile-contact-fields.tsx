'use client'

import { Mail, Phone, User } from 'lucide-react'

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
} from '@/components/ui/input-group'
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
interface ProfileContactFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any
}

export function ProfileContactFields({ form }: ProfileContactFieldsProps) {
  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Contact details</FieldLegend>
      <FieldGroup className="space-y-4">
        <FormField
          control={form.control}
          name="contact_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupAddon>
                    <User className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput {...field} placeholder="John Doe" />
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupAddon>
                    <Mail className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput {...field} type="email" placeholder="john@example.com" />
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contact_phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupAddon>
                    <Phone className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput {...field} type="tel" placeholder="+1 (555) 123-4567" />
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
