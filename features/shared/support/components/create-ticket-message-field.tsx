'use client'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Kbd } from '@/components/ui/kbd'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'
import type { Control, UseFormHandleSubmit } from 'react-hook-form'
import type { CreateTicketInput } from '../api/schema'

interface CreateTicketMessageFieldProps {
  control: Control<CreateTicketInput>
  handleSubmit: UseFormHandleSubmit<CreateTicketInput>
  onSubmit: (data: CreateTicketInput) => Promise<void>
}

export function CreateTicketMessageField({ control, handleSubmit, onSubmit }: CreateTicketMessageFieldProps) {
  return (
    <FormField
      control={control}
      name="message"
      render={({ field }) => (
        <FormItem>
          <FormFieldLayout
            label="Message"
            description={
              <>
                <span>Include any relevant details, error messages, or screenshots</span>
                <span className="flex items-center gap-1 text-xs">
                  Press <Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd> to submit
                </span>
              </>
            }
          >
            <FormControl>
              <Textarea
                placeholder="Please provide as much detail as possible"
                className="min-h-40"
                {...field}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault()
                    handleSubmit(onSubmit)()
                  }
                }}
              />
            </FormControl>
          </FormFieldLayout>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
