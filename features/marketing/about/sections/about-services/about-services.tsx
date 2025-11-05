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
      <div className="flex flex-col items-center text-center gap-4">
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {aboutServicesData.title}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl text-balance">
            Subscription-first delivery keeps every client launch on track.
          </p>
        </div>
      </div>
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
