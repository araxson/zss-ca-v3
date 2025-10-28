import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SectionHeader } from '@/features/shared/components'
import { testimonialsData } from './testimonials.data'

export function Testimonials() {
  return (
    <section className="mx-auto w-full max-w-7xl space-y-12">
      <SectionHeader
        title={testimonialsData.heading}
        description={testimonialsData.subheading}
        align="center"
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonialsData.testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardHeader>
              <div className="space-y-2">
                <Badge variant="secondary" aria-label={`${testimonial.rating} star rating`}>
                  {`${testimonial.rating}★`}
                </Badge>
                <CardTitle>{testimonial.name}</CardTitle>
                <CardDescription>
                  {testimonial.role}, {testimonial.company}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {testimonial.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
