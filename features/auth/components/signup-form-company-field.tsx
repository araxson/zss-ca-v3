'use client'

import { Building2, X } from 'lucide-react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/components/ui/input-group'
import type { Control, UseFormSetValue } from 'react-hook-form'
import type { SignupInput } from '../schema'

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
          <FormLabel>Company Name (Optional)</FormLabel>
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
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
