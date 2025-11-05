'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createTicketAction } from '../api/mutations'
import { ROUTES } from '@/lib/constants/routes'
import { SubmitButton } from './create-ticket-submit-button'
import { useEffect } from 'react'

export function CreateTicketForm(): React.JSX.Element {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(createTicketAction, {
    error: null,
    success: true,
    ticketId: '',
    fieldErrors: {},
  })

  // Helper function to safely access field errors
  const getFieldError = (fieldName: string): string[] | undefined => {
    if (state?.fieldErrors && fieldName in state.fieldErrors) {
      return (state.fieldErrors as Record<string, string[]>)[fieldName]
    }
    return undefined
  }

  useEffect(() => {
    if (!isPending && state) {
      if (state.error && !state.success) {
        toast.error('Failed to create ticket', {
          description: state.error,
        })
      } else if (state.success) {
        toast.success('Ticket created successfully', {
          description: 'Redirecting to support dashboard...',
        })
        // Redirect on success
        const timer = setTimeout(() => {
          router.push(ROUTES.CLIENT_SUPPORT)
        }, 1500)
        return () => clearTimeout(timer)
      }
    }
    return undefined
  }, [state, isPending, router])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Support Ticket</CardTitle>
        <CardDescription>We&apos;ll respond to your ticket as soon as possible</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Screen reader announcement for form status */}
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {isPending && 'Form is submitting, please wait'}
          {state?.success && 'Ticket created successfully'}
        </div>

        <form action={formAction} className="space-y-4">
          <FieldSet className="space-y-4">
            <FieldLegend>Ticket summary</FieldLegend>
            <FieldGroup className="space-y-4">
              <div>
                <Label htmlFor="subject">
                  Subject
                  <span className="text-destructive" aria-label="required"> *</span>
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  aria-required="true"
                  aria-invalid={!!getFieldError('subject')}
                  aria-describedby={getFieldError('subject') ? 'subject-error' : undefined}
                  disabled={isPending}
                  placeholder="Brief description of the issue"
                  minLength={5}
                  maxLength={200}
                />
                <FieldError errors={getFieldError('subject')?.map(msg => ({ message: msg }))} />
              </div>
            </FieldGroup>
          </FieldSet>

          <FieldSet className="space-y-4">
            <FieldLegend>Routing details</FieldLegend>
            <FieldDescription>Select the category and urgency so support can triage faster.</FieldDescription>
            <FieldGroup className="grid gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="category">
                  Category
                  <span className="text-destructive" aria-label="required"> *</span>
                </Label>
                <Select name="category" defaultValue="general_inquiry" required disabled={isPending}>
                  <SelectTrigger
                    id="category"
                    aria-required="true"
                    aria-invalid={!!getFieldError('category')}
                    aria-describedby={getFieldError('category') ? 'category-error' : undefined}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general_inquiry">General Inquiry</SelectItem>
                    <SelectItem value="technical_support">Technical Support</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="feature_request">Feature Request</SelectItem>
                    <SelectItem value="bug_report">Bug Report</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError errors={getFieldError('category')?.map(msg => ({ message: msg }))} />
              </div>

              <div>
                <Label htmlFor="priority">
                  Priority
                  <span className="text-destructive" aria-label="required"> *</span>
                </Label>
                <Select name="priority" defaultValue="medium" required disabled={isPending}>
                  <SelectTrigger
                    id="priority"
                    aria-required="true"
                    aria-invalid={!!getFieldError('priority')}
                    aria-describedby={getFieldError('priority') ? 'priority-error' : undefined}
                  >
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError errors={getFieldError('priority')?.map(msg => ({ message: msg }))} />
              </div>
            </FieldGroup>
          </FieldSet>

          <FieldSet className="space-y-4">
            <FieldLegend>Message</FieldLegend>
            <FieldGroup>
              <div>
                <Label htmlFor="message">
                  Describe your issue
                  <span className="text-destructive" aria-label="required"> *</span>
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  aria-required="true"
                  aria-invalid={!!getFieldError('message')}
                  aria-describedby={getFieldError('message') ? 'message-error message-hint' : 'message-hint'}
                  disabled={isPending}
                  placeholder="Provide as much detail as possible..."
                  className="min-h-32"
                  minLength={20}
                  maxLength={5000}
                />
                <p id="message-hint" className="text-sm text-muted-foreground mt-1">
                  Include steps to reproduce, expected behavior, and actual behavior if applicable.
                </p>
                {getFieldError('message') && (
                  <p id="message-error" className="text-sm text-destructive mt-1" role="alert">
                    {getFieldError('message')?.[0]}
                  </p>
                )}
              </div>
            </FieldGroup>
          </FieldSet>

          <div className="flex gap-2">
            <SubmitButton />
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
