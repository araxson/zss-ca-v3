'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { replyToTicketSchema, type ReplyToTicketInput } from '../schema'
import { replyToTicketAction } from '../api/mutations'

interface ReplyFormProps {
  ticketId: string
}

export function ReplyForm({ ticketId }: ReplyFormProps) {
  const router = useRouter()
  const form = useForm<ReplyToTicketInput>({
    resolver: zodResolver(replyToTicketSchema),
    defaultValues: {
      ticketId,
      message: '',
    },
  })

  async function onSubmit(data: ReplyToTicketInput) {
    const result = await replyToTicketAction(data)

    if (result.error) {
      toast.error('Failed to send reply', {
        description: result.error,
      })
    } else {
      toast.success('Reply sent successfully')
      form.reset({ ticketId, message: '' })
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Reply</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldSet className="space-y-3">
              <FieldLegend>Reply message</FieldLegend>
              <FieldGroup>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Reply</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your reply here..."
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

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Sending...' : 'Send Reply'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
