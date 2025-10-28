'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createAuditLogSchema, type CreateAuditLogInput } from '../schema'
import { createAuditLogAction } from '../api/mutations'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Item, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item'
import { CreateAuditLogFormContextFields } from './create-audit-log-form-context-fields'
import { CreateAuditLogFormResourceFields } from './create-audit-log-form-resource-fields'
import { CreateAuditLogFormAdvancedSection } from './create-audit-log-form-advanced-section'

type CreateAuditLogFormProps = {
  clients?: Array<{
    id: string
    contact_name: string | null
    contact_email: string | null
  }>
}

export function CreateAuditLogForm({ clients = [] }: CreateAuditLogFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [changeSummary, setChangeSummary] = useState('{}')
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  const form = useForm<CreateAuditLogInput>({
    resolver: zodResolver(createAuditLogSchema),
    defaultValues: {
      profile_id: null,
      action: '',
      resource_table: '',
      resource_id: null,
      change_summary: {},
    },
  })

  async function onSubmit(data: CreateAuditLogInput) {
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    try {
      let parsedSummary = {}
      try {
        parsedSummary = JSON.parse(changeSummary)
      } catch {
        setError('Invalid JSON in change summary')
        setIsSubmitting(false)
        return
      }

      const result = await createAuditLogAction({
        ...data,
        change_summary: parsedSummary,
      })

      if (result.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      setSuccess(true)
      form.reset()
      setChangeSummary('{}')
      setIsSubmitting(false)

      setTimeout(() => {
        router.refresh()
      }, 1500)
    } catch (_error) {
      setError('An unexpected error occurred')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Item variant="muted" className="flex flex-col gap-2">
        <ItemContent className="space-y-1">
          <ItemTitle>Create Manual Audit Log</ItemTitle>
          <ItemDescription>
            Document manual changes or external system integrations
          </ItemDescription>
        </ItemContent>
      </Item>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>Audit log created successfully</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <Item variant="outline" className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CreateAuditLogFormContextFields control={form.control} clients={clients} />
            <CreateAuditLogFormResourceFields control={form.control} />
            <CreateAuditLogFormAdvancedSection
              isOpen={isAdvancedOpen}
              onOpenChange={setIsAdvancedOpen}
              changeSummary={changeSummary}
              onChangeSummaryChange={setChangeSummary}
            />

            <ButtonGroup>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : 'Create Audit Log'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </form>
        </Item>
      </Form>
    </div>
  )
}
