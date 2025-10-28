import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { contactLocationIcon, contactOverviewData } from './contact-overview.data'

export function ContactOverview() {
  const LocationIcon = contactLocationIcon

  return (
    <section className="space-y-10">
      <SectionHeader
        title={contactOverviewData.heading}
        description={contactOverviewData.subheading}
        align="center"
      />

      <ItemGroup className="grid gap-6 md:grid-cols-2">
        <Item variant="outline" className="flex flex-col">
          <ItemContent className="space-y-4">
            <ItemTitle>Talk with our team</ItemTitle>
            <ItemDescription>
              Reach out and we&apos;ll respond within one business day.
            </ItemDescription>
            <ItemGroup className="space-y-3">
              {contactOverviewData.channels.map((channel) => (
                <Item key={channel.label} className="items-center gap-3">
                  <ItemMedia variant="icon">
                    <channel.icon className="h-5 w-5 text-primary" aria-hidden />
                  </ItemMedia>
                  <ItemContent className="flex-1">
                    <ItemTitle className="text-base font-medium text-foreground">
                      {channel.label}
                    </ItemTitle>
                    <ItemDescription>
                      <a href={channel.href}>{channel.value}</a>
                    </ItemDescription>
                  </ItemContent>
                </Item>
              ))}
            </ItemGroup>
          </ItemContent>
          <ItemActions>
            <Button asChild className="w-full">
              <Link href={contactOverviewData.cta.href}>{contactOverviewData.cta.label}</Link>
            </Button>
          </ItemActions>
        </Item>

        <Item variant="outline" className="flex flex-col">
          <ItemContent className="space-y-4 text-muted-foreground">
            <ItemTitle className="text-foreground">Visit our studio</ItemTitle>
            <div className="flex items-start gap-3">
              <ItemMedia>
                <LocationIcon className="h-5 w-5 text-primary" aria-hidden />
              </ItemMedia>
              <div className="space-y-1 text-sm text-foreground">
                {contactOverviewData.office.addressLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
            <ItemDescription>{contactOverviewData.office.hours}</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
    </section>
  )
}
