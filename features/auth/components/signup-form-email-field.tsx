'use client'

import { Mail, X, Loader2 } from 'lucide-react'
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

interface SignupEmailFieldProps {
  control: Control<SignupInput>
  loading: boolean
  setValue: UseFormSetValue<SignupInput>
}

export function SignupEmailField({ control, loading, setValue }: SignupEmailFieldProps) {
  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormFieldLayout label="Email">
            <FormControl>
              <InputGroup>
                <InputGroupAddon>
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Mail className="size-4" />
                  )}
                </InputGroupAddon>
                <InputGroupInput
                  type="email"
                  placeholder="you@example.com"
                  {...field}
                  disabled={loading}
                />
                {field.value && !loading && (
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      onClick={() => setValue('email', '')}
                      aria-label="Clear email"
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
