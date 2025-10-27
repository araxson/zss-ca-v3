import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { testimonialsData } from './testimonials.data'

export function Testimonials() {
  return (
    <section className="w-full max-w-7xl mx-auto">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          {testimonialsData.heading}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {testimonialsData.subheading}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonialsData.testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardHeader>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="text-primary" aria-hidden="true">
                    ★
                  </span>
                ))}
              </div>
              <CardTitle>{testimonial.name}</CardTitle>
              <CardDescription>
                {testimonial.role}, {testimonial.company}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {testimonial.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
