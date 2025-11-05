'use client'

import type { UseFormReturn } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'
import type { UpdateProfileInput } from '../api/schema'

interface ProfilePreferencesFieldsProps {
  form: UseFormReturn<UpdateProfileInput>
}

export function ProfilePreferencesFields({ form }: ProfilePreferencesFieldsProps): React.JSX.Element {
  return (
    <FieldSet>
      <FieldLegend>Preferences</FieldLegend>
      <FieldGroup>
        <FormField
          control={form.control}
          name="marketing_opt_in"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout
                label="Marketing Communications"
                description="Receive emails about new features, updates, and promotions"
                orientation="responsive"
              >
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
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
