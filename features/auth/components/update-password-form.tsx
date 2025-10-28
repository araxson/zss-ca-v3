'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Form } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import { updatePasswordAction } from '../api/mutations'
import { ROUTES } from '@/lib/constants/routes'
import { calculatePasswordStrength } from '@/lib/utils/password-strength'
import { UpdatePasswordField } from './update-password-form-password-field'
import { UpdatePasswordConfirmField } from './update-password-form-confirm-field'

const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>

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
      <Alert variant="destructive">
        <AlertDescription>
          Invalid password reset link. Please request a new verification code.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FieldSet className="space-y-4">
          <FieldLegend>Create a new password</FieldLegend>
          <FieldDescription>
            Use at least 8 characters with upper and lowercase letters and a number.
          </FieldDescription>
          <FieldGroup className="space-y-4">
            <Item variant="outline" size="sm">
              <ItemMedia>
                <Mail className="size-4 text-muted-foreground" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{email}</ItemTitle>
                <ItemDescription>
                  Password will be updated for this account
                </ItemDescription>
              </ItemContent>
            </Item>

            <UpdatePasswordField
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
        </FieldSet>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Spinner /> : 'Update password'}
        </Button>
      </form>
    </Form>
  )
}
