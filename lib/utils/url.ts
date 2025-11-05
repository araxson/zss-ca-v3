import { z } from 'zod'

/**
 * Add protocol to URL if missing
 * Automatically prepends https:// if no protocol is present
 */
export function normalizeUrl(url: string): string {
  if (!url) return url

  const trimmed = url.trim()

  // If already has protocol, return as is
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  // Add https:// prefix
  return `https://${trimmed}`
}

/**
 * Validate domain pattern (without protocol)
 * Accepts: example.com, www.example.com, subdomain.example.com, example.co.uk
 *
 * @param domain - The domain string to validate
 * @returns True if the domain is valid, false otherwise
 */
function isValidDomain(domain: string): boolean {
  if (!domain) return false

  // Remove protocol if present
  const cleaned = domain.replace(/^https?:\/\//i, '')

  // Domain pattern: allows subdomains, domain, and TLD
  // Must have at least one dot, alphanumeric + hyphens, valid TLD
  const domainPattern = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i

  return domainPattern.test(cleaned)
}

/**
 * Zod schema for optional URLs that accepts domains with or without protocol
 * Examples: example.com, www.example.com, https://example.com
 */
export const optionalUrlSchema = z
  .string()
  .default('')
  .transform((val) => {
    // Allow empty strings
    if (!val || val === '') return ''
    return val.trim()
  })
  .refine(
    (val) => {
      if (val === '') return true

      // Check if it's a valid domain or URL
      const withProtocol = normalizeUrl(val)
      try {
        new URL(withProtocol)
        return true
      } catch {
        return isValidDomain(val)
      }
    },
    { message: 'Invalid URL or domain format (e.g., example.com)' }
  )
  .transform((val) => {
    if (val === '') return ''
    return normalizeUrl(val)
  })

/**
 * Zod schema for required URLs that accepts domains with or without protocol
 * Examples: example.com, www.example.com, https://example.com
 */
export const requiredUrlSchema = z
  .string()
  .min(1, 'URL is required')
  .transform((val) => val.trim())
  .refine(
    (val) => {
      // Check if it's a valid domain or URL
      const withProtocol = normalizeUrl(val)
      try {
        new URL(withProtocol)
        return true
      } catch {
        return isValidDomain(val)
      }
    },
    { message: 'Invalid URL or domain format (e.g., example.com)' }
  )
  .transform((val) => normalizeUrl(val))
