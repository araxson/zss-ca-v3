import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { aboutServicesData } from './about-services.data'

export function AboutServices() {
  return (
    <section className="space-y-6">
      <Item className="border-0 bg-transparent shadow-none text-center">
        <ItemContent className="space-y-2">
          <ItemTitle className="text-3xl font-bold tracking-tight">{aboutServicesData.title}</ItemTitle>
          <ItemDescription className="text-muted-foreground">
            Subscription-first delivery keeps every client launch on track.
          </ItemDescription>
        </ItemContent>
      </Item>
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
