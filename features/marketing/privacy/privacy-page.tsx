import { SectionHeader } from '@/features/shared/components'
import { siteConfig } from '@/lib/config/site.config'

export function PrivacyPage() {
  const lastUpdated = 'January 27, 2025'

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
      <SectionHeader
        title="Privacy Policy"
        description={`Last updated: ${lastUpdated}`}
        align="start"
      />

      <div className="prose prose-neutral dark:prose-invert mt-12 max-w-none">
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Introduction</h2>
          <p className="text-muted-foreground">
            {siteConfig.name} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to
            protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you visit our website and use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Information We Collect</h2>
          <h3 className="mb-3 text-xl font-semibold">Personal Information</h3>
          <p className="mb-4 text-muted-foreground">
            We may collect personal information that you voluntarily provide to us when you:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Register for an account</li>
            <li>Subscribe to our services</li>
            <li>Fill out a contact form</li>
            <li>Communicate with us via email or support tickets</li>
          </ul>
          <p className="mt-4 text-muted-foreground">
            This information may include: name, email address, company name, phone number, billing
            information, and website requirements.
          </p>

          <h3 className="mb-3 mt-6 text-xl font-semibold">Automatically Collected Information</h3>
          <p className="text-muted-foreground">
            When you access our website, we automatically collect certain information about your
            device, including information about your web browser, IP address, time zone, and some of
            the cookies installed on your device.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">How We Use Your Information</h2>
          <p className="mb-4 text-muted-foreground">We use the information we collect to:</p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>Provide, operate, and maintain our services</li>
            <li>Process your transactions and manage your subscriptions</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Monitor and analyze usage and trends to improve our services</li>
            <li>Detect, prevent, and address technical issues and fraud</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Data Security</h2>
          <p className="text-muted-foreground">
            We implement appropriate technical and organizational security measures to protect your
            personal information. However, please note that no method of transmission over the
            Internet or electronic storage is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Third-Party Services</h2>
          <p className="text-muted-foreground">
            We use third-party services to help us operate our business, including Stripe for
            payment processing and Supabase for data storage. These third parties have access to
            your personal information only to perform specific tasks on our behalf and are obligated
            to protect your information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Your Rights</h2>
          <p className="mb-4 text-muted-foreground">
            Depending on your location, you may have certain rights regarding your personal
            information, including:
          </p>
          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
            <li>The right to access your personal information</li>
            <li>The right to correct inaccurate information</li>
            <li>The right to request deletion of your information</li>
            <li>The right to object to our processing of your information</li>
            <li>The right to data portability</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Contact Us</h2>
          <p className="text-muted-foreground">
            If you have questions about this Privacy Policy, please contact us at{' '}
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
