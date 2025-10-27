import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config/site.config'

export const contactPageMetadata: Metadata = {
  title: `Contact ${siteConfig.name}`,
  description:
    'Reach the Zenith Strategic Solutions team to discuss your next website project, ask questions, or schedule a strategy session.',
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
  openGraph: {
    title: `Contact ${siteConfig.name}`,
    description:
      'Talk with our Canadian web experts about your next website project and ongoing subscription support.',
    url: `${siteConfig.url}/contact`,
    siteName: siteConfig.name,
    locale: 'en_CA',
    type: 'website',
  },
}
