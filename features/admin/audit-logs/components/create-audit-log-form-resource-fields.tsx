'use client'

import { Control } from 'react-hook-form'
import { CreateAuditLogInput } from '../api/schema'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'
import { commonTables } from '../constants'

type CreateAuditLogFormResourceFieldsProps = {
  control: Control<CreateAuditLogInput>
}

export function CreateAuditLogFormResourceFields({ control }: CreateAuditLogFormResourceFieldsProps): React.JSX.Element {
  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Target resource</FieldLegend>
      <FieldGroup className="space-y-4">
        <FormField
          control={control}
          name="resource_table"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout
                label="Resource Table"
                description="The database table affected"
              >
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select table" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonTables.map((table) => (
                        <SelectItem key={table} value={table}>
                          {table}
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
          name="resource_id"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout
                label="Resource ID (Optional)"
                description="The specific record ID that was modified"
              >
                <FormControl>
                  <Input
                    placeholder="UUID or record ID"
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
