import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { caseCtaData } from './case-cta.data'

export function CaseCta() {
  return (
    <Item variant="outline" className="flex flex-col items-center gap-6 text-center">
      <ItemContent className="space-y-4 max-w-2xl">
        <ItemTitle className="text-3xl font-bold tracking-tight">
          {caseCtaData.heading}
        </ItemTitle>
        <ItemDescription className="text-lg text-muted-foreground">
          {caseCtaData.description}
        </ItemDescription>
      </ItemContent>
      <ItemActions className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href={caseCtaData.primary.href}>{caseCtaData.primary.label}</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href={caseCtaData.secondary.href}>{caseCtaData.secondary.label}</Link>
        </Button>
      </ItemActions>
    </Item>
  )
}
