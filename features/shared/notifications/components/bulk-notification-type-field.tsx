'use client'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'
import { notificationTypeOptions } from './bulk-notification-form-data'
import type { Control } from 'react-hook-form'
import type { BulkCreateNotificationInput } from '../schema'

interface BulkNotificationTypeFieldProps {
  control: Control<BulkCreateNotificationInput>
}

export function BulkNotificationTypeField({ control }: BulkNotificationTypeFieldProps) {
  return (
    <FormField
      control={control}
      name="notification_type"
      render={({ field }) => (
        <FormItem>
          <FormFieldLayout label="Type">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="grid grid-cols-2 gap-3"
              >
                {notificationTypeOptions.map((option) => (
                  <Label key={option.value} htmlFor={`type-${option.value}`} className="cursor-pointer">
                    <Item variant="outline" size="sm" className="items-start gap-3">
                      <ItemMedia>
                        <RadioGroupItem value={option.value} id={`type-${option.value}`} />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{option.label}</ItemTitle>
                        <ItemDescription>{option.description}</ItemDescription>
                      </ItemContent>
                    </Item>
                  </Label>
                ))}
              </RadioGroup>
            </FormControl>
          </FormFieldLayout>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
