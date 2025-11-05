'use client'

import { FieldGroup } from '@/components/ui/field'
import { DashboardSearchField } from './dashboard-search-field'

interface TicketsSearchProps {
  query: string
  setQuery: (query: string) => void
  resultCount: number
}

export function AdminTicketsSearch({ query, setQuery, resultCount }: TicketsSearchProps): React.JSX.Element {
  return (
    <FieldGroup>
      <DashboardSearchField
        id="admin-ticket-search"
        label="Search tickets"
        placeholder="Search by subject, client, status, or priority"
        value={query}
        onChange={setQuery}
        resultsCount={resultCount}
        description="Filter recent tickets. Results update instantly."
        ariaLabel="Search support tickets"
      />
    </FieldGroup>
  )
}
