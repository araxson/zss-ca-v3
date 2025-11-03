'use client'

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { Textarea } from '@/components/ui/textarea'
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/components/ui/field'
import { FormFieldLayout } from '@/features/shared/components/form-field-layout'
import { Globe, Link2 } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { UpdateSiteInput } from '../api/schema'

interface EditSiteDeploymentFieldsProps {
  form: UseFormReturn<UpdateSiteInput>
}

export function EditSiteDeploymentFields({ form }: EditSiteDeploymentFieldsProps) {
  return (
    <>
      <FieldSet className="space-y-4">
        <FieldLegend>Deployment access</FieldLegend>
        <FieldDescription>Track where the site is hosted and any custom domain mappings.</FieldDescription>
        <FieldGroup className="space-y-4">
          <FormField
            control={form.control}
            name="deployment_url"
            render={({ field }) => (
              <FormItem>
                <FormFieldLayout label="Deployment URL" description="The live URL where the site is deployed">
                  <FormControl>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        placeholder="example.com"
                        className="!pl-1"
                        value={field.value?.replace(/^https?:\/\//i, '') || ''}
                        onChange={(event) => field.onChange(event.target.value)}
                      />
                      <InputGroupAddon>
                        <InputGroupText>https://</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupAddon align="inline-end">
                        <Link2 className="size-4" />
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                </FormFieldLayout>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="custom_domain"
            render={({ field }) => (
              <FormItem>
                <FormFieldLayout label="Custom Domain" description="Custom domain if different from deployment URL">
                  <FormControl>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        placeholder="example.com"
                        className="!pl-1"
                        value={field.value?.replace(/^https?:\/\//i, '') || ''}
                        onChange={(event) => field.onChange(event.target.value)}
                      />
                      <InputGroupAddon>
                        <InputGroupText>https://</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupAddon align="inline-end">
                        <Globe className="size-4" />
                      </InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                </FormFieldLayout>
                <FormMessage />
              </FormItem>
            )}
          />
        </FieldGroup>
      </FieldSet>

      <FieldSet className="space-y-4">
        <FieldLegend>Handoff notes</FieldLegend>
        <FieldDescription>Capture deployment notes, upgrade tasks, or pending follow-ups.</FieldDescription>
        <FieldGroup className="space-y-4">
          <FormField
            control={form.control}
            name="deployment_notes"
            render={({ field }) => (
              <FormItem>
                <FormFieldLayout label="Notes">
                  <FormControl>
                    <Textarea
                      placeholder="Add context for the next deployment or client communication..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                </FormFieldLayout>
                <FormMessage />
              </FormItem>
            )}
          />
        </FieldGroup>
      </FieldSet>
    </>
  )
}
