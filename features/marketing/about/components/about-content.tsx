import { Check } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import {
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'

export function AboutContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">About Zenith Strategic Solutions</h1>
        <p className="text-lg text-muted-foreground">
          Professional website development for Canadian small businesses
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-neutral dark:prose-invert">
          <p className="text-muted-foreground">
            We believe every small business deserves a professional online
            presence without the complexity and high costs traditionally
            associated with website development. Our subscription-based model
            makes professional website services accessible and affordable.
          </p>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>What We Do</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="subscription">
              <AccordionTrigger>
                Subscription-Based Website Development
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We build and maintain professional static websites for small
                businesses on a monthly subscription basis. No large upfront
                costs, just predictable monthly pricing.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="support">
              <AccordionTrigger>
                Ongoing Support & Maintenance
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Your subscription includes regular updates, security patches, and
                dedicated support to ensure your website stays current and
                performs optimally.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="design">
              <AccordionTrigger>Professional Design</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Every website is custom-designed by our team to match your brand
                and business goals, ensuring a unique and professional online
                presence.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Why Choose Us</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldSet className="grid gap-3 sm:grid-cols-2">
            {[
              {
                title: 'Predictable Pricing',
                description: 'No hidden fees or surprise costs.',
              },
              {
                title: 'Canadian-Focused',
                description: 'Built for Canadian businesses by Canadians.',
              },
              {
                title: 'Professional Quality',
                description: 'Enterprise-level design and development.',
              },
              {
                title: 'Dedicated Support',
                description: 'Real humans ready to help when you need it.',
              },
            ].map((item) => (
              <FieldGroup key={item.title} className="flex items-start gap-3 rounded-md border p-4">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                <div className="space-y-1">
                  <FieldLabel className="font-semibold text-foreground">{item.title}</FieldLabel>
                  <FieldDescription className="text-sm text-muted-foreground">
                    {item.description}
                  </FieldDescription>
                </div>
              </FieldGroup>
            ))}
          </FieldSet>
        </CardContent>
      </Card>
    </div>
  )
}
