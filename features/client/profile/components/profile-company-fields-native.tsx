'use client'

import { Building2, Globe } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
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

interface ProfileCompanyFieldsNativeProps {
  profile: Profile
  errors?: Record<string, string[]>
  isPending: boolean
}

export function ProfileCompanyFieldsNative({
  profile,
  errors,
  isPending,
}: ProfileCompanyFieldsNativeProps) {
  const websiteValue = profile['company_website']?.replace(/^https?:\/\//i, '') || ''

  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Company information</FieldLegend>
      <FieldGroup className="space-y-4">
        <Field data-invalid={!!errors?.['company_name']}>
          <FieldLabel htmlFor="company_name">Company Name</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="company_name"
              name="company_name"
              type="text"
              placeholder="Acme Inc."
              defaultValue={profile['company_name'] || ''}
              aria-invalid={!!errors?.['company_name']}
              disabled={isPending}
            />
            <InputGroupAddon align="inline-start" aria-hidden="true">
              <Building2 className="size-4" />
            </InputGroupAddon>
          </InputGroup>
          <FieldError
            errors={errors?.['company_name']?.map((msg) => ({ message: msg }))}
          />
        </Field>

        <Field data-invalid={!!errors?.['company_website']}>
          <FieldLabel htmlFor="company_website">Company Website</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>https://</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="company_website"
              name="company_website"
              type="text"
              placeholder="example.com"
              className="!pl-0.5"
              defaultValue={websiteValue}
              aria-invalid={!!errors?.['company_website']}
              disabled={isPending}
            />
            <InputGroupAddon align="inline-end" aria-hidden="true">
              <Globe className="size-4" />
            </InputGroupAddon>
          </InputGroup>
          <FieldError
            errors={errors?.['company_website']?.map((msg) => ({ message: msg }))}
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
