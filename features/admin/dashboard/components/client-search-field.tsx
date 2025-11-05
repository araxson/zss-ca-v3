'use client'

import { FieldGroup } from '@/components/ui/field'
import { DashboardSearchField } from './dashboard-search-field'

interface ClientSearchFieldProps {
  query: string
  onQueryChange: (query: string) => void
  resultsCount: number
}

export function ClientSearchField({ query, onQueryChange, resultsCount }: ClientSearchFieldProps): React.JSX.Element {
  return (
    <FieldGroup>
      <DashboardSearchField
        id="admin-clients-search"
        label="Search clients"
        placeholder="Search by name, email, or company"
        value={query}
        onChange={onQueryChange}
        resultsCount={resultsCount}
        description="Use keywords to quickly find a client record."
        ariaLabel="Search clients"
      />
    </FieldGroup>
  )
}
