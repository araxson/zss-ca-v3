'use client'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'
import type { Control } from 'react-hook-form'
import type { DeploySiteInput } from '../api/schema'

interface DeploySiteNotesFieldProps {
  control: Control<DeploySiteInput>
}

export function DeploySiteNotesField({ control }: DeploySiteNotesFieldProps) {
  return (
    <FormField
      control={control}
      name="deployment_notes"
      render={({ field }) => (
        <FormItem>
          <FormFieldLayout
            label="Deployment Notes (Optional)"
            description="Internal notes about this deployment"
          >
            <FormControl>
              <Textarea
                placeholder="Any notes about the deployment..."
                className="min-h-20"
                {...field}
              />
            </FormControl>
          </FormFieldLayout>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
