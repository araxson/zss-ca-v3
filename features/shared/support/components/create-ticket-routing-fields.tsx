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
import { categoryOptions, priorityOptions } from './create-ticket-form-data'
import type { Control } from 'react-hook-form'
import type { CreateTicketInput } from '../schema'

interface CreateTicketRoutingFieldsProps {
  control: Control<CreateTicketInput>
}

export function CreateTicketRoutingFields({ control }: CreateTicketRoutingFieldsProps) {
  return (
    <>
      <FormField
        control={control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormFieldLayout label="Category">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="space-y-2"
                >
                  {categoryOptions.map((option) => (
                    <Label key={option.value} htmlFor={option.value} className="cursor-pointer">
                      <Item variant="outline" size="sm" className="items-center gap-3">
                        <ItemMedia>
                          <RadioGroupItem value={option.value} id={option.value} />
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

      <FormField
        control={control}
        name="priority"
        render={({ field }) => (
          <FormItem>
            <FormFieldLayout label="Priority">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="space-y-2"
                >
                  {priorityOptions.map((option) => (
                    <Label key={option.value} htmlFor={option.value} className="cursor-pointer">
                      <Item variant="outline" size="sm" className="items-center gap-3">
                        <ItemMedia>
                          <RadioGroupItem value={option.value} id={option.value} />
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
    </>
  )
}
