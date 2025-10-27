export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface FaqData {
  heading: string
  subheading: string
  items: FaqItem[]
}
