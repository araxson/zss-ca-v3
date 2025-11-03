'use client'

import { Lock, Eye, EyeOff } from 'lucide-react'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { getPasswordStrengthPercentage } from '@/lib/utils/password-strength'
import type { Control } from 'react-hook-form'
import type { SignupInput } from '../api/schema'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'

interface SignupPasswordFieldProps {
  control: Control<SignupInput>
  loading: boolean
  showPassword: boolean
  setShowPassword: (show: boolean) => void
  passwordStrength: { score: number; feedback: string; color: string }
}

export function SignupPasswordField({
  control,
  loading,
  showPassword,
  setShowPassword,
  passwordStrength,
}: SignupPasswordFieldProps) {
  return (
    <FormField
      control={control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormFieldLayout label="Password">
            <FormControl>
              <ButtonGroup className="w-full">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-r-none bg-muted hover:bg-muted hover:text-muted-foreground"
                  disabled={loading}
                  aria-label="Password"
                >
                  <Lock className="size-4" />
                </Button>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="rounded-none border-r bg-background/50"
                  {...field}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-l-none border-l text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              </ButtonGroup>
            </FormControl>
          </FormFieldLayout>
          {field.value && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormDescription>{passwordStrength.feedback}</FormDescription>
                <span className="text-xs text-muted-foreground">
                  {passwordStrength.score}/7
                </span>
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
