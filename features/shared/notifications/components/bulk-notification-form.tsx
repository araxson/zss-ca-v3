'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { bulkCreateNotificationSchema, type BulkCreateNotificationInput } from '../schema'
import { bulkCreateNotificationAction } from '../api/mutations'
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
import { Users } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'

export function BulkNotificationForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<BulkCreateNotificationInput>({
    resolver: zodResolver(bulkCreateNotificationSchema),
    defaultValues: {
      notification_type: 'system',
      title: '',
      body: null,
      action_url: null,
      expires_at: null,
      metadata: {},
    },
  })

  async function onSubmit(data: BulkCreateNotificationInput) {
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    try {
      const result = await bulkCreateNotificationAction(data)

      if (result.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      setSuccess(`Successfully sent notification to ${result.count} client(s)`)
      form.reset()
      setIsSubmitting(false)

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push(ROUTES.ADMIN_NOTIFICATIONS)
      }, 2000)
    } catch (_error) {
      setError('An unexpected error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <CardTitle>Send to All Clients</CardTitle>
        </div>
        <CardDescription>
          This notification will be sent to all active clients in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldSet className="space-y-4">
              <FieldLegend>Broadcast type</FieldLegend>
              <FieldGroup>
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
              <FieldDescription>Optionally include a link and expiration for this announcement.</FieldDescription>
              <FieldGroup className="grid gap-4 sm:grid-cols-2">
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
                {isSubmitting ? 'Sending...' : 'Send to All Clients'}
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
