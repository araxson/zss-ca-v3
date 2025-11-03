'use client'

import { Building2 } from 'lucide-react'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Input } from '@/components/ui/input'
import type { Control } from 'react-hook-form'
import type { SignupInput } from '../api/schema'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'

interface SignupCompanyFieldProps {
  control: Control<SignupInput>
  loading: boolean
}

export function SignupCompanyField({ control, loading }: SignupCompanyFieldProps) {
  return (
    <FormField
      control={control}
      name="companyName"
      render={({ field }) => (
        <FormItem>
          <FormFieldLayout label="Company Name (Optional)">
            <FormControl>
              <ButtonGroup className="w-full">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-r-none bg-muted hover:bg-muted hover:text-muted-foreground"
                  disabled={loading}
                  aria-label="Company"
                >
                  <Building2 className="size-4" />
                </Button>
                <Input
                  type="text"
                  placeholder="Your Company Inc."
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
