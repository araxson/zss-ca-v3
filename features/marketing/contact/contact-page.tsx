import { ContactOverview } from './sections/contact-overview'
import { ContactSteps } from './sections/contact-steps'

export function ContactPage() {
  return (
    <div className="container mx-auto flex flex-col gap-16 px-4 py-16 md:py-24">
      <ContactOverview />
      <ContactSteps />
    </div>
  )
}
