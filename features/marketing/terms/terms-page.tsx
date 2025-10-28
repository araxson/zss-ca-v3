import { SectionHeader } from '@/features/shared/components'
import { siteConfig } from '@/lib/config/site.config'

export function TermsPage() {
  const lastUpdated = 'January 27, 2025'

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
      <SectionHeader
        title="Terms of Service"
        description={`Last updated: ${lastUpdated}`}
        align="start"
      />

      <div className="prose prose-neutral dark:prose-invert mt-12 max-w-none">
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Agreement to Terms</h2>
          <p className="text-muted-foreground">
            By accessing or using {siteConfig.name}&apos;s services, you agree to be bound by these
            Terms of Service and all applicable laws and regulations. If you do not agree with any
            of these terms, you are prohibited from using or accessing our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Service Description</h2>
          <p className="text-muted-foreground">
            {siteConfig.name} provides subscription-based website development and maintenance
            services. We build, deploy, and maintain Next.js websites for our clients through
            monthly subscription plans.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Subscription Terms</h2>
          <h3 className="mb-3 text-xl font-semibold">Billing</h3>
          <p className="mb-4 text-muted-foreground">
            Subscription fees are billed monthly in advance. Payment is due at the beginning of each
            billing cycle. We use Stripe for secure payment processing.
          </p>

          <h3 className="mb-3 text-xl font-semibold">Cancellation</h3>
          <p className="mb-4 text-muted-foreground">
            You may cancel your subscription at any time. Cancellations will take effect at the end
            of the current billing period. No refunds will be provided for partial months.
          </p>

          <h3 className="mb-3 text-xl font-semibold">Service Changes</h3>
          <p className="text-muted-foreground">
            We reserve the right to modify our subscription plans and pricing with 30 days&apos;
            notice to existing subscribers. Continued use of the service after such changes
            constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Client Responsibilities</h2>
          <p className="mb-4 text-muted-foreground">As a client, you agree to:</p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Provide accurate and complete information for your website</li>
            <li>Provide timely feedback and approvals during the development process</li>
            <li>Supply necessary content, images, and materials for your website</li>
            <li>Maintain the confidentiality of your account credentials</li>
            <li>Comply with all applicable laws and regulations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Intellectual Property</h2>
          <h3 className="mb-3 text-xl font-semibold">Client Content</h3>
          <p className="mb-4 text-muted-foreground">
            You retain all rights to the content you provide to us. By providing content, you grant
            us a license to use, modify, and display it as necessary to provide our services.
          </p>

          <h3 className="mb-3 text-xl font-semibold">Website Ownership</h3>
          <p className="text-muted-foreground">
            Upon full payment of all fees, you will own the final website code and assets. However,
            we retain rights to our proprietary frameworks, tools, and methodologies used in
            development.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Service Limitations</h2>
          <p className="mb-4 text-muted-foreground">
            Our services are provided on an &quot;as is&quot; and &quot;as available&quot; basis. We
            make no warranties or guarantees regarding:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Uninterrupted or error-free service</li>
            <li>Specific website performance metrics</li>
            <li>Compatibility with all devices or browsers</li>
            <li>Guaranteed search engine rankings</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Limitation of Liability</h2>
          <p className="text-muted-foreground">
            To the maximum extent permitted by law, {siteConfig.name} shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages resulting from your
            use or inability to use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Termination</h2>
          <p className="text-muted-foreground">
            We reserve the right to suspend or terminate your account if you violate these terms or
            engage in fraudulent, abusive, or illegal activities. Upon termination, your right to
            use our services will immediately cease.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Changes to Terms</h2>
          <p className="text-muted-foreground">
            We may update these Terms of Service from time to time. We will notify you of any
            material changes by posting the new terms on this page and updating the &quot;Last
            updated&quot; date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Contact Information</h2>
          <p className="text-muted-foreground">
            If you have any questions about these Terms of Service, please contact us at{' '}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-primary hover:underline">
              {siteConfig.contact.email}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
