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
