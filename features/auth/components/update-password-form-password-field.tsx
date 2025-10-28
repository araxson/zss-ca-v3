'use client'

import { Lock, Eye, EyeOff } from 'lucide-react'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
  InputGroupText,
} from '@/components/ui/input-group'
import { Progress } from '@/components/ui/progress'
import { getPasswordStrengthPercentage } from '@/lib/utils/password-strength'
import type { Control } from 'react-hook-form'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'

interface UpdatePasswordFieldProps {
  control: Control<{ password: string; confirmPassword: string }>
  loading: boolean
  showPassword: boolean
  setShowPassword: (show: boolean) => void
  passwordStrength: { score: number; feedback: string; color: string }
}

export function UpdatePasswordField({
  control,
  loading,
  showPassword,
  setShowPassword,
  passwordStrength,
}: UpdatePasswordFieldProps) {
  return (
    <FormField
      control={control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormFieldLayout label="New Password">
            <FormControl>
              <InputGroup>
                <InputGroupAddon>
                  <Lock className="size-4" />
                </InputGroupAddon>
                <InputGroupInput
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  {...field}
                  disabled={loading}
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </FormControl>
          </FormFieldLayout>
          {field.value && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormDescription>{passwordStrength.feedback}</FormDescription>
                <InputGroupText className="text-xs">
                  {passwordStrength.score}/7
                </InputGroupText>
              </div>
              <Progress
                value={getPasswordStrengthPercentage(passwordStrength.score)}
                className="h-1"
              />
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
