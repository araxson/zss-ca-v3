'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { createSiteAction } from '../api/mutations'
import { CreateSiteClientFieldsNative } from './create-site-client-fields-native'
import { CreateSiteDetailFieldsNative } from './create-site-detail-fields-native'
import { SubmitButton } from './create-site-form-submit-button'
import type { Database } from '@/lib/types/database.types'
import { ROUTES } from '@/lib/constants/routes'

type Client = {
  id: string
  contact_name: string | null
  contact_email: string | null
  company_name: string | null
}

type Plan = Database['public']['Tables']['plan']['Row']

interface CreateSiteFormProps {
  clients: Client[]
  plans: Plan[]
}

export function CreateSiteForm({ clients, plans }: CreateSiteFormProps): React.JSX.Element {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState<
    { error: string; fieldErrors?: Record<string, string[]> } | { error: null; data: { id: string } } | null,
    FormData
  >(createSiteAction, null)
  const fieldErrors = state && 'fieldErrors' in state ? state.fieldErrors : undefined
  const errorMessage = state && 'error' in state ? state.error : null
  const errorSummaryRef = useRef<HTMLDivElement>(null)

  // Toast feedback and redirect on state change
  useEffect(() => {
    if (!isPending && state) {
      if (state.error) {
        toast.error('Failed to create site', {
          description: state.error,
        })
      } else if ('data' in state && state.data) {
        toast.success('Site created', {
          description: 'The website project has been created successfully.',
        })
        router.push(ROUTES.ADMIN_SITES)
        router.refresh()
      }
    }
    return undefined
  }, [state, isPending, router])

  useEffect(() => {
    if (errorMessage && errorSummaryRef.current) {
      errorSummaryRef.current.focus()
    }
  }, [errorMessage])

  return (
    <div className="space-y-6">
      {/* Screen reader announcement for form status */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPending && 'Form is submitting, please wait'}
        {!isPending && state && 'data' in state && 'Site created successfully'}
      </div>

      <div className="rounded-lg border p-6">
        {errorMessage && (
          <Alert
            ref={errorSummaryRef}
            variant="destructive"
            aria-live="assertive"
            tabIndex={-1}
            className="mb-6"
          >
            <AlertTitle>Unable to create site</AlertTitle>
            <AlertDescription>
              {errorMessage}
              {fieldErrors && Object.keys(fieldErrors).length > 0 && (
                <ul className="mt-2 list-disc pl-5">
                  {Object.entries(fieldErrors).map(([field, errors]) => (
                    <li key={field}>
                      <strong>{field}:</strong> {errors[0]}
                    </li>
                  ))}
                </ul>
              )}
            </AlertDescription>
          </Alert>
        )}

        <form action={formAction} className="space-y-6" aria-busy={isPending}>
          <CreateSiteClientFieldsNative
            clients={clients}
            plans={plans}
            errors={fieldErrors}
            isPending={isPending}
          />
          <CreateSiteDetailFieldsNative
            errors={fieldErrors}
            isPending={isPending}
          />
          <div className="flex gap-2">
            <SubmitButton />
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
