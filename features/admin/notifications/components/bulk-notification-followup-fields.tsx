'use client'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'
import type { Control } from 'react-hook-form'
import type { BulkCreateNotificationInput } from '../api/schema'

interface BulkNotificationFollowupFieldsProps {
  control: Control<BulkCreateNotificationInput>
}

export function BulkNotificationFollowupFields({ control }: BulkNotificationFollowupFieldsProps): React.JSX.Element {
  return (
    <>
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
    </>
  )
}
