import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { aboutServicesData } from './about-services.data'

export function AboutServices() {
  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{aboutServicesData.title}</h2>
        <p className="text-muted-foreground">
          Subscription-first delivery keeps every client launch on track.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {aboutServicesData.items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.description}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
