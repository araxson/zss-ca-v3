'use client'

import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { Globe, Link2 } from 'lucide-react'

interface EditSiteDeploymentFieldsNativeProps {
  deploymentUrl?: string | null
  customDomain?: string | null
  deploymentNotes?: string | null
  errors?: Record<string, string[]>
  isPending: boolean
}

export function EditSiteDeploymentFieldsNative({
  deploymentUrl,
  customDomain,
  deploymentNotes,
  errors,
  isPending
}: EditSiteDeploymentFieldsNativeProps): React.JSX.Element {
  // Strip https:// prefix from URLs for display
  const cleanDeploymentUrl = deploymentUrl?.replace(/^https?:\/\//i, '') || ''
  const cleanCustomDomain = customDomain?.replace(/^https?:\/\//i, '') || ''

  return (
    <>
      <FieldSet className="space-y-4" disabled={isPending} aria-busy={isPending}>
        <FieldLegend>Deployment access</FieldLegend>
        <FieldDescription>Track where the site is hosted and any custom domain mappings.</FieldDescription>
        <FieldGroup className="space-y-4">
          <Field>
            <FieldLabel htmlFor="deployment_url">Deployment URL</FieldLabel>
            <FieldDescription>The live URL where the site is deployed</FieldDescription>
            <InputGroup>
              <InputGroupInput
                id="deployment_url"
                name="deployment_url"
                placeholder="example.com"
                className="!pl-1"
                defaultValue={cleanDeploymentUrl}
                aria-invalid={errors?.['deployment_url'] ? 'true' : 'false'}
                aria-describedby={errors?.['deployment_url'] ? 'deployment_url-error' : undefined}
              />
              <InputGroupAddon>
                <InputGroupText>https://</InputGroupText>
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <Link2 className="size-4" aria-hidden="true" />
              </InputGroupAddon>
            </InputGroup>
            {errors?.['deployment_url'] && (
              <FieldError id="deployment_url-error">{errors['deployment_url'][0]}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="custom_domain">Custom Domain</FieldLabel>
            <FieldDescription>Custom domain if different from deployment URL</FieldDescription>
            <InputGroup>
              <InputGroupInput
                id="custom_domain"
                name="custom_domain"
                placeholder="example.com"
                className="!pl-1"
                defaultValue={cleanCustomDomain}
                aria-invalid={errors?.['custom_domain'] ? 'true' : 'false'}
                aria-describedby={errors?.['custom_domain'] ? 'custom_domain-error' : undefined}
              />
              <InputGroupAddon>
                <InputGroupText>https://</InputGroupText>
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <Globe className="size-4" aria-hidden="true" />
              </InputGroupAddon>
            </InputGroup>
            {errors?.['custom_domain'] && (
              <FieldError id="custom_domain-error">{errors['custom_domain'][0]}</FieldError>
            )}
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet className="space-y-4" disabled={isPending} aria-busy={isPending}>
        <FieldLegend>Handoff notes</FieldLegend>
        <FieldDescription>Capture deployment notes, upgrade tasks, or pending follow-ups.</FieldDescription>
        <FieldGroup className="space-y-4">
          <Field>
            <FieldLabel htmlFor="deployment_notes">Notes</FieldLabel>
            <Textarea
              id="deployment_notes"
              name="deployment_notes"
              placeholder="Add context for the next deployment or client communication..."
              className="min-h-32"
              defaultValue={deploymentNotes || ''}
              aria-invalid={errors?.['deployment_notes'] ? 'true' : 'false'}
              aria-describedby={errors?.['deployment_notes'] ? 'deployment_notes-error' : undefined}
            />
            {errors?.['deployment_notes'] && (
              <FieldError id="deployment_notes-error">{errors['deployment_notes'][0]}</FieldError>
            )}
          </Field>
        </FieldGroup>
      </FieldSet>
    </>
  )
}
