export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
}

export interface TestimonialsData {
  heading: string
  subheading: string
  testimonials: Testimonial[]
}
