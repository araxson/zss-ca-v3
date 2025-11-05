'use client'

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Item, ItemContent } from '@/components/ui/item'
import { Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { Globe } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'
import { formatStatus } from '@/features/shared/utils'

const siteStatuses: Array<Database['public']['Enums']['site_status']> = [
  'pending',
  'in_production',
  'awaiting_client_content',
  'ready_for_review',
  'live',
  'paused',
  'archived',
]

interface EditSiteStatusFieldsNativeProps {
  siteName: string
  currentStatus: string
  errors?: Record<string, string[]>
  isPending: boolean
}

export function EditSiteStatusFieldsNative({
  siteName,
  currentStatus,
  errors,
  isPending
}: EditSiteStatusFieldsNativeProps): React.JSX.Element {
  return (
    <FieldSet className="space-y-4" disabled={isPending} aria-busy={isPending}>
      <FieldLegend>Project status</FieldLegend>
      <FieldDescription>Keep the deployment record current for your team.</FieldDescription>
      <FieldGroup className="space-y-4">
        <Item variant="outline" size="sm">
          <ItemContent>
            <div className="font-medium">{siteName}</div>
            <div className="text-sm text-muted-foreground">Currently marked as {formatStatus(currentStatus)}</div>
          </ItemContent>
        </Item>

        <Field>
          <FieldLabel htmlFor="site_name">Site Name</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Globe className="size-4" aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              id="site_name"
              name="site_name"
              defaultValue={siteName}
              required
              aria-invalid={errors?.['site_name'] ? 'true' : 'false'}
              aria-describedby={errors?.['site_name'] ? 'site_name-error' : undefined}
            />
          </InputGroup>
          {errors?.['site_name'] && (
            <FieldError id="site_name-error">{errors['site_name'][0]}</FieldError>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="status">Status</FieldLabel>
          <FieldDescription>Current project status</FieldDescription>
          <Select
            name="status"
            defaultValue={currentStatus}
            required
            disabled={isPending}
          >
            <SelectTrigger
              id="status"
              aria-invalid={errors?.['status'] ? 'true' : 'false'}
              aria-describedby={errors?.['status'] ? 'status-error' : undefined}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {siteStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {formatStatus(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.['status'] && (
            <FieldError id="status-error">{errors['status'][0]}</FieldError>
          )}
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
