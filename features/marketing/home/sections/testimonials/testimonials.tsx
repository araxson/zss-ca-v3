import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { SectionHeader } from '@/features/shared/components'
import { testimonialsData } from './testimonials.data'

export function Testimonials() {
  return (
    <section className="w-full max-w-7xl mx-auto">
      <SectionHeader
        title={testimonialsData.heading}
        description={testimonialsData.subheading}
        align="center"
        className="mb-12"
      />
      <ItemGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonialsData.testimonials.map((testimonial) => (
          <Item key={testimonial.id} variant="outline" className="flex flex-col gap-4">
            <ItemHeader className="flex flex-col gap-2">
              <div
                className="flex items-center gap-1"
                aria-label={`${testimonial.rating} star rating`}
              >
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <span key={index} className="text-primary" aria-hidden="true">
                    ★
                  </span>
                ))}
              </div>
              <ItemTitle>{testimonial.name}</ItemTitle>
              <ItemDescription>
                {testimonial.role}, {testimonial.company}
              </ItemDescription>
            </ItemHeader>
            <ItemContent>
              <ItemDescription className="text-sm leading-relaxed">
                {testimonial.content}
              </ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </section>
  )
}
