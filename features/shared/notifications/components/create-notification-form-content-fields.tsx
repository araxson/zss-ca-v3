'use client'

import { Control } from 'react-hook-form'
import { Type, FileText } from 'lucide-react'
import { CreateNotificationInput } from '../api/schema'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea } from '@/components/ui/input-group'
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'

type CreateNotificationFormContentFieldsProps = {
  control: Control<CreateNotificationInput>
}

export function CreateNotificationFormContentFields({ control }: CreateNotificationFormContentFieldsProps) {
  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Content</FieldLegend>
      <FieldGroup className="space-y-4">
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
      </FieldGroup>
    </FieldSet>
  )
}
