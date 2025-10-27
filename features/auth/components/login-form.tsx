'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { toast } from 'sonner'
import { Mail, Lock, Eye, EyeOff, X, Loader2 } from 'lucide-react'
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
import { loginSchema, type LoginInput } from '../schema'
import { loginAction } from '../api/mutations'
import { ROUTES } from '@/lib/constants/routes'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginInput) {
    setLoading(true)
    setError(null)

    try {
      const result = await loginAction(data)

      if (result?.error) {
        setError(result.error)
        toast.error('Login failed', {
          description: result.error,
        })
        setLoading(false)
      }
      // If no error, redirect() was called and will handle navigation
    } catch (err) {
      // Check if this is a Next.js redirect (expected behavior)
      if (err instanceof Error && err.message.includes('NEXT_REDIRECT')) {
        // This is expected - redirect is working
        return
      }

      // Only show error for actual errors
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      toast.error('Login failed', {
        description: message,
      })
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

        <FieldSet className="space-y-4">
          <FieldLegend>Sign in to your account</FieldLegend>
          <FieldDescription>Enter the credentials associated with your subscription.</FieldDescription>
          <FieldGroup className="space-y-4">
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <Lock className="size-4" />
                      </InputGroupAddon>
                      <InputGroupInput
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldGroup>
        </FieldSet>

        <ButtonGroup className="justify-end">
          <Button asChild variant="link" size="sm">
            <Link href={ROUTES.RESET_PASSWORD}>Forgot password?</Link>
          </Button>
        </ButtonGroup>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Spinner /> : 'Sign in'}
        </Button>

        <FieldGroup className="items-center justify-center gap-2">
          <Field orientation="horizontal" className="w-full items-center justify-center gap-2">
            <FieldDescription>Don&apos;t have an account?</FieldDescription>
            <ButtonGroup>
              <Button asChild variant="link" size="sm">
                <Link href={ROUTES.SIGNUP}>Sign up</Link>
              </Button>
            </ButtonGroup>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  )
}
