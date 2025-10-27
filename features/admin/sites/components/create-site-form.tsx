'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Globe } from 'lucide-react'
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
import { createSiteSchema, type CreateSiteInput } from '../schema'
import { createSiteAction } from '../api/mutations'
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

export function CreateSiteForm({ clients, plans }: CreateSiteFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const form = useForm({
    resolver: zodResolver(createSiteSchema),
    defaultValues: {
      profile_id: '',
      site_name: '',
      plan_id: '',
      subscription_id: '',
      design_brief: { notes: '' },
    },
  })

  async function onSubmit(data: CreateSiteInput) {
    setError(null)
    const result = await createSiteAction(data)

    if (result.error) {
      setError(result.error)
      return
    }

    form.reset()
    router.push(ROUTES.ADMIN_SITES)
    router.refresh()
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Create New Site</CardTitle>
        <CardDescription>
          Set up a new website project for a client
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Unable to create site</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldSet className="space-y-4">
              <FieldLegend>Client assignment</FieldLegend>
              <FieldDescription>Select who this project belongs to and the service plan.</FieldDescription>
              <FieldGroup className="space-y-4">
                <FormField
                  control={form.control}
                  name="profile_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.contact_name || client.contact_email}
                                {client.company_name && ` · ${client.company_name}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        The client who will own this website
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="plan_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan (Optional)</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a plan (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {plans.map((plan) => (
                              <SelectItem key={plan.id} value={plan.id}>
                                {plan.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        The service plan for this website (leave empty if not assigned yet)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <FieldSet className="space-y-4">
              <FieldLegend>Project details</FieldLegend>
              <FieldDescription>Name the project and capture the brief before kickoff.</FieldDescription>
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
                          <InputGroupInput placeholder="My Business Website" {...field} />
                        </InputGroup>
                      </FormControl>
                      <FormDescription>
                        A descriptive name for the website project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="design_brief"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Design Brief</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter design requirements, brand references, and success criteria..."
                          className="min-h-32"
                          value={typeof field.value?.notes === 'string' ? field.value.notes : ''}
                          onChange={(event) =>
                            field.onChange({ notes: event.target.value })
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Design requirements and client preferences
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <div className="flex gap-2">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Creating...' : 'Create Site'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
