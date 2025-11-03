'use client'

import { Control } from 'react-hook-form'
import { CreateAnalyticsInput } from '../api/schema'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'

type AnalyticsFormSelectionFieldsProps = {
  control: Control<CreateAnalyticsInput>
  sites: Array<{
    id: string
    site_name: string
    profile: {
      contact_name: string | null
      contact_email: string | null
    }
  }>
}

export function AnalyticsFormSelectionFields({ control, sites }: AnalyticsFormSelectionFieldsProps) {
  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Site selection</FieldLegend>
      <FieldDescription>
        Choose the site and date for the metrics you&apos;re recording.
      </FieldDescription>
      <FieldGroup className="space-y-4">
        <FormField
          control={control}
          name="client_site_id"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout label="Site">
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a site" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.site_name} ({site.profile.contact_name || site.profile.contact_email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldLayout>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="metric_date"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout
                label="Date"
                description="Date for these analytics metrics"
              >
                <FormControl>
                  <Input type="date" {...field} />
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
