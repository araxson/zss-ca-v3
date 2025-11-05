'use client'

import { useMemo, useState } from 'react'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Users, ChevronsUpDown, Check } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/index'
import type { Database } from '@/lib/types/database.types'

type Client = {
  id: string
  contact_name: string | null
  contact_email: string | null
  company_name: string | null
}

type Plan = Database['public']['Tables']['plan']['Row']

interface CreateSiteClientFieldsNativeProps {
  clients: Client[]
  plans: Plan[]
  errors?: Record<string, string[]>
  isPending: boolean
}

export function CreateSiteClientFieldsNative({
  clients,
  plans,
  errors,
  isPending
}: CreateSiteClientFieldsNativeProps): React.JSX.Element {
  const [selectedClient, setSelectedClient] = useState<string>('')
  const [clientOpen, setClientOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [planOpen, setPlanOpen] = useState(false)

  const clientLabel = useMemo(() => {
    if (!selectedClient) return 'Select a client'
    const client = clients.find((c) => c.id === selectedClient)
    if (!client) return 'Select a client'
    return client.company_name || client.contact_name || client.contact_email || 'Select a client'
  }, [selectedClient, clients])

  const planLabel = useMemo(() => {
    if (!selectedPlan) return 'Select a plan (optional)'
    const plan = plans.find((p) => p.id === selectedPlan)
    return plan?.name ?? 'Select a plan (optional)'
  }, [selectedPlan, plans])

  return (
    <FieldSet className="space-y-4">
      <FieldLegend>Client assignment</FieldLegend>
      <FieldDescription>Select who this project belongs to and the service plan.</FieldDescription>
      <FieldGroup className="space-y-4">
        <Alert>
          <Users className="size-4" aria-hidden="true" />
          <AlertTitle>{clients.length} clients available</AlertTitle>
          <AlertDescription>Choose the account that owns this website project.</AlertDescription>
        </Alert>

        <Field data-invalid={!!errors?.['profile_id']}>
          <FieldLabel htmlFor="profile_id">
            Client
            <span className="text-destructive" aria-label="required"> *</span>
          </FieldLabel>
          <Popover open={clientOpen} onOpenChange={(open) => !isPending && setClientOpen(open)}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={clientOpen}
                aria-controls="client-command-list"
                aria-invalid={!!errors?.['profile_id']}
                aria-describedby={errors?.['profile_id'] ? 'profile_id-error profile_id-hint' : 'profile_id-hint'}
                disabled={isPending}
                className={cn('w-full justify-between', selectedClient ? 'text-foreground' : 'text-muted-foreground')}
              >
                {clientLabel}
                <ChevronsUpDown className="ml-2 size-4 opacity-50" aria-hidden="true" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <Command shouldFilter={false} aria-label="Select client">
                <CommandInput placeholder="Search clients..." aria-label="Search clients" />
                <CommandList id="client-command-list">
                  <CommandEmpty>No client found.</CommandEmpty>
                  <CommandGroup>
                    {clients.map((client) => {
                      const value = client.id
                      const label = client.company_name || client.contact_name || client.contact_email || 'Unknown client'
                      return (
                        <CommandItem
                          key={value}
                          value={value}
                          onSelect={(current) => {
                            const nextValue = current === selectedClient ? '' : current
                            setSelectedClient(nextValue)
                            setClientOpen(false)
                          }}
                        >
                          <Check
                            className={cn('mr-2 size-4', selectedClient === value ? 'opacity-100' : 'opacity-0')}
                            aria-hidden="true"
                          />
                          {label}
                          {client.contact_email && (
                            <span className="ml-2 text-xs text-muted-foreground">{client.contact_email}</span>
                          )}
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <input type="hidden" name="profile_id" value={selectedClient} required />
          <FieldDescription id="profile_id-hint">
            The client who will own this website
          </FieldDescription>
          <FieldError errors={errors?.['profile_id']?.map(msg => ({ message: msg }))} />
        </Field>

        <Field data-invalid={!!errors?.['plan_id']}>
          <FieldLabel htmlFor="plan_id">Plan (Optional)</FieldLabel>
          <Popover open={planOpen} onOpenChange={(open) => !isPending && setPlanOpen(open)}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={planOpen}
                aria-controls="plan-command-list"
                aria-invalid={!!errors?.['plan_id']}
                aria-describedby={errors?.['plan_id'] ? 'plan_id-error plan_id-hint' : 'plan_id-hint'}
                disabled={isPending}
                className={cn('w-full justify-between', selectedPlan ? 'text-foreground' : 'text-muted-foreground')}
              >
                {planLabel}
                <ChevronsUpDown className="ml-2 size-4 opacity-50" aria-hidden="true" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <Command shouldFilter={false} aria-label="Select plan">
                <CommandInput placeholder="Search plans..." aria-label="Search plans" />
                <CommandList id="plan-command-list">
                  <CommandEmpty>No plans found.</CommandEmpty>
                  <CommandGroup>
                    {plans.map((plan) => (
                      <CommandItem
                        key={plan.id}
                        value={plan.id}
                        onSelect={(current) => {
                          const nextValue = current === selectedPlan ? '' : current
                          setSelectedPlan(nextValue)
                          setPlanOpen(false)
                        }}
                      >
                        <Check
                          className={cn('mr-2 size-4', selectedPlan === plan.id ? 'opacity-100' : 'opacity-0')}
                          aria-hidden="true"
                        />
                        {plan.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <input type="hidden" name="plan_id" value={selectedPlan} />
          <FieldDescription id="plan_id-hint">
            The service plan for this website (leave empty if not assigned yet)
          </FieldDescription>
          <FieldError errors={errors?.['plan_id']?.map(msg => ({ message: msg }))} />
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
