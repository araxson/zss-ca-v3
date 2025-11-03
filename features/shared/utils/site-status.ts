export function getStatusVariant(status: string) {
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

export function formatStatus(status: string) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
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
