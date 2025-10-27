import type { FeaturesData } from './features.types'

export const featuresData: FeaturesData = {
  heading: 'Everything You Need to Succeed Online',
  subheading:
    'Our subscription plans include professional design, development, hosting, and ongoing support.',
  features: [
    {
      id: 'custom-design',
      title: 'Custom Design',
      description:
        'Unique, professional designs tailored to your brand and business goals.',
      icon: '🎨',
    },
    {
      id: 'responsive',
      title: 'Mobile-Responsive',
      description:
        'Beautiful, fast-loading websites that work perfectly on all devices.',
      icon: '📱',
    },
    {
      id: 'seo',
      title: 'SEO Optimized',
      description:
        'Built-in search engine optimization to help customers find you online.',
      icon: '🔍',
    },
    {
      id: 'hosting',
      title: 'Hosting Included',
      description:
        'Fast, secure hosting with automatic backups and 99.9% uptime guarantee.',
      icon: '🚀',
    },
    {
      id: 'support',
      title: 'Dedicated Support',
      description:
        'Direct access to our team for updates, changes, and technical assistance.',
      icon: '💬',
    },
    {
      id: 'maintenance',
      title: 'Ongoing Maintenance',
      description:
        'Regular updates, security patches, and performance optimization included.',
      icon: '🔧',
    },
  ],
}
