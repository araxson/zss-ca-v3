/**
 * Badge variant type for status display
 */
type StatusVariant = 'default' | 'secondary' | 'outline' | 'destructive'

/**
 * Get the appropriate badge variant for a site status
 *
 * @param status - The site status string
 * @returns The badge variant to use for display
 */
export function getStatusVariant(status: string): StatusVariant {
  switch (status) {
    case 'live':
      return 'default' as const
    case 'in_production':
      return 'secondary' as const
    case 'ready_for_review':
      return 'outline' as const
    case 'pending':
      return 'outline' as const
    case 'awaiting_client_content':
      return 'secondary' as const
    case 'paused':
      return 'secondary' as const
    case 'archived':
      return 'outline' as const
    default:
      return 'outline' as const
  }
}

/**
 * Format a status string for display
 * Converts snake_case to Title Case
 *
 * @param status - The status string to format
 * @returns The formatted status string
 */
export function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
}

export function getSiteStatusProgress(status: string): number {
  const statusMap: Record<string, number> = {
    pending: 10,
    in_production: 40,
    awaiting_client_content: 60,
    ready_for_review: 80,
    live: 100,
  }

  return statusMap[status] ?? 0
}

export function getSiteStatusLabel(status: string): string {
  const labelMap: Record<string, string> = {
    pending: 'Pending',
    in_production: 'In Production',
    awaiting_client_content: 'Awaiting Content',
    ready_for_review: 'Ready for Review',
    live: 'Live',
  }

  return labelMap[status] ?? status
}
