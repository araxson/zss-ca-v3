'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Form } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FieldGroup } from '@/components/ui/field'
import { Item } from '@/components/ui/item'
import { updatePasswordAction } from '../api/mutations'
import { ROUTES } from '@/lib/constants/routes'
import { calculatePasswordStrength } from '@/lib/utils/password-strength'
import { UpdatePasswordPasswordField } from './update-password-form-password-field'
import { UpdatePasswordConfirmField } from './update-password-form-confirm-field'
import { updatePasswordSchema, type UpdatePasswordInput } from '../api/schema'

export function UpdatePasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(calculatePasswordStrength(''))
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  const form = useForm<UpdatePasswordInput>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const password = form.watch('password')

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password))
  }, [password])

  async function onSubmit(data: UpdatePasswordInput) {
    if (!email) {
      setError('Email is required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await updatePasswordAction({
        email,
        password: data.password,
      })

      if (result.error) {
        setError(result.error)
        toast.error('Failed to update password', {
          description: result.error,
        })
      } else if (result.success) {
        toast.success('Password updated!', {
          description: result.message,
        })
        router.push(ROUTES.LOGIN)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      toast.error('Failed to update password', {
        description: message,
      })
    } finally {
      setLoading(false)
    }
  }

  if (!email) {
    return (
      <Alert variant="destructive" aria-live="assertive">
        <AlertDescription>
          Invalid password reset link. Please request a new verification code.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex flex-col gap-6 items-center">
      <Item variant="outline" className="overflow-hidden bg-card max-w-7xl w-full">
        <div className="grid p-0 md:grid-cols-2 gap-0 w-full">
          <FieldGroup className="gap-6 p-6 md:p-8">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-semibold">Update your password</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Create a new password for your account to keep it secure.
              </p>
            </div>

            {error && (
              <Alert variant="destructive" aria-live="assertive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FieldGroup className="gap-4">
                  <UpdatePasswordPasswordField
                    control={form.control}
                    loading={loading}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    passwordStrength={passwordStrength}
                  />

                  <UpdatePasswordConfirmField
                    control={form.control}
                    loading={loading}
                    showConfirmPassword={showConfirmPassword}
                    setShowConfirmPassword={setShowConfirmPassword}
                  />
                </FieldGroup>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Spinner /> : 'Update password'}
                </Button>
              </form>
            </Form>
          </FieldGroup>

          <div className="bg-muted relative hidden md:flex items-center rounded-md justify-center text-center">
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Security Matters</h2>
              <p className="text-muted-foreground text-sm text-balance">
                Use a strong password with uppercase, lowercase, numbers, and symbols to protect your account.
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
