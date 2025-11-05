'use client'

import { Mail, Phone, User } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Tables']['profile']['Row']

interface ProfileContactFieldsNativeProps {
  profile: Profile
  errors?: Record<string, string[]>
  isPending: boolean
}

export function ProfileContactFieldsNative({
  profile,
  errors,
  isPending,
}: ProfileContactFieldsNativeProps) {
  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Contact details</FieldLegend>
      <FieldGroup className="space-y-4">
        <Field data-invalid={!!errors?.['contact_name']}>
          <FieldLabel htmlFor="contact_name">
            Full Name
            <span className="text-destructive" aria-label="required"> *</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="contact_name"
              name="contact_name"
              type="text"
              placeholder="John Doe"
              defaultValue={profile['contact_name'] || ''}
              required
              aria-required="true"
              aria-invalid={!!errors?.['contact_name']}
              disabled={isPending}
            />
            <InputGroupAddon align="inline-start" aria-hidden="true">
              <User className="size-4" />
            </InputGroupAddon>
          </InputGroup>
          <FieldError
            errors={errors?.['contact_name']?.map((msg) => ({ message: msg }))}
          />
        </Field>

        <Field data-invalid={!!errors?.['contact_email']}>
          <FieldLabel htmlFor="contact_email">
            Email
            <span className="text-destructive" aria-label="required"> *</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="contact_email"
              name="contact_email"
              type="email"
              placeholder="john@example.com"
              defaultValue={profile['contact_email'] || ''}
              required
              aria-required="true"
              aria-invalid={!!errors?.['contact_email']}
              disabled={isPending}
            />
            <InputGroupAddon align="inline-start" aria-hidden="true">
              <Mail className="size-4" />
            </InputGroupAddon>
          </InputGroup>
          <FieldError
            errors={errors?.['contact_email']?.map((msg) => ({ message: msg }))}
          />
        </Field>

        <Field data-invalid={!!errors?.['contact_phone']}>
          <FieldLabel htmlFor="contact_phone">Phone</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="contact_phone"
              name="contact_phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              defaultValue={profile['contact_phone'] || ''}
              aria-invalid={!!errors?.['contact_phone']}
              disabled={isPending}
            />
            <InputGroupAddon align="inline-start" aria-hidden="true">
              <Phone className="size-4" />
            </InputGroupAddon>
          </InputGroup>
          <FieldError
            errors={errors?.['contact_phone']?.map((msg) => ({ message: msg }))}
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
