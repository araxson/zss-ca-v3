import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { SectionHeader } from '@/features/shared/components'
import { aboutServicesData } from './about-services.data'

export function AboutServices() {
  return (
    <section className="space-y-6">
      <SectionHeader
        title={aboutServicesData.title}
        description="Subscription-first delivery keeps every client launch on track."
        align="center"
      />
      <Accordion type="single" collapsible className="w-full">
        {aboutServicesData.items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{item.description}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
