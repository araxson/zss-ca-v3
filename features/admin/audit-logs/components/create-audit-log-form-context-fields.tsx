'use client'

import { Control } from 'react-hook-form'
import { CreateAuditLogInput } from '../api/schema'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'

type CreateAuditLogFormContextFieldsProps = {
  control: Control<CreateAuditLogInput>
  clients: Array<{
    id: string
    contact_name: string | null
    contact_email: string | null
  }>
}

export function CreateAuditLogFormContextFields({ control, clients }: CreateAuditLogFormContextFieldsProps): React.JSX.Element {
  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Context</FieldLegend>
      <FieldGroup className="space-y-4">
        {clients.length > 0 && (
          <FormField
            control={control}
            name="profile_id"
            render={({ field }) => (
              <FormItem>
                <FormFieldLayout label="Related User (Optional)">
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value === 'none' ? null : value)}
                      value={field.value ?? 'none'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
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
        )}

        <FormField
          control={control}
          name="action"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout
                label="Action"
                description="Describe the action taken (e.g., manual_update, data_correction)"
              >
                <FormControl>
                  <Input placeholder="e.g., manual_update, external_import" {...field} />
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
