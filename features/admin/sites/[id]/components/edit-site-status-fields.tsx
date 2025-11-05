'use client'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Item, ItemContent } from '@/components/ui/item'
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'
import { Globe } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { UpdateSiteInput } from '../api/schema'
import type { Database } from '@/lib/types/database.types'
import { formatStatus } from '@/features/shared/utils'

const siteStatuses: Array<Database['public']['Enums']['site_status']> = [
  'pending',
  'in_production',
  'awaiting_client_content',
  'ready_for_review',
  'live',
  'paused',
  'archived',
]

interface EditSiteStatusFieldsProps {
  form: UseFormReturn<UpdateSiteInput>
  siteName: string
  currentStatus: string
}

export function EditSiteStatusFields({ form, siteName, currentStatus }: EditSiteStatusFieldsProps): React.JSX.Element {
  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Project status</FieldLegend>
      <FieldDescription>Keep the deployment record current for your team.</FieldDescription>
      <FieldGroup className="space-y-4">
        <Item variant="outline" size="sm">
          <ItemContent>
            <div className="font-medium">{siteName}</div>
            <div className="text-sm text-muted-foreground">Currently marked as {formatStatus(currentStatus)}</div>
          </ItemContent>
        </Item>

        <FormField
          control={form.control}
          name="site_name"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout label="Site Name">
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <Globe className="size-4" />
                    </InputGroupAddon>
                    <InputGroupInput {...field} />
                  </InputGroup>
                </FormControl>
              </FormFieldLayout>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout label="Status" description="Current project status">
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {siteStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {formatStatus(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldLayout>
              <FormMessage />
            </FormItem>
          )}
        />
      </FieldGroup>
    </FieldSet>
  )
}
