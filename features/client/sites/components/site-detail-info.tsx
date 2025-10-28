import {
  Item,
  ItemHeader,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import type { Database } from '@/lib/types/database.types'

type Plan = Database['public']['Tables']['plan']['Row']

interface SiteDetailInfoProps {
  status: string
  plan: Pick<Plan, 'id' | 'name' | 'slug' | 'page_limit' | 'revision_limit'> | null
}

export function SiteDetailInfo({ status, plan }: SiteDetailInfoProps) {
  return (
    <Item variant="outline" className="flex flex-col">
      <ItemHeader className="flex-col items-start gap-1">
        <ItemTitle>Additional Information</ItemTitle>
        <ItemDescription>More details about your website</ItemDescription>
      </ItemHeader>
      <ItemContent className="space-y-4">
        <Accordion type="single" collapsible defaultValue="status">
          <AccordionItem value="status">
            <AccordionTrigger>Status Information</AccordionTrigger>
            <AccordionContent className="space-y-4">
              {status === 'pending' && (
                <div className="text-sm">
                  Your website project has been created and is in the queue. Our team will begin
                  working on it shortly.
                </div>
              )}

              {status === 'in_production' && (
                <div className="text-sm">
                  Our team is actively working on your website. We will notify you when it is
                  ready for review.
                </div>
              )}

              {status === 'awaiting_client_content' && (
                <div className="text-sm">
                  We are waiting for content or feedback from you. Please check your email for
                  our request or contact support if you need assistance.
                </div>
              )}

              {status === 'ready_for_review' && (
                <div className="text-sm">
                  Your website is ready for review! Please check the preview and let us know if
                  any changes are needed.
                </div>
              )}

              {status === 'live' && (
                <div className="text-sm">
                  Your website is live and accessible to the public. Thank you for choosing our
                  service!
                </div>
              )}

              {status === 'paused' && (
                <div className="text-sm">
                  Your website project has been paused. Please contact support if you would like
                  to resume development.
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {plan && (
            <AccordionItem value="plan">
              <AccordionTrigger>Plan Details</AccordionTrigger>
              <AccordionContent>
                <FieldGroup className="space-y-3">
                  <Field>
                    <FieldLabel>Plan Name</FieldLabel>
                    <FieldContent>
                      <FieldTitle>{plan.name}</FieldTitle>
                    </FieldContent>
                  </Field>
                  {plan.page_limit && (
                    <Field>
                      <FieldLabel>Page Limit</FieldLabel>
                      <FieldContent>
                        <FieldTitle>{plan.page_limit} pages</FieldTitle>
                      </FieldContent>
                    </Field>
                  )}
                  {plan.revision_limit && (
                    <Field>
                      <FieldLabel>Monthly Revisions</FieldLabel>
                      <FieldContent>
                        <FieldTitle>{plan.revision_limit} revisions</FieldTitle>
                      </FieldContent>
                    </Field>
                  )}
                </FieldGroup>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </ItemContent>
    </Item>
  )
}
