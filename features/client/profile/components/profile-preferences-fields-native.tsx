'use client'

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Tables']['profile']['Row']

interface ProfilePreferencesFieldsNativeProps {
  profile: Profile
  errors?: Record<string, string[]>
  isPending: boolean
}

export function ProfilePreferencesFieldsNative({
  profile,
  errors,
  isPending,
}: ProfilePreferencesFieldsNativeProps) {
  return (
    <FieldSet>
      <FieldLegend>Preferences</FieldLegend>
      <FieldGroup>
        <Field
          data-invalid={!!errors?.['marketing_opt_in']}
          className="flex items-start gap-3"
        >
          <input
            type="checkbox"
            id="marketing_opt_in"
            name="marketing_opt_in"
            defaultChecked={profile['marketing_opt_in'] ?? false}
            aria-invalid={!!errors?.['marketing_opt_in']}
            disabled={isPending}
            className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
          />
          <div className="flex-1">
            <FieldLabel htmlFor="marketing_opt_in">Marketing Communications</FieldLabel>
            <FieldDescription>
              Receive emails about new features, updates, and promotions
            </FieldDescription>
            <FieldError
              errors={errors?.['marketing_opt_in']?.map((msg) => ({ message: msg }))}
            />
          </div>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
