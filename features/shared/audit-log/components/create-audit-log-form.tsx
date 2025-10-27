'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createAuditLogSchema, type CreateAuditLogInput } from '../schema'
import { createAuditLogAction } from '../api/mutations'
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

type CreateAuditLogFormProps = {
  clients?: Array<{
    id: string
    contact_name: string | null
    contact_email: string | null
  }>
}

const commonTables = [
  'profile',
  'client_site',
  'subscription',
  'plan',
  'support_ticket',
  'notification',
  'site_analytics',
]

export function CreateAuditLogForm({ clients = [] }: CreateAuditLogFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [changeSummary, setChangeSummary] = useState('{}')

  const form = useForm<CreateAuditLogInput>({
    resolver: zodResolver(createAuditLogSchema),
    defaultValues: {
      profile_id: null,
      action: '',
      resource_table: '',
      resource_id: null,
      change_summary: {},
    },
  })

  async function onSubmit(data: CreateAuditLogInput) {
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    try {
      // Parse change_summary JSON
      let parsedSummary = {}
      try {
        parsedSummary = JSON.parse(changeSummary)
      } catch {
        setError('Invalid JSON in change summary')
        setIsSubmitting(false)
        return
      }

      const result = await createAuditLogAction({
        ...data,
        change_summary: parsedSummary,
      })

      if (result.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      setSuccess(true)
      form.reset()
      setChangeSummary('{}')
      setIsSubmitting(false)

      // Redirect after 2 seconds
      setTimeout(() => {
        router.refresh()
      }, 1500)
    } catch (err) {
      setError('An unexpected error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Manual Audit Log</CardTitle>
        <CardDescription>
          Document manual changes or external system integrations
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
            <AlertDescription>Audit log created successfully</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {clients.length > 0 && (
              <FormField
                control={form.control}
                name="profile_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Related User (Optional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
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
            )}

            <FormField
              control={form.control}
              name="action"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Action</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., manual_update, external_import" {...field} />
                  </FormControl>
                  <FormDescription>
                    Describe the action taken (e.g., manual_update, data_correction)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resource_table"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resource Table</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select table" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {commonTables.map((table) => (
                        <SelectItem key={table} value={table}>
                          {table}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>The database table affected</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resource_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resource ID (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="UUID or record ID"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    The specific record ID that was modified
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Change Summary (JSON)</FormLabel>
              <Textarea
                value={changeSummary}
                onChange={(e) => setChangeSummary(e.target.value)}
                placeholder='{"before": {...}, "after": {...}, "reason": "..."}'
                rows={6}
                className="font-mono text-sm"
              />
              <FormDescription>
                JSON object describing what changed (before/after values, reason, etc.)
              </FormDescription>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Audit Log'}
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
