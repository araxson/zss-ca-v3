import { Mail, MapPin, Phone, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { siteConfig } from '@/lib/config/site.config'

export function ContactContent() {
  const { contact } = siteConfig
  const phoneHref = contact.phone.replace(/[^+\d]/g, '')

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Let&apos;s build your next website</h1>
        <p className="text-lg text-muted-foreground">
          Share your project goals and we&apos;ll craft a subscription plan that keeps your site
          performing month after month.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Talk with our team</CardTitle>
            <CardDescription>
              Reach out and we&apos;ll respond within one business day.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup className="space-y-4">
              <Field className="flex items-center gap-3">
                <Mail className="size-5 text-primary" aria-hidden />
                <a href={`mailto:${contact.email}`} className="font-medium">
                  {contact.email}
                </a>
              </Field>
              <Field className="flex items-center gap-3">
                <Phone className="size-5 text-primary" aria-hidden />
                <a href={`tel:${phoneHref}`} className="font-medium">
                  {contact.phone}
                </a>
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <a href={`mailto:${contact.email}`}>Book a discovery call</a>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visit our studio</CardTitle>
            <CardDescription>Drop by or schedule an in-person strategy session.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup className="space-y-3 text-muted-foreground">
              <Field className="flex items-start gap-3">
                <MapPin className="mt-1 size-5 text-primary" aria-hidden />
                <div>
                  <p className="font-medium text-foreground">{contact.address.line1}</p>
                  <p>
                    {contact.address.city}, {contact.address.region} {contact.address.postal}
                  </p>
                  <p>{contact.address.country}</p>
                </div>
              </Field>
              <FieldDescription>Office hours: Monday–Friday, 9am–5pm MT</FieldDescription>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <CardTitle>What to expect next</CardTitle>
          </div>
          <CardDescription>Here&apos;s how we turn your idea into a live website.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          {[
            {
              step: 1,
              title: 'Discovery call',
              description: 'We learn about your business, goals, and timeline.',
            },
            {
              step: 2,
              title: 'Proposal & onboarding',
              description: 'Pick a plan, connect Stripe billing, and share brand assets.',
            },
            {
              step: 3,
              title: 'Design & launch',
              description: 'We build, review together, and deploy your new site.',
            },
          ].map((item) => (
            <FieldSet key={item.step} className="space-y-2 rounded-lg border p-4">
              <FieldLabel asChild>
                <Badge variant="outline" className="w-fit">
                  Step {item.step}
                </Badge>
              </FieldLabel>
              <FieldGroup className="space-y-1">
                <FieldLabel className="text-base font-semibold text-foreground">
                  {item.title}
                </FieldLabel>
                <FieldDescription className="text-sm text-muted-foreground">
                  {item.description}
                </FieldDescription>
              </FieldGroup>
            </FieldSet>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
