'use client'

import { Control } from 'react-hook-form'
import { CreateAnalyticsInput } from '../api/schema'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'

type AnalyticsFormMetricsFieldsProps = {
  control: Control<CreateAnalyticsInput>
}

export function AnalyticsFormMetricsFields({ control }: AnalyticsFormMetricsFieldsProps): React.JSX.Element {
  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Performance metrics</FieldLegend>
      <FieldDescription>
        Record the key performance indicators for this day.
      </FieldDescription>
      <FieldGroup className="grid gap-4 md:grid-cols-3">
        <FormField
          control={control}
          name="page_views"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout label="Page Views">
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <span className="text-xs font-medium uppercase">PV</span>
                    </InputGroupAddon>
                    <InputGroupInput
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                    />
                  </InputGroup>
                </FormControl>
              </FormFieldLayout>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="unique_visitors"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout label="Unique Visitors">
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <span className="text-xs font-medium uppercase">UV</span>
                    </InputGroupAddon>
                    <InputGroupInput
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                    />
                  </InputGroup>
                </FormControl>
              </FormFieldLayout>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="conversions"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout label="Conversions">
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <span className="text-xs font-medium uppercase">CV</span>
                    </InputGroupAddon>
                    <InputGroupInput
                      type="number"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
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
