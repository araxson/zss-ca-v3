'use client'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Item, ItemContent } from '@/components/ui/item'
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'
import { Users } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'
import type { UseFormReturn } from 'react-hook-form'
import type { CreateSiteInput } from '../api/schema'

type Client = {
  id: string
  contact_name: string | null
  contact_email: string | null
  company_name: string | null
}

type Plan = Database['public']['Tables']['plan']['Row']

interface CreateSiteClientFieldsProps {
  form: UseFormReturn<CreateSiteInput>
  clients: Client[]
  plans: Plan[]
}

export function CreateSiteClientFields({ form, clients, plans }: CreateSiteClientFieldsProps): React.JSX.Element {
  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Client assignment</FieldLegend>
      <FieldDescription>Select who this project belongs to and the service plan.</FieldDescription>
      <FieldGroup className="space-y-4">
        <Item variant="outline" size="sm">
          <ItemContent>
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 size-4 text-muted-foreground" aria-hidden="true" />
              <div>
                <div className="font-medium">{clients.length} clients available</div>
                <div className="text-sm text-muted-foreground">Choose the account that owns this website project.</div>
              </div>
            </div>
          </ItemContent>
        </Item>
        <FormField
          control={form.control}
          name="profile_id"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout label="Client" description="The client who will own this website">
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.contact_name || client.contact_email}
                        {client.company_name && ` · ${client.company_name}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldLayout>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="plan_id"
          render={({ field }) => (
            <FormItem>
              <FormFieldLayout
                label="Plan (Optional)"
                description="The service plan for this website (leave empty if not assigned yet)"
              >
                <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plan (optional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldLayout>
              <FormMessage />
            </FormItem>
          )}
        />
      </FieldGroup>
    </FieldSet>
  )
}
