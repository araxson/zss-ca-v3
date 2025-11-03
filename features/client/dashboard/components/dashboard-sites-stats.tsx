'use client'

import { Badge } from '@/components/ui/badge'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

interface DashboardSitesStatsProps {
  totalSites: number
  activeSitesCount: number
  sitesInProgressCount: number
}

export function DashboardSitesStats({
  totalSites,
  activeSitesCount,
  sitesInProgressCount,
}: DashboardSitesStatsProps) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>Sites Summary</ItemTitle>
        <ItemDescription>Quick overview of your website portfolio</ItemDescription>
      </ItemContent>
      <ItemContent className="gap-0">
        <FieldGroup className="gap-0">
          <Field
            orientation="responsive"
            className="border-t border-border py-3 first:border-t-0 first:pt-0 last:pb-0"
          >
            <FieldLabel>Total Sites</FieldLabel>
            <FieldContent className="flex-row items-start justify-between gap-3">
              <FieldDescription>All websites in your account</FieldDescription>
              <Badge variant="secondary" className="shrink-0">
                {totalSites}
              </Badge>
            </FieldContent>
          </Field>
          <Field
            orientation="responsive"
            className="border-t border-border py-3 first:border-t-0 first:pt-0 last:pb-0"
          >
            <FieldLabel>Live Sites</FieldLabel>
            <FieldContent className="flex-row items-start justify-between gap-3">
              <FieldDescription>Currently deployed and accessible</FieldDescription>
              <Badge variant="default" className="shrink-0">
                {activeSitesCount}
              </Badge>
            </FieldContent>
          </Field>
          <Field
            orientation="responsive"
            className="border-t border-border py-3 first:border-t-0 first:pt-0 last:pb-0"
          >
            <FieldLabel>In Progress</FieldLabel>
            <FieldContent className="flex-row items-start justify-between gap-3">
              <FieldDescription>Sites being developed</FieldDescription>
              <Badge variant="outline" className="shrink-0">
                {sitesInProgressCount}
              </Badge>
            </FieldContent>
          </Field>
        </FieldGroup>
      </ItemContent>
    </Item>
  )
}
