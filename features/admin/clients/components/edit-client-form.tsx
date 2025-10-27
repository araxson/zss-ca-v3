'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Building2, Phone } from 'lucide-react'
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
} from '@/components/ui/input-group'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { updateClientProfileSchema, type UpdateClientProfileInput } from '../schema'
import { updateClientProfileAction } from '../api/mutations'
import type { Database } from '@/lib/types/database.types'

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
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Edit Client Information</CardTitle>
        <CardDescription>
          Update client contact details and company information
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Unable to update client</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldSet className="space-y-4">
          <FieldLegend>Contact information</FieldLegend>
          <FieldDescription>
            Update the client details that appear in admin and client portals.
          </FieldDescription>
          <FieldGroup className="space-y-4">
            <Item variant="outline" size="sm">
              <ItemMedia>
                <User className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{client.contact_name || 'Client'}</ItemTitle>
                <ItemDescription>{client.contact_email}</ItemDescription>
              </ItemContent>
            </Item>
            <FormField
              control={form.control}
              name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputGroupAddon>
                            <User className="size-4" />
                          </InputGroupAddon>
                          <InputGroupInput {...field} />
                        </InputGroup>
                      </FormControl>
                      <FormDescription>
                        Client&apos;s full name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputGroupAddon>
                            <Building2 className="size-4" />
                          </InputGroupAddon>
                          <InputGroupInput {...field} />
                        </InputGroup>
                      </FormControl>
                      <FormDescription>
                        Client&apos;s company or business name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputGroupAddon>
                            <Phone className="size-4" />
                          </InputGroupAddon>
                          <InputGroupInput type="tel" {...field} />
                        </InputGroup>
                      </FormControl>
                      <FormDescription>
                        Contact phone number
                      </FormDescription>
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
      </CardContent>
    </Card>
  )
}
