'use client'

import { Badge } from '@/components/ui/badge'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { ExternalLink, Globe } from 'lucide-react'

interface DeploymentSectionProps {
  deploymentUrl: string | null
  customDomain: string | null
  slug: string | null
  deploymentNotes: string | null
  siteName: string
}

export function SiteDetailDeploymentSection({
  deploymentUrl,
  customDomain,
  slug,
  deploymentNotes,
  siteName,
}: DeploymentSectionProps) {
  if (!deploymentUrl && !customDomain && !deploymentNotes && !slug) {
    return null
  }

  return (
    <AccordionItem value="deployment">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-2">
          <Globe className="size-4" />
          <span className="font-semibold">Deployment Configuration</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <FieldGroup className="space-y-4 pt-4">
          {deploymentUrl && (
            <Field>
              <FieldLabel>Deployment URL</FieldLabel>
              <div className="flex items-center gap-2">
                <a
                  href={deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                  aria-label={`Open deployment for ${siteName}`}
                >
                  {deploymentUrl}
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </Field>
          )}
          {customDomain && (
            <Field>
              <FieldLabel>Custom Domain</FieldLabel>
              <p className="text-sm font-medium">{customDomain}</p>
            </Field>
          )}
          {slug && (
            <Field>
              <FieldLabel>Slug</FieldLabel>
              <Badge variant="outline">{slug}</Badge>
            </Field>
          )}
          {deploymentNotes && (
            <>
              <Separator />
              <Field>
                <FieldLabel>Deployment Notes</FieldLabel>
                <div className="rounded-md border bg-muted/30 p-3">
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                    {deploymentNotes}
                  </p>
                </div>
              </Field>
            </>
          )}
        </FieldGroup>
      </AccordionContent>
    </AccordionItem>
  )
}
