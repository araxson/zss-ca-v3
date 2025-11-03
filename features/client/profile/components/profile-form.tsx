'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Form } from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { updateProfileAction } from '../api/mutations'
import { updateProfileSchema, type UpdateProfileInput } from '../api/schema'
import type { Database } from '@/lib/types/database.types'
import { ProfileContactFields } from './profile-contact-fields'
import { ProfileCompanyFields } from './profile-company-fields'
import { ProfileAddressFields } from './profile-address-fields'
import { ProfilePreferencesFields } from './profile-preferences-fields'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

type Profile = Database['public']['Tables']['profile']['Row']

interface ProfileFormProps {
  profile: Profile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      contact_name: profile.contact_name || '',
      contact_email: profile.contact_email || '',
      contact_phone: profile.contact_phone || '',
      company_name: profile.company_name || '',
      company_website: profile.company_website || '',
      address_line1: profile.address_line1 || '',
      address_line2: profile.address_line2 || '',
      city: profile.city || '',
      region: profile.region || '',
      postal_code: profile.postal_code || '',
      country: profile.country || '',
      marketing_opt_in: profile.marketing_opt_in ?? false,
    },
  })

  async function onSubmit(data: UpdateProfileInput) {
    setError(null)
    setSuccess(null)

    const result = await updateProfileAction(data)

    if (result.error) {
      setError(result.error)
      return
    }

    setSuccess('Profile updated successfully')
    router.refresh()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive" aria-live="assertive">
            <AlertCircle className="size-4" aria-hidden="true" />
            <AlertTitle>Profile update failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CheckCircle2 className="size-4" aria-hidden="true" />
            <AlertTitle>Profile updated</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <ProfileContactFields form={form} />
        <ProfileCompanyFields form={form} />
        <ProfileAddressFields form={form} />
        <ProfilePreferencesFields form={form} />

        <div className="flex gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Spinner /> : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={form.formState.isSubmitting}
            onClick={() => form.reset()}
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  )
}
