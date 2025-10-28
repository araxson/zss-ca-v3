'use client'

import { Lock, Eye, EyeOff } from 'lucide-react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/components/ui/input-group'
import type { Control } from 'react-hook-form'
import type { SignupInput } from '../schema'

interface SignupConfirmPasswordFieldProps {
  control: Control<SignupInput>
  loading: boolean
  showConfirmPassword: boolean
  setShowConfirmPassword: (show: boolean) => void
}

export function SignupConfirmPasswordField({
  control,
  loading,
  showConfirmPassword,
  setShowConfirmPassword,
}: SignupConfirmPasswordFieldProps) {
  return (
    <FormField
      control={control}
      name="confirmPassword"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Confirm Password</FormLabel>
          <FormControl>
            <InputGroup>
              <InputGroupAddon>
                <Lock className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...field}
                disabled={loading}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
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
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
