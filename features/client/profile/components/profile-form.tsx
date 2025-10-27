'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Phone, Globe, User, Building2, MapPin } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
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
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { updateProfileAction } from '../api/mutations'
import { updateProfileSchema, type UpdateProfileInput } from '../schema'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Tables']['profile']['Row']

interface ProfileFormProps {
  profile: Profile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      contact_name: profile.contact_name || '',
      contact_email: profile.contact_email || '',
      contact_phone: profile.contact_phone || '',
      company_name: profile.company_name || '',
      company_website: profile.company_website || '',
      address_line1: profile.address_line1 || '',
      address_line2: profile.address_line2 || '',
      city: profile.city || '',
      region: profile.region || '',
      postal_code: profile.postal_code || '',
      country: profile.country || '',
      marketing_opt_in: profile.marketing_opt_in ?? false,
    },
  })

  async function onSubmit(data: UpdateProfileInput) {
    setError(null)
    setSuccess(null)

    const result = await updateProfileAction(data)

    if (result.error) {
      setError(result.error)
      return
    }

    setSuccess('Profile updated successfully')
    router.refresh()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Profile update failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertTitle>Profile updated</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <FieldSet className="space-y-4">
          <FieldLegend>Contact details</FieldLegend>
          <FieldGroup className="space-y-4">
            <FormField
              control={form.control}
              name="contact_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <User className="size-4" />
                      </InputGroupAddon>
                      <InputGroupInput {...field} placeholder="John Doe" />
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <Mail className="size-4" />
                      </InputGroupAddon>
                      <InputGroupInput {...field} type="email" placeholder="john@example.com" />
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <Phone className="size-4" />
                      </InputGroupAddon>
                      <InputGroupInput {...field} type="tel" placeholder="+1 (555) 123-4567" />
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldGroup>
        </FieldSet>

        <FieldSet className="space-y-4">
          <FieldLegend>Company information</FieldLegend>
          <FieldGroup className="space-y-4">
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <Building2 className="size-4" />
                      </InputGroupAddon>
                      <InputGroupInput {...field} placeholder="Acme Inc." />
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company_website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Website</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldGroup>
        </FieldSet>

        <FieldSet className="space-y-4">
          <FieldLegend>Business address</FieldLegend>
          <FieldGroup className="space-y-4">
            <FormField
              control={form.control}
              name="address_line1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <MapPin className="size-4" />
                      </InputGroupAddon>
                      <InputGroupInput {...field} placeholder="123 Main St" />
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address_line2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Suite 100" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Toronto" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Province/State</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ON" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="M5H 2N2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Canada" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FieldGroup>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Preferences</FieldLegend>
          <FieldGroup>
            <FormField
              control={form.control}
              name="marketing_opt_in"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Marketing Communications</FormLabel>
                    <FormDescription>
                      Receive emails about new features, updates, and promotions
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </FieldGroup>
        </FieldSet>

        <ButtonGroup>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Spinner /> : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={form.formState.isSubmitting}
            onClick={() => form.reset()}
          >
            Reset
          </Button>
        </ButtonGroup>
      </form>
    </Form>
  )
}
