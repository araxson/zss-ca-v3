'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { User } from 'lucide-react'

interface ClientSectionProps {
  profile: {
    id: string
    contact_name: string | null
    contact_email: string | null
    company_name: string | null
  }
  plan: {
    name: string
  } | null
}

export function SiteDetailClientSection({ profile, plan }: ClientSectionProps) {
  return (
    <AccordionItem value="client">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-2">
          <User className="size-4" />
          <span className="font-semibold">Client Information</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pt-4">
          <Item variant="outline" size="sm">
            <ItemContent>
              <ItemTitle>{profile.company_name || profile.contact_name}</ItemTitle>
              <ItemDescription>{profile.contact_email}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button asChild variant="link" size="sm">
                <Link
                  href={`/admin/clients/${profile.id}`}
                  aria-label={`Open client record for ${profile.contact_name || profile.company_name || 'client'}`}
                >
                  View Profile
                </Link>
              </Button>
            </ItemActions>
          </Item>
          {plan && (
            <>
              <Separator />
              <Field>
                <FieldLabel>Subscription Plan</FieldLabel>
                <p className="text-sm font-medium">{plan.name}</p>
              </Field>
            </>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
