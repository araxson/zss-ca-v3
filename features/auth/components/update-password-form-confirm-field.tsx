'use client'

import { Lock, Eye, EyeOff } from 'lucide-react'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/components/ui/input-group'
import type { Control } from 'react-hook-form'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'

interface UpdatePasswordConfirmFieldProps {
  control: Control<{ password: string; confirmPassword: string }>
  loading: boolean
  showConfirmPassword: boolean
  setShowConfirmPassword: (show: boolean) => void
}

export function UpdatePasswordConfirmField({
  control,
  loading,
  showConfirmPassword,
  setShowConfirmPassword,
}: UpdatePasswordConfirmFieldProps) {
  return (
    <FormField
      control={control}
      name="confirmPassword"
      render={({ field }) => (
        <FormItem>
          <FormFieldLayout label="Confirm Password">
            <FormControl>
              <InputGroup>
                <InputGroupAddon>
                  <Lock className="size-4" />
                </InputGroupAddon>
                <InputGroupInput
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  {...field}
                  disabled={loading}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </InputGroupButton>
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
