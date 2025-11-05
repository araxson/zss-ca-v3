import Link from 'next/link'
import { NotebookPen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Item } from '@/components/ui/item'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from '@/components/ui/empty'
import { resourcesCtaData } from './resources-cta.data'

export function ResourcesCta() {
  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="space-y-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {resourcesCtaData.heading}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl text-balance">
              {resourcesCtaData.description}
            </p>
          </div>
        </div>
        <Empty className="border border-dashed border-primary/40 bg-primary/5">
          <EmptyHeader>
            <EmptyMedia variant="icon" aria-hidden="true">
              <NotebookPen className="size-6" aria-hidden="true" />
            </EmptyMedia>
            {resourcesCtaData.supporting ? (
              <EmptyDescription>{resourcesCtaData.supporting}</EmptyDescription>
            ) : null}
          </EmptyHeader>
          <EmptyContent>
            <div
              className="flex flex-wrap justify-center gap-3"
              role="group"
              aria-label={resourcesCtaData.ariaLabel}
            >
              <Button asChild>
                <Link href={resourcesCtaData.primary.href}>{resourcesCtaData.primary.label}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={resourcesCtaData.secondary.href}>{resourcesCtaData.secondary.label}</Link>
              </Button>
            </div>
          </EmptyContent>
        </Empty>
      </section>
    </Item>
  )
}
