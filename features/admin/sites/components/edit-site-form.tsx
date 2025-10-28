'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Globe, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
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
  return status
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
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
    <ItemGroup className="space-y-6">
      <SectionHeader
        title="Edit Site Details"
        description="Update site information and status"
        align="start"
      />

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Unable to save site</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Item variant="outline" className="p-6">
        <ItemContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FieldSet className="space-y-4">
            <FieldLegend>Project status</FieldLegend>
            <FieldDescription>Keep the deployment record current for your team.</FieldDescription>
            <FieldGroup className="space-y-4">
              <Item variant="outline" size="sm">
                <ItemContent>
                  <ItemTitle>{site.site_name}</ItemTitle>
                  <ItemDescription>
                    Currently marked as {formatStatusLabel(site.status)}
                  </ItemDescription>
                </ItemContent>
              </Item>

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
                          onChange={(event) => field.onChange(event.target.value)}
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
                          onChange={(event) => field.onChange(event.target.value)}
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
            </FieldGroup>
          </FieldSet>

          <FieldSet className="space-y-4">
            <FieldLegend>Handoff notes</FieldLegend>
            <FieldDescription>
              Capture deployment notes, upgrade tasks, or pending follow-ups.
            </FieldDescription>
            <FieldGroup className="space-y-4">
              <FormField
                control={form.control}
                name="deployment_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add context for the next deployment or client communication..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FieldGroup>
              </FieldSet>

              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Spinner /> : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </ItemContent>
      </Item>
    </ItemGroup>
  )
}
