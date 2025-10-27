'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createNotificationSchema, type CreateNotificationInput } from '../schema'
import { createNotificationAction } from '../api/mutations'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ROUTES } from '@/lib/constants/routes'
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'

type CreateNotificationFormProps = {
  clients: Array<{
    id: string
    contact_name: string | null
    contact_email: string | null
  }>
}

export function CreateNotificationForm({ clients }: CreateNotificationFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateNotificationInput>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: {
      profile_id: '',
      notification_type: 'system',
      title: '',
      body: null,
      action_url: null,
      expires_at: null,
      metadata: {},
    },
  })

  async function onSubmit(data: CreateNotificationInput) {
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await createNotificationAction(data)

      if (result.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      form.reset()
      router.push(ROUTES.ADMIN_NOTIFICATIONS)
    } catch (_error) {
      setError('An unexpected error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Notification</CardTitle>
        <CardDescription>
          Send a custom notification to a client. This will appear in their dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldSet className="space-y-4">
              <FieldLegend>Recipient & Type</FieldLegend>
              <FieldDescription>Choose who receives this notification and how it is categorized.</FieldDescription>
              <FieldGroup className="space-y-4">
                <FormField
                  control={form.control}
                  name="profile_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recipient</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.contact_name || client.contact_email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notification_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="subscription">Subscription</SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                          <SelectItem value="site_status">Site Status</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                          <SelectItem value="onboarding">Onboarding</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <FieldSet className="space-y-4">
              <FieldLegend>Content</FieldLegend>
              <FieldGroup className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Notification title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Notification message"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>Additional details for the notification</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <FieldSet className="space-y-4">
              <FieldLegend>Follow-up</FieldLegend>
              <FieldDescription>Provide optional destination links or expiration rules.</FieldDescription>
              <FieldGroup className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4">
                <FormField
                  control={form.control}
                  name="action_url"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Action URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>Link for users to take action</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expires_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expires At (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>Notification will auto-hide after this date</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Notification'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
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
