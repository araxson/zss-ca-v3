import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { contactLocationIcon, contactOverviewData } from './contact-overview.data'

export function ContactOverview() {
  const LocationIcon = contactLocationIcon

  return (
    <section className="space-y-10">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{contactOverviewData.heading}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {contactOverviewData.subheading}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Item variant="outline" className="flex flex-col">
          <ItemContent className="space-y-4">
            <ItemTitle>Talk with our team</ItemTitle>
            <ItemDescription>
              Reach out and we&apos;ll respond within one business day.
            </ItemDescription>
            <FieldGroup className="space-y-4">
              {contactOverviewData.channels.map((channel) => (
                <Field key={channel.label} className="flex items-center gap-3">
                  <channel.icon className="h-5 w-5 text-primary" aria-hidden />
                  <FieldLabel className="text-base font-medium text-foreground">
                    <a href={channel.href}>{channel.value}</a>
                  </FieldLabel>
                </Field>
              ))}
            </FieldGroup>
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
            <FieldGroup className="space-y-3">
              <Field className="flex items-start gap-3">
                <ItemMedia>
                  <LocationIcon className="h-5 w-5 text-primary" aria-hidden />
                </ItemMedia>
                <div>
                  {contactOverviewData.office.addressLines.map((line) => (
                    <p key={line} className="text-sm text-foreground">
                      {line}
                    </p>
                  ))}
                </div>
              </Field>
              <FieldDescription>{contactOverviewData.office.hours}</FieldDescription>
            </FieldGroup>
          </ItemContent>
        </Item>
      </div>
    </section>
  )
}
