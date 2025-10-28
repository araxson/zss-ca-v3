import { ContactOverview } from './sections/contact-overview'
import { ContactSteps } from './sections/contact-steps'
import { ContactForm } from './sections/contact-form'
import { SectionHeader } from '@/features/shared/components'

export function ContactPage() {
  return (
    <div className="container mx-auto flex flex-col gap-16 px-4 py-16 md:py-24">
      <SectionHeader
        title="Let's plan your next launch"
        description="Reach out and our team will craft a subscription plan tailored to your marketing goals."
        align="center"
      />
      <ContactOverview />
      <ContactSteps />
      <ContactForm />
    </div>
  )
}
