import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { SectionHeader } from '@/features/shared/components'
import { faqData } from './faq.data'

export function Faq() {
  return (
    <section className="w-full max-w-4xl mx-auto">
      <SectionHeader
        title={faqData.heading}
        description={faqData.subheading}
        align="center"
        className="mb-12"
      />
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
