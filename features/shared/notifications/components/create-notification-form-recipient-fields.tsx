'use client'

import { Control } from 'react-hook-form'
import { CreateNotificationInput } from '../api/schema'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import { User } from 'lucide-react'
import { notificationTypes } from '../constants'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'

type CreateNotificationFormRecipientFieldsProps = {
  control: Control<CreateNotificationInput>
  clients: Array<{
    id: string
    contact_name: string | null
    contact_email: string | null
  }>
}

export function CreateNotificationFormRecipientFields({ control, clients }: CreateNotificationFormRecipientFieldsProps) {
  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Recipient & Type</FieldLegend>
      <FieldDescription>Choose who receives this notification and how it is categorized.</FieldDescription>
      <FieldGroup className="space-y-4">
        <Item variant="outline" size="sm">
          <ItemMedia>
            <User className="size-4 text-muted-foreground" aria-hidden="true" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{clients.length} clients available</ItemTitle>
            <ItemDescription>Select a recipient or install a broadcast type.</ItemDescription>
          </ItemContent>
        </Item>
        <FormField
          control={control}
          name="profile_id"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout label="Recipient">
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.contact_name || client.contact_email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormFieldLayout>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="notification_type"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout label="Type">
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {notificationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
