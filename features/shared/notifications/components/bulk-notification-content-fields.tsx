'use client'

import { Type, FileText } from 'lucide-react'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea } from '@/components/ui/input-group'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'
import type { Control } from 'react-hook-form'
import type { BulkCreateNotificationInput } from '../api/schema'

interface BulkNotificationContentFieldsProps {
  control: Control<BulkCreateNotificationInput>
}

export function BulkNotificationContentFields({ control }: BulkNotificationContentFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormFieldLayout label="Title">
              <FormControl>
                <InputGroup>
                  <InputGroupAddon>
                    <Type className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput placeholder="Notification title" {...field} />
                </InputGroup>
              </FormControl>
            </FormFieldLayout>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="body"
        render={({ field }) => (
          <FormItem>
            <FormFieldLayout
              label="Message (Optional)"
              description="Additional details for the notification"
            >
              <FormControl>
                <InputGroup>
                  <InputGroupAddon align="block-start">
                    <FileText className="size-4" />
                  </InputGroupAddon>
                  <InputGroupTextarea
                    placeholder="Notification message"
                    {...field}
                    value={field.value || ''}
                    rows={4}
                  />
                </InputGroup>
              </FormControl>
            </FormFieldLayout>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  )
}
