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
import { faqData } from './faq.data'

export function Faq() {
  return (
    <section className="w-full max-w-4xl mx-auto">
      <Item className="border-0 bg-transparent shadow-none text-center mb-12">
        <ItemContent className="space-y-4">
          <ItemTitle className="text-3xl md:text-4xl font-bold tracking-tight">
            {faqData.heading}
          </ItemTitle>
          <ItemDescription className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {faqData.subheading}
          </ItemDescription>
        </ItemContent>
      </Item>
      <Accordion type="single" collapsible className="w-full">
        {faqData.items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
