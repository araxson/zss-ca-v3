export interface CaseFeaturedMetrics {
  label: string
  value: string
}

export interface CaseFeaturedData {
  client: string
  industry: string
  summary: string
  metrics: CaseFeaturedMetrics[]
  testimonial: {
    quote: string
    author: string
    role: string
  }
}
