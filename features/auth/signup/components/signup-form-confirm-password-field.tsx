'use client'

import { Lock, Eye, EyeOff } from 'lucide-react'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Input } from '@/components/ui/input'
import type { Control } from 'react-hook-form'
import type { SignupInput } from '../api/schema'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'

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
          <FormFieldLayout label="Confirm Password">
            <FormControl>
              <ButtonGroup className="w-full">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-r-none bg-muted hover:bg-muted hover:text-muted-foreground"
                  disabled={loading}
                  aria-label="Confirm password"
                >
                  <Lock className="size-4" />
                </Button>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              </ButtonGroup>
            </FormControl>
          </FormFieldLayout>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
