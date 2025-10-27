'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Globe, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { updateSiteSchema, type UpdateSiteInput } from '../schema'
import { updateSiteAction } from '../api/mutations'
import type { Database } from '@/lib/types/database.types'

type ClientSite = Database['public']['Tables']['client_site']['Row']

interface EditSiteFormProps {
  site: ClientSite
  siteId: string
}

const siteStatuses: Array<Database['public']['Enums']['site_status']> = [
  'pending',
  'in_production',
  'awaiting_client_content',
  'ready_for_review',
  'live',
  'paused',
  'archived',
]

function formatStatusLabel(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
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
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Edit Site Details</CardTitle>
        <CardDescription>
          Update site information and status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Unable to save site</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldSet className="space-y-4">
              <FieldLegend>Project status</FieldLegend>
              <FieldDescription>Keep the deployment record current for your team.</FieldDescription>
              <FieldGroup className="space-y-4">
                <FormField
                  control={form.control}
                  name="site_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputGroupAddon>
                            <Globe className="size-4" />
                          </InputGroupAddon>
                          <InputGroupInput {...field} />
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {siteStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {formatStatusLabel(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Current project status
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <FieldSet className="space-y-4">
              <FieldLegend>Deployment access</FieldLegend>
              <FieldDescription>
                Track where the site is hosted and any custom domain mappings.
              </FieldDescription>
              <FieldGroup className="space-y-4">
                <FormField
                  control={form.control}
                  name="deployment_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deployment URL</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            placeholder="example.com"
                            className="!pl-1"
                            value={field.value?.replace(/^https?:\/\//i, '') || ''}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                          <InputGroupAddon>
                            <InputGroupText>https://</InputGroupText>
                          </InputGroupAddon>
                          <InputGroupAddon align="inline-end">
                            <Link2 className="size-4" />
                          </InputGroupAddon>
                        </InputGroup>
                      </FormControl>
                      <FormDescription>
                        The live URL where the site is deployed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="custom_domain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Domain</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            placeholder="example.com"
                            className="!pl-1"
                            value={field.value?.replace(/^https?:\/\//i, '') || ''}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                          <InputGroupAddon>
                            <InputGroupText>https://</InputGroupText>
                          </InputGroupAddon>
                          <InputGroupAddon align="inline-end">
                            <Globe className="size-4" />
                          </InputGroupAddon>
                        </InputGroup>
                      </FormControl>
                      <FormDescription>
                        Custom domain if different from deployment URL
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deployment_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deployment Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Internal notes about deployment..."
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <div className="flex gap-2">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
