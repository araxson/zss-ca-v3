'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Building2, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
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
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import type { Database } from '@/lib/types/database.types'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'
import { updateClientProfileSchema, type UpdateClientProfileInput } from '../api/schema'
import { updateClientProfileAction } from '../api/mutations'

type Profile = Database['public']['Tables']['profile']['Row']

interface EditClientFormProps {
  client: Profile
}

export function EditClientForm({ client }: EditClientFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const form = useForm<UpdateClientProfileInput>({
    resolver: zodResolver(updateClientProfileSchema),
    defaultValues: {
      profileId: client.id,
      fullName: client.contact_name || '',
      company: client.company_name || '',
      phone: client.contact_phone || '',
    },
  })

  async function onSubmit(data: UpdateClientProfileInput) {
    setError(null)
    const result = await updateClientProfileAction(data)

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
          <AlertTitle>Unable to update client</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Item variant="outline">
        <ItemContent className="basis-full">
          <div className="space-y-6 p-6">
            <div className="space-y-1">
              <ItemTitle>Edit Client Information</ItemTitle>
              <ItemDescription>
                Update client contact details and company information
              </ItemDescription>
            </div>
            <Item variant="outline" size="sm">
              <ItemMedia>
                <User className="size-4 text-muted-foreground" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{client.contact_name || 'Client'}</ItemTitle>
                <ItemDescription>{client.contact_email}</ItemDescription>
              </ItemContent>
            </Item>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FieldSet className="space-y-4">
                  <FieldLegend>Contact information</FieldLegend>
                  <FieldDescription>
                    Update the client details that appear in admin and client portals.
                  </FieldDescription>
                  <FieldGroup className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormFieldLayout label="Full Name" description="Client's full name">
                            <FormControl>
                              <InputGroup>
                                <InputGroupAddon>
                                  <User className="size-4" />
                                </InputGroupAddon>
                                <InputGroupInput {...field} />
                              </InputGroup>
                            </FormControl>
                          </FormFieldLayout>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormFieldLayout
                            label="Company Name"
                            description="Client's company or business name"
                          >
                            <FormControl>
                              <InputGroup>
                                <InputGroupAddon>
                                  <Building2 className="size-4" />
                                </InputGroupAddon>
                                <InputGroupInput {...field} />
                              </InputGroup>
                            </FormControl>
                          </FormFieldLayout>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormFieldLayout label="Phone Number" description="Contact phone number">
                            <FormControl>
                              <InputGroup>
                                <InputGroupAddon>
                                  <Phone className="size-4" />
                                </InputGroupAddon>
                                <InputGroupInput type="tel" {...field} />
                              </InputGroup>
                            </FormControl>
                          </FormFieldLayout>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </FieldGroup>
                </FieldSet>

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
        </ItemContent>
      </Item>
    </div>
  )
}
