'use client'

import { useActionState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { updateSiteAction } from '../api/mutations'
import { EditSiteStatusFieldsNative } from './edit-site-status-fields-native'
import { EditSiteDeploymentFieldsNative } from './edit-site-deployment-fields-native'
import { EditSiteSubmitButton } from './edit-site-submit-button'
import type { Database } from '@/lib/types/database.types'
import { AlertCircle } from 'lucide-react'

type ClientSite = Database['public']['Tables']['client_site']['Row']

interface EditSiteFormProps {
  site: ClientSite
  siteId: string
}

export function EditSiteForm({ site, siteId }: EditSiteFormProps): React.JSX.Element {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const errorSummaryRef = useRef<HTMLDivElement>(null)

  const [state, formAction, isPending] = useActionState<
    { error: string; fieldErrors?: Record<string, string[]> } | { error: null } | null,
    FormData
  >(updateSiteAction, null)

  // Focus management: Move focus to error summary when errors occur
  useEffect(() => {
    if (state?.error && errorSummaryRef.current) {
      errorSummaryRef.current.focus()
    }
  }, [state?.error])

  // Refresh on successful update
  useEffect(() => {
    if (state && 'error' in state && state.error === null) {
      router.refresh()
    }
  }, [state, router])

  return (
    <div className="space-y-6">
      {/* Screen reader announcement for form status */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isPending && 'Form is submitting, please wait'}
        {!isPending && state && 'error' in state && state.error === null && 'Changes saved successfully'}
      </div>

      {/* Error Summary - WCAG 2.1 Requirement */}
      {state?.error && (
        <Alert
          ref={errorSummaryRef}
          variant="destructive"
          aria-live="assertive"
          tabIndex={-1}
        >
          <AlertCircle className="size-4" aria-hidden="true" />
          <AlertTitle>Unable to save site</AlertTitle>
          <AlertDescription>
            {state.error}
            {state.fieldErrors && Object.keys(state.fieldErrors).length > 0 && (
              <ul className="mt-2 list-disc pl-5">
                {Object.entries(state.fieldErrors).map(([field, errors]) => (
                  <li key={field}>
                    <strong>{field}:</strong> {errors[0]}
                  </li>
                ))}
              </ul>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="rounded-lg border p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Edit Site</h2>
            <p className="text-sm text-muted-foreground">Update site status and deployment information</p>
          </div>

          <form ref={formRef} action={formAction} className="space-y-6" aria-busy={isPending}>
            {/* Hidden field for site_id */}
            <input type="hidden" name="site_id" value={siteId} />

            <EditSiteStatusFieldsNative
              siteName={site.site_name}
              currentStatus={site.status}
              errors={state && 'fieldErrors' in state ? state.fieldErrors : undefined}
              isPending={isPending}
            />

            <EditSiteDeploymentFieldsNative
              deploymentUrl={site.deployment_url}
              customDomain={site.custom_domain}
              deploymentNotes={site.deployment_notes}
              errors={state && 'fieldErrors' in state ? state.fieldErrors : undefined}
              isPending={isPending}
            />

            <div className="flex gap-2">
              <EditSiteSubmitButton />
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
    </div>
  )
}
