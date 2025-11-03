'use client'

import { Control } from 'react-hook-form'
import { CreateNotificationInput } from '../api/schema'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'

type CreateNotificationFormFollowupFieldsProps = {
  control: Control<CreateNotificationInput>
}

export function CreateNotificationFormFollowupFields({ control }: CreateNotificationFormFollowupFieldsProps) {
  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Follow-up</FieldLegend>
      <FieldDescription>Provide optional destination links or expiration rules.</FieldDescription>
      <FieldGroup className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4">
        <FormField
          control={control}
          name="action_url"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormFieldLayout
                label="Action URL (Optional)"
                description="Link for users to take action"
              >
                <FormControl>
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
              </FormFieldLayout>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="expires_at"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout
                label="Expires At (Optional)"
                description="Notification will auto-hide after this date"
              >
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    value={field.value || ''}
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
