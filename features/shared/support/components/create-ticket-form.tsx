'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import { Form } from '@/components/ui/form'
import {
  FieldDescription,
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
import { createTicketSchema, type CreateTicketInput } from '../schema'
import { createTicketAction } from '../api/mutations'
import { ROUTES } from '@/lib/constants/routes'
import { CreateTicketSubjectField } from './create-ticket-subject-field'
import { CreateTicketRoutingFields } from './create-ticket-routing-fields'
import { CreateTicketMessageField } from './create-ticket-message-field'

export function CreateTicketForm() {
  const router = useRouter()
  const form = useForm<CreateTicketInput>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      subject: '',
      message: '',
      category: 'general_inquiry',
      priority: 'medium',
    },
  })

  async function onSubmit(data: CreateTicketInput) {
    const result = await createTicketAction(data)

    if (result.error) {
      toast.error('Failed to create ticket', {
        description: result.error,
      })
    } else {
      toast.success('Ticket created successfully', {
        description: 'We will respond to your ticket as soon as possible.',
      })
      form.reset()
      router.push(ROUTES.CLIENT_SUPPORT)
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Support Ticket</CardTitle>
        <CardDescription>We&apos;ll respond to your ticket as soon as possible</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldSet className="space-y-4">
              <FieldLegend>Ticket summary</FieldLegend>
              <FieldGroup className="space-y-4">
                <CreateTicketSubjectField control={form.control} />
              </FieldGroup>
            </FieldSet>

            <FieldSet className="space-y-4">
              <FieldLegend>Routing details</FieldLegend>
              <FieldDescription>Select the category and urgency so support can triage faster.</FieldDescription>
              <FieldGroup className="grid gap-6 sm:grid-cols-2">
                <CreateTicketRoutingFields control={form.control} />
              </FieldGroup>
            </FieldSet>

            <CreateTicketMessageField
              control={form.control}
              handleSubmit={form.handleSubmit}
              onSubmit={onSubmit}
            />

            <ButtonGroup>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? <Spinner /> : 'Create Ticket'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
