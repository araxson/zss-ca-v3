import Link from 'next/link'
import { BriefcaseBusiness } from 'lucide-react'
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
import { caseCtaData } from './case-cta.data'

export function CaseCta() {
  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="space-y-6">
        <SectionHeader
          title={caseCtaData.heading}
          description={caseCtaData.description}
          align="center"
        />
        <Empty className="border border-dashed border-primary/40 bg-primary/5">
          <EmptyHeader>
            <EmptyMedia variant="icon" aria-hidden="true">
              <BriefcaseBusiness className="size-6" aria-hidden="true" />
            </EmptyMedia>
            {caseCtaData.supporting ? (
              <EmptyDescription>{caseCtaData.supporting}</EmptyDescription>
            ) : null}
          </EmptyHeader>
          <EmptyContent>
            <div
              className="flex flex-wrap justify-center gap-3"
              role="group"
              aria-label={caseCtaData.ariaLabel}
            >
              <Button asChild>
                <Link href={caseCtaData.primary.href}>{caseCtaData.primary.label}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={caseCtaData.secondary.href}>{caseCtaData.secondary.label}</Link>
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </section>
    </Item>
  )
}
