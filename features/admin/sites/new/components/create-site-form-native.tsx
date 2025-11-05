'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { createSiteAction } from '../api/mutations'
import { CreateSiteClientFieldsNative } from './create-site-client-fields-native'
import { CreateSiteDetailFieldsNative } from './create-site-detail-fields-native'
import { CreateSiteSubmitButton } from './create-site-submit-button'
import { Button } from '@/components/ui/button'
import type { Database } from '@/lib/types/database.types'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import { useEffect } from 'react'

type Client = {
  id: string
  contact_name: string | null
  contact_email: string | null
  company_name: string | null
}

type Plan = Database['public']['Tables']['plan']['Row']

interface CreateSiteFormNativeProps {
  clients: Client[]
  plans: Plan[]
}

export function CreateSiteFormNative({ clients, plans }: CreateSiteFormNativeProps): React.JSX.Element {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createSiteAction, null)

  // Redirect on success
  useEffect(() => {
    if (state && 'data' in state && state.error === null) {
      router.push(ROUTES.ADMIN_SITES)
      router.refresh()
    }
  }, [state, router])

  return (
    <div className="space-y-6">
      {/* Screen reader announcement for form status */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPending && 'Form is submitting, please wait'}
        {!isPending && state?.error && state.error}
      </div>

      {/* Error summary for accessibility */}
      {state && 'fieldErrors' in state && state.fieldErrors && Object.keys(state.fieldErrors).length > 0 && (
        <div
          role="alert"
          className="bg-destructive/10 border border-destructive p-4 rounded-md"
          tabIndex={-1}
        >
          <h2 className="font-semibold text-destructive mb-2">
            There are {Object.keys(state.fieldErrors).length} errors in the form
          </h2>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(state.fieldErrors).map(([field, messages]) => (
              <li key={field}>
                <a
                  href={`#${field}`}
                  className="text-destructive underline hover:no-underline"
                >
                  {field}: {(messages as string[])[0]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {state && 'error' in state && state.error && !('fieldErrors' in state) && (
        <Alert variant="destructive" aria-live="assertive">
          <AlertCircle className="size-4" aria-hidden="true" />
          <AlertTitle>Unable to create site</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state && 'data' in state && state.error === null && !isPending && (
        <Alert>
          <CheckCircle2 className="size-4" aria-hidden="true" />
          <AlertTitle>Site created</AlertTitle>
          <AlertDescription>The site has been created successfully. Redirecting...</AlertDescription>
        </Alert>
      )}

      <div className="rounded-lg border p-6">
        <form action={formAction} className="space-y-6">
          <CreateSiteClientFieldsNative
            clients={clients}
            plans={plans}
            errors={state && 'fieldErrors' in state ? state.fieldErrors : undefined}
            isPending={isPending}
          />
          <CreateSiteDetailFieldsNative
            errors={state && 'fieldErrors' in state ? state.fieldErrors : undefined}
            isPending={isPending}
          />
          <div className="flex gap-2">
            <CreateSiteSubmitButton />
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
