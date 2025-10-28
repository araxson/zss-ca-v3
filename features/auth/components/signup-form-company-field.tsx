'use client'

import { Building2, X } from 'lucide-react'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/components/ui/input-group'
import type { Control, UseFormSetValue } from 'react-hook-form'
import type { SignupInput } from '../schema'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'

interface SignupCompanyFieldProps {
  control: Control<SignupInput>
  loading: boolean
  setValue: UseFormSetValue<SignupInput>
}

export function SignupCompanyField({ control, loading, setValue }: SignupCompanyFieldProps) {
  return (
    <FormField
      control={control}
      name="companyName"
      render={({ field }) => (
        <FormItem>
          <FormFieldLayout label="Company Name (Optional)">
            <FormControl>
              <InputGroup>
                <InputGroupAddon>
                  <Building2 className="size-4" />
                </InputGroupAddon>
                <InputGroupInput
                  type="text"
                  placeholder="Your Company Inc."
                  {...field}
                  disabled={loading}
                />
                {field.value && !loading && (
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      onClick={() => setValue('companyName', '')}
                      aria-label="Clear company name"
                    >
                      <X className="size-4" />
                    </InputGroupButton>
                  </InputGroupAddon>
                )}
              </InputGroup>
            </FormControl>
          </FormFieldLayout>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
