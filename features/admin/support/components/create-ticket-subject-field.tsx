'use client'

import { MessageSquare } from 'lucide-react'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'
import type { Control } from 'react-hook-form'
import type { CreateTicketInput } from '../api/schema'

interface CreateTicketSubjectFieldProps {
  control: Control<CreateTicketInput>
}

export function CreateTicketSubjectField({ control }: CreateTicketSubjectFieldProps): React.JSX.Element {
  return (
    <FormField
      control={control}
      name="subject"
      render={({ field }) => (
        <FormItem>
          <FormFieldLayout label="Subject">
            <FormControl>
              <InputGroup>
                <InputGroupAddon>
                  <MessageSquare className="size-4" />
                </InputGroupAddon>
                <InputGroupInput placeholder="Brief description of your issue" {...field} />
              </InputGroup>
            </FormControl>
          </FormFieldLayout>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
