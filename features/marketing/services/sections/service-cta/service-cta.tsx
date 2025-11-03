import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Item } from '@/components/ui/item'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from '@/components/ui/empty'
import { SectionHeader } from '@/features/shared/components'
import { serviceCtaData } from './service-cta.data'

export function ServiceCta() {
  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="space-y-6">
        <SectionHeader
          title={serviceCtaData.heading}
          description={serviceCtaData.description}
          align="center"
        />
        <Empty className="border border-dashed border-primary/40 bg-primary/5">
          <EmptyHeader>
            <EmptyMedia variant="icon" aria-hidden="true">
              <Sparkles className="size-6" aria-hidden="true" />
            </EmptyMedia>
            {serviceCtaData.supporting ? (
              <EmptyDescription>{serviceCtaData.supporting}</EmptyDescription>
            ) : null}
          </EmptyHeader>
          <EmptyContent>
            <div
              className="flex flex-wrap justify-center gap-3"
              role="group"
              aria-label={serviceCtaData.ariaLabel}
            >
              <Button asChild>
                <Link href={serviceCtaData.primary.href}>{serviceCtaData.primary.label}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={serviceCtaData.secondary.href}>{serviceCtaData.secondary.label}</Link>
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </section>
    </Item>
  )
}
