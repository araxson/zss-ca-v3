'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Form } from '@/components/ui/form'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { deploySiteSchema, type DeploySiteInput } from '../api/schema'
import { deploySiteAction } from '../api/mutations'
import { Rocket } from 'lucide-react'
import { DeploySiteUrlField } from './deploy-site-url-field'
import { DeploySiteNotesField } from './deploy-site-notes-field'

interface DeploySiteFormProps {
  siteId: string
  siteName: string
  isLive: boolean
}

export function DeploySiteForm({ siteId, siteName, isLive }: DeploySiteFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const form = useForm<DeploySiteInput>({
    resolver: zodResolver(deploySiteSchema),
    defaultValues: {
      deployment_url: '',
      deployment_notes: '',
    },
  })

  async function onSubmit(data: DeploySiteInput) {
    setError(null)
    const result = await deploySiteAction(siteId, data)

    if (result.error) {
      setError(result.error)
      return
    }

    form.reset()
    router.refresh()
  }

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
        <div className="flex items-start gap-3">
          <Rocket className="size-5 text-primary" aria-hidden="true" />
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Deploy Site</h2>
            <p className="text-sm text-muted-foreground">Deploy {siteName} and make it live for the client</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" aria-live="assertive">
            <AlertTitle>Deployment failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldSet className="space-y-4">
              <FieldLegend>Deployment metadata</FieldLegend>
              <FieldDescription>Confirm the live URL and capture any launch notes.</FieldDescription>
              <FieldGroup className="space-y-4">
                <div className="rounded-md border bg-muted/30 p-4">
                  <p className="text-sm font-medium">{siteName}</p>
                  <p className="text-sm text-muted-foreground">
                    Provide the production URL and optional launch notes.
                  </p>
                </div>
                <DeploySiteUrlField control={form.control} />
                <DeploySiteNotesField control={form.control} />
              </FieldGroup>
            </FieldSet>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" disabled={form.formState.isSubmitting}>
                  <Rocket className="mr-2 size-4" />
                  Deploy Site
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Deploy {siteName}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will mark the site as live and send a notification email to the client.
                    The site status will be changed to &quot;Live&quot;.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>
                    {form.formState.isSubmitting ? <Spinner /> : 'Deploy Now'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </form>
        </Form>
      </div>
    </div>
  )
}
