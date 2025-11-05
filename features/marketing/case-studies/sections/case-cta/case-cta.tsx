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
import { caseCtaData } from './case-cta.data'

export function CaseCta() {
  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="space-y-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {caseCtaData.heading}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl text-balance">
              {caseCtaData.description}
            </p>
          </div>
        </div>
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
