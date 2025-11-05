'use client'

import { Link2 } from 'lucide-react'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'
import type { Control } from 'react-hook-form'
import type { DeploySiteInput } from '../api/schema'

interface DeploySiteUrlFieldProps {
  control: Control<DeploySiteInput>
}

export function DeploySiteUrlField({ control }: DeploySiteUrlFieldProps): React.JSX.Element {
  return (
    <FormField
      control={control}
      name="deployment_url"
      render={({ field }) => (
        <FormItem>
          <FormFieldLayout
            label="Deployment URL"
            description="The live URL where the site is now accessible"
          >
            <FormControl>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  placeholder="example.com"
                  className="!pl-1"
                  value={field.value?.replace(/^https?:\/\//i, '') || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                />
                <InputGroupAddon>
                  <InputGroupText>https://</InputGroupText>
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <Link2 className="size-4" />
                </InputGroupAddon>
              </InputGroup>
            </FormControl>
          </FormFieldLayout>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
