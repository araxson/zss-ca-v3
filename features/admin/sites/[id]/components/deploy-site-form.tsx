'use client'

import { useActionState, useEffect, useId, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Rocket, AlertCircle } from 'lucide-react'
import { deploySiteAction } from '../api/mutations'
import { DeploySiteUrlFieldNative } from './deploy-site-url-field-native'
import { DeploySiteNotesFieldNative } from './deploy-site-notes-field-native'

interface DeploySiteFormProps {
  siteId: string
  siteName: string
  isLive: boolean
}

type DeployState = { error: string; fieldErrors?: Record<string, string[]> } | { error: null } | null

export function DeploySiteForm({ siteId, siteName, isLive }: DeploySiteFormProps): React.JSX.Element {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const errorSummaryRef = useRef<HTMLDivElement>(null)
  const formId = useId()
  const [dialogOpen, setDialogOpen] = useState(false)

  const [state, formAction, isPending] = useActionState<DeployState, FormData>(deploySiteAction, null)

  const fieldErrors = state && 'fieldErrors' in state ? state.fieldErrors : undefined
  const errorMessage = state && 'error' in state && state.error ? state.error : null
  const isSuccess = state && 'error' in state && state.error === null

  useEffect(() => {
    if (!state || !('error' in state)) return

    if (state.error) {
      toast.error('Deployment failed', {
        description: state.error,
      })
      if (errorSummaryRef.current) {
        errorSummaryRef.current.focus()
      }
      return
    }

    toast.success('Site deployed', {
      description: `${siteName} has been successfully deployed and is now live.`,
    })

    formRef.current?.reset()
    router.refresh()
  }, [state, router, siteName])

  if (isLive) {
    return (
      <div className="rounded-lg border p-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Site Already Live</h2>
          <p className="text-sm text-muted-foreground">
            This site has already been deployed. Use the edit form to update the deployment URL.
          </p>
          <p className="text-sm text-muted-foreground">
            Update deployment details from the edit panel if you need to change URLs or notes.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border p-6">
      <div className="space-y-6">
        {/* Screen reader announcement for form status */}
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {isPending && 'Deploying site, please wait'}
          {!isPending && isSuccess && 'Site deployed successfully'}
          {errorMessage && `Deployment failed: ${errorMessage}`}
        </div>

        <div className="flex items-start gap-3">
          <Rocket className="size-5 text-primary" aria-hidden="true" />
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Deploy Site</h2>
            <p className="text-sm text-muted-foreground">Deploy {siteName} and make it live for the client</p>
          </div>
        </div>

        {errorMessage && (
          <Alert
            ref={errorSummaryRef}
            variant="destructive"
            aria-live="assertive"
            tabIndex={-1}
          >
            <AlertCircle className="size-4" aria-hidden="true" />
            <AlertTitle>Unable to deploy site</AlertTitle>
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

        <form
          ref={formRef}
          id={formId}
          action={formAction}
          className="space-y-6"
          aria-busy={isPending}
        >
          <input type="hidden" name="site_id" value={siteId} />

          <FieldSet className="space-y-4" disabled={isPending}>
            <FieldLegend>Deployment metadata</FieldLegend>
            <FieldDescription>Confirm the live URL and capture any launch notes.</FieldDescription>
            <FieldGroup className="space-y-4">
              <div className="rounded-md border bg-muted/30 p-4">
                <p className="text-sm font-medium">{siteName}</p>
                <p className="text-sm text-muted-foreground">
                  Provide the production URL and optional launch notes.
                </p>
              </div>
              <DeploySiteUrlFieldNative
                errors={fieldErrors}
                isPending={isPending}
              />
              <DeploySiteNotesFieldNative
                errors={fieldErrors}
                isPending={isPending}
              />
            </FieldGroup>
          </FieldSet>
        </form>

        <AlertDialog open={dialogOpen} onOpenChange={(open) => !isPending && setDialogOpen(open)}>
          <AlertDialogTrigger asChild>
            <Button type="button" disabled={isPending} onClick={() => setDialogOpen(true)}>
              <Rocket className="mr-2 size-4" aria-hidden="true" />
              Deploy Site
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Deploy {siteName}?</AlertDialogTitle>
              <AlertDialogDescription>
                This will mark the site as live and send a notification email to the client. The site status will be
                changed to &quot;Live&quot;.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  type="submit"
                  form={formId}
                  disabled={isPending}
                  aria-busy={isPending}
                  onClick={() => setDialogOpen(false)}
                >
                  {isPending ? (
                    <>
                      <Spinner />
                      <span className="ml-2">Deploying...</span>
                    </>
                  ) : (
                    'Deploy Now'
                  )}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
