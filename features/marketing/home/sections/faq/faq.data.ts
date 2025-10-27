import type { FaqData } from './faq.types'

export const faqData: FaqData = {
  heading: 'Frequently Asked Questions',
  subheading: 'Everything you need to know about our website subscription plans.',
  items: [
    {
      id: 'what-is-included',
      question: 'What is included in my subscription?',
      answer:
        'All plans include professional design, mobile-responsive development, hosting, SSL certificate, ongoing maintenance, security updates, and dedicated support. Higher-tier plans include additional features like e-commerce, advanced analytics, and priority support.',
    },
    {
      id: 'how-long-to-build',
      question: 'How long does it take to build my website?',
      answer:
        'Most websites are completed within 2-4 weeks from the initial kickoff call. The timeline depends on your plan tier, content readiness, and revision requests. We will provide a detailed timeline during onboarding.',
    },
    {
      id: 'can-i-cancel',
      question: 'Can I cancel my subscription anytime?',
      answer:
        'Yes, you can cancel your subscription at any time. If you cancel, you will retain access until the end of your current billing period. Please note that your website will be taken offline once the subscription ends unless you choose to migrate it.',
    },
    {
      id: 'own-domain',
      question: 'Can I use my own domain name?',
      answer:
        'Absolutely! All plans support custom domain names. We will guide you through the process of connecting your existing domain or help you register a new one. Domain registration fees are separate from your subscription.',
    },
    {
      id: 'content-updates',
      question: 'How do content updates and revisions work?',
      answer:
        'Simply submit update requests through your client portal. Each plan includes a monthly revision allowance. Most updates are completed within 2-3 business days. Complex changes may take longer and count as multiple revisions.',
    },
    {
      id: 'hosting-included',
      question: 'Is hosting and maintenance included?',
      answer:
        'Yes! All plans include fast, secure hosting with automatic backups, 99.9% uptime guarantee, SSL certificate, and regular software updates. You never have to worry about technical maintenance—we handle everything.',
    },
    {
      id: 'upgrade-downgrade',
      question: 'Can I upgrade or downgrade my plan?',
      answer:
        'Yes, you can change your plan at any time. Upgrades take effect immediately, and you will be charged a prorated amount. Downgrades take effect at the start of your next billing cycle.',
    },
    {
      id: 'who-owns-site',
      question: 'Who owns the website?',
      answer:
        'You retain ownership of your content and brand assets. The website code and design created under your subscription remain our intellectual property during the subscription. Upon cancellation, you can arrange a migration or export for an additional fee.',
    },
  ],
}
