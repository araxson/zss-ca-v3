'use client'

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
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item'
import { faqData } from './faq.data'

export function Faq() {
  return (
    <ItemGroup className="mx-auto w-full max-w-7xl gap-16">
      <Item className="flex w-full flex-col items-center border-0 p-0 text-center">
        <ItemContent className="max-w-3xl items-center gap-3 text-center">
          <ItemTitle className="justify-center">
            <span className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {faqData.heading}
            </span>
          </ItemTitle>
          <ItemDescription className="text-base text-muted-foreground sm:text-lg">
            {faqData.subheading}
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item className="w-full flex-col">
        <Accordion type="single" collapsible className="grid w-full gap-4 md:grid-cols-2">
          {faqData.items.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="w-full">
              <AccordionTrigger>
                <span className="text-left">{item.question}</span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{item.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Item>
    </ItemGroup>
  )
}
