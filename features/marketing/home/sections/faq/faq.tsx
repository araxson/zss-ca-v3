import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { faqData } from './faq.data'

export function Faq() {
  return (
    <section className="w-full max-w-4xl mx-auto">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          {faqData.heading}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {faqData.subheading}
        </p>
      </div>
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
