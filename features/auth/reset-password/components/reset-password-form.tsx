'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Form } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Item } from '@/components/ui/item'
import { FieldGroup } from '@/components/ui/field'
import { resetPasswordSchema, type ResetPasswordInput } from '../api/schema'
import { resetPasswordAction } from '../api/mutations'
import { ROUTES } from '@/lib/constants/routes'
import { ResetPasswordEmailField } from './reset-password-form-email-field'

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
    <div className="flex flex-col gap-6 items-center">
      <Item variant="outline" className="overflow-hidden bg-card max-w-7xl w-full">
        <div className="grid p-0 md:grid-cols-2 gap-0 w-full">
          <FieldGroup className="gap-6 p-6 md:p-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-semibold">Reset your password</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Enter your email address and we&apos;ll send you a verification code.
              </p>
            </div>

            {error ? (
              <Alert variant="destructive" aria-live="assertive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FieldGroup className="gap-4">
                  <ResetPasswordEmailField control={form.control} loading={loading} />
                </FieldGroup>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Spinner /> : 'Send verification code'}
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="text-muted-foreground">Remember your password?</span>
                  <Button asChild variant="link" size="sm">
                    <Link href={ROUTES.LOGIN}>Sign in</Link>
                  </Button>
                </div>
              </form>
            </Form>
          </FieldGroup>

          <div className="bg-muted relative hidden md:flex items-center rounded-md justify-center text-center">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Account Recovery</h2>
              <p className="text-muted-foreground text-sm text-balance">
                Secure your account by resetting your password. A verification code will be sent to your email address.
              </p>
            </div>
          </div>
        </div>
      </Item>

      <p className="text-center text-sm text-muted-foreground">
        By continuing you agree to our{' '}
        <Link href={ROUTES.PRIVACY}>Privacy Policy</Link>{' '}
        and{' '}
        <Link href={ROUTES.TERMS}>Terms of Service</Link>.
      </p>
    </div>
  )
}
