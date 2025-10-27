'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Mail, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from '@/components/ui/input-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { resetPasswordSchema, type ResetPasswordInput } from '../schema'
import { resetPasswordAction } from '../api/mutations'
import { ROUTES } from '@/lib/constants/routes'

export function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(data: ResetPasswordInput) {
    setLoading(true)
    setError(null)

    try {
      const result = await resetPasswordAction(data)

      if (result.error) {
        setError(result.error)
        toast.error('Failed to send verification code', {
          description: result.error,
        })
      } else if (result.success) {
        toast.success('Verification code sent!', {
          description: result.message,
        })
        // Redirect to OTP verification page
        router.push(`${ROUTES.VERIFY_OTP}?email=${encodeURIComponent(data.email)}&type=password_reset`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      toast.error('Failed to send verification code', {
        description: message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FieldSet className="space-y-3">
          <FieldLegend>Account email</FieldLegend>
          <FieldDescription>We&apos;ll send a verification code to this address.</FieldDescription>
          <FieldGroup>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
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
                            onClick={() => form.setValue('email', '')}
                            aria-label="Clear email"
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
          </FieldGroup>
        </FieldSet>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Spinner /> : 'Send verification code'}
        </Button>

        <FieldGroup className="items-center justify-center gap-2">
          <Field orientation="horizontal" className="w-full items-center justify-center gap-2">
            <FieldDescription>Remember your password?</FieldDescription>
            <ButtonGroup>
              <Button asChild variant="link" size="sm">
                <Link href={ROUTES.LOGIN}>Sign in</Link>
              </Button>
            </ButtonGroup>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  )
}
