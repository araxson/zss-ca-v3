'use client'

import { MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
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

interface ProfileAddressFieldsNativeProps {
  profile: Profile
  errors?: Record<string, string[]>
  isPending: boolean
}

export function ProfileAddressFieldsNative({
  profile,
  errors,
  isPending,
}: ProfileAddressFieldsNativeProps) {
  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Business address</FieldLegend>
      <FieldGroup className="space-y-4">
        <Field data-invalid={!!errors?.['address_line1']}>
          <FieldLabel htmlFor="address_line1">Address Line 1</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="address_line1"
              name="address_line1"
              type="text"
              placeholder="123 Main St"
              defaultValue={profile['address_line1'] || ''}
              aria-invalid={!!errors?.['address_line1']}
              disabled={isPending}
            />
            <InputGroupAddon align="inline-start" aria-hidden="true">
              <MapPin className="size-4" />
            </InputGroupAddon>
          </InputGroup>
          <FieldError
            errors={errors?.['address_line1']?.map((msg) => ({ message: msg }))}
          />
        </Field>

        <Field data-invalid={!!errors?.['address_line2']}>
          <FieldLabel htmlFor="address_line2">Address Line 2</FieldLabel>
          <Input
            id="address_line2"
            name="address_line2"
            type="text"
            placeholder="Suite 100"
            defaultValue={profile['address_line2'] || ''}
            aria-invalid={!!errors?.['address_line2']}
            disabled={isPending}
          />
          <FieldError
            errors={errors?.['address_line2']?.map((msg) => ({ message: msg }))}
          />
        </Field>

        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors?.['city']}>
            <FieldLabel htmlFor="city">City</FieldLabel>
            <Input
              id="city"
              name="city"
              type="text"
              placeholder="Toronto"
              defaultValue={profile['city'] || ''}
              aria-invalid={!!errors?.['city']}
              disabled={isPending}
            />
            <FieldError errors={errors?.['city']?.map((msg) => ({ message: msg }))} />
          </Field>

          <Field data-invalid={!!errors?.['region']}>
            <FieldLabel htmlFor="region">Province/State</FieldLabel>
            <Input
              id="region"
              name="region"
              type="text"
              placeholder="ON"
              defaultValue={profile['region'] || ''}
              aria-invalid={!!errors?.['region']}
              disabled={isPending}
            />
            <FieldError errors={errors?.['region']?.map((msg) => ({ message: msg }))} />
          </Field>
        </FieldGroup>

        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={!!errors?.['postal_code']}>
            <FieldLabel htmlFor="postal_code">Postal Code</FieldLabel>
            <Input
              id="postal_code"
              name="postal_code"
              type="text"
              placeholder="M5H 2N2"
              defaultValue={profile['postal_code'] || ''}
              aria-invalid={!!errors?.['postal_code']}
              disabled={isPending}
            />
            <FieldError
              errors={errors?.['postal_code']?.map((msg) => ({ message: msg }))}
            />
          </Field>

          <Field data-invalid={!!errors?.['country']}>
            <FieldLabel htmlFor="country">Country</FieldLabel>
            <Input
              id="country"
              name="country"
              type="text"
              placeholder="Canada"
              defaultValue={profile['country'] || ''}
              aria-invalid={!!errors?.['country']}
              disabled={isPending}
            />
            <FieldError errors={errors?.['country']?.map((msg) => ({ message: msg }))} />
          </Field>
        </FieldGroup>
      </FieldGroup>
    </FieldSet>
  )
}
