'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Form } from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { updateSiteSchema, type UpdateSiteInput } from '../api/schema'
import { updateSiteAction } from '../api/mutations'
import { EditSiteStatusFields } from './edit-site-status-fields'
import { EditSiteDeploymentFields } from './edit-site-deployment-fields'
import type { Database } from '@/lib/types/database.types'

type ClientSite = Database['public']['Tables']['client_site']['Row']

interface EditSiteFormProps {
  site: ClientSite
  siteId: string
}

export function EditSiteForm({ site, siteId }: EditSiteFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const form = useForm<UpdateSiteInput>({
    resolver: zodResolver(updateSiteSchema),
    defaultValues: {
      site_name: site.site_name,
      status: site.status,
      deployment_url: site.deployment_url || '',
      custom_domain: site.custom_domain || '',
      deployment_notes: site.deployment_notes || '',
    },
  })

  async function onSubmit(data: UpdateSiteInput) {
    setError(null)
    const result = await updateSiteAction(siteId, data)

    if (result.error) {
      setError(result.error)
      return
    }

    router.refresh()
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive" aria-live="assertive">
          <AlertTitle>Unable to save site</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="rounded-lg border p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Edit Site</h2>
            <p className="text-sm text-muted-foreground">Update site status and deployment information</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <EditSiteStatusFields form={form} siteName={site.site_name} currentStatus={site.status} />
              <EditSiteDeploymentFields form={form} />
              <div className="flex gap-2">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? <Spinner /> : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={form.formState.isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
