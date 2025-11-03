'use client'

import { Mail } from 'lucide-react'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import type { Control } from 'react-hook-form'
import type { SignupInput } from '../api/schema'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'

interface SignupEmailFieldProps {
  control: Control<SignupInput>
  loading: boolean
}

export function SignupEmailField({ control, loading }: SignupEmailFieldProps) {
  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormFieldLayout label="Email">
            <FormControl>
              <ButtonGroup className="w-full">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-r-none bg-muted hover:bg-muted hover:text-muted-foreground"
                  disabled={loading}
                  aria-label="Email"
                >
                  {loading ? <Spinner className="size-4" /> : <Mail className="size-4" />}
                </Button>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="rounded-r-md bg-background/50"
                  {...field}
                  disabled={loading}
                />
              </ButtonGroup>
            </FormControl>
          </FormFieldLayout>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
