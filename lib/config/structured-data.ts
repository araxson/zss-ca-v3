import { siteConfig } from './site.config'

/**
 * Schema.org Organization structured data
 * Used for SEO and rich snippets
 */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteConfig.name,
  url: siteConfig.url,
  logo: siteConfig.ogImage,
  description: siteConfig.description,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CA',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: 'support@zenithstrategicsolutions.ca',
  },
  sameAs: [
    // Add social media profiles when available
  ],
} as const

/**
 * Schema.org WebSite structured data
 * Defines the website entity for search engines
 */
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  publisher: {
    '@type': 'Organization',
    name: siteConfig.name,
  },
} as const

/**
 * Schema.org Service structured data
 * Describes the services offered
 */
export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Website Development & Subscription Services',
  provider: {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
  },
  description: siteConfig.description,
  areaServed: {
    '@type': 'Country',
    name: 'Canada',
  },
  serviceType: 'Website Development',
} as const

/**
 * Schema.org BreadcrumbList item
 */
interface BreadcrumbItem {
  '@type': 'ListItem'
  position: number
  name: string
  item: string
}

/**
 * Schema.org BreadcrumbList structured data
 */
interface BreadcrumbSchema {
  '@context': 'https://schema.org'
  '@type': 'BreadcrumbList'
  itemListElement: BreadcrumbItem[]
}

/**
 * Breadcrumb navigation item
 */
interface BreadcrumbInput {
  name: string
  url: string
}

/**
 * Generate Schema.org BreadcrumbList structured data
 *
 * Creates breadcrumb navigation markup for SEO and rich snippets
 *
 * @param items - Array of breadcrumb items with name and url
 * @returns Schema.org compliant breadcrumb list
 */
export function generateBreadcrumbSchema(items: readonly BreadcrumbInput[]): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index): BreadcrumbItem => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
