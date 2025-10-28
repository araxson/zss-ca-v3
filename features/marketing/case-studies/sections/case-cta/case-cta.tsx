import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { caseCtaData } from './case-cta.data'

export function CaseCta() {
  return (
    <section className="space-y-6">
      <SectionHeader
        title={caseCtaData.heading}
        description={caseCtaData.description}
        align="center"
      />
      <Item variant="outline" className="flex flex-col items-center gap-6 text-center">
        <ItemActions className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href={caseCtaData.primary.href}>{caseCtaData.primary.label}</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href={caseCtaData.secondary.href}>{caseCtaData.secondary.label}</Link>
        </Button>
        </ItemActions>
      </Item>
    </section>
  )
}
