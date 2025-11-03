import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Item } from '@/components/ui/item'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionHeader } from '@/features/shared/components'
import { contactLocationIcon, contactOverviewData } from './contact-overview.data'

export function ContactOverview() {
  const LocationIcon = contactLocationIcon

  return (
    <Item asChild className="block border-none rounded-none p-0 gap-0 text-base">
      <section className="space-y-10">
        <SectionHeader
          title={contactOverviewData.heading}
          description={contactOverviewData.subheading}
          align="center"
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Talk with our team</CardTitle>
              <CardDescription>
                Reach out and we&apos;ll respond within one business day.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                {contactOverviewData.channels.map((channel) => (
                  <div key={channel.label} className="flex items-start gap-3">
                    <span className="mt-1 text-primary" aria-hidden="true">
                      <channel.icon className="size-5" />
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{channel.label}</p>
                      <p>
                        <a href={channel.href}>{channel.value}</a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full">
                <Button asChild>
                  <Link
                    aria-label={contactOverviewData.cta.ariaLabel}
                    className="block w-full"
                    href={contactOverviewData.cta.href}
                  >
                    {contactOverviewData.cta.label}
                  </Link>
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visit our studio</CardTitle>
              <CardDescription>{contactOverviewData.office.hours}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-1 text-primary" aria-hidden="true">
                  <LocationIcon className="size-5" />
                </span>
                <div className="space-y-1 text-foreground">
                  {contactOverviewData.office.addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Item>
  )
}
