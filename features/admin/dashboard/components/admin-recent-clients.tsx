'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from '@/components/ui/item'
import { ClientSearchField } from './client-search-field'
import { RecentClientsTable } from './recent-clients-table'

interface AdminRecentClientsProps {
  clients: Array<{
    id: string
    contact_name: string | null
    contact_email: string | null
    company_name: string | null
    created_at: string
  }>
}

export function AdminRecentClients({ clients }: AdminRecentClientsProps) {
  const [query, setQuery] = useState('')
  const filteredClients = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return clients

    return clients.filter((client) => {
      const values = [
        client.contact_name,
        client.contact_email,
        client.company_name,
      ]

      return values.some((value) =>
        value?.toLowerCase().includes(term),
      )
    })
  }, [clients, query])

  const hasClients = clients.length > 0
  const hasResults = filteredClients.length > 0

  if (!hasClients) {
    return (
      <Item variant="outline">
        <ItemHeader>
          <ItemTitle>Recent Clients</ItemTitle>
          <ItemDescription>Latest registered client accounts</ItemDescription>
        </ItemHeader>
        <ItemContent className="basis-full">
          <div className="p-6">
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No clients yet</EmptyTitle>
                <EmptyDescription>
                  Client accounts will appear here once registered
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        </ItemContent>
      </Item>
    )
  }

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle>Recent Clients</ItemTitle>
        <ItemDescription>Latest registered client accounts</ItemDescription>
      </ItemHeader>
      <ItemContent className="basis-full">
        <div className="space-y-4 p-6">
          <ClientSearchField
            query={query}
            onQueryChange={setQuery}
            resultsCount={filteredClients.length}
          />
        </div>
      </ItemContent>
      {hasResults ? (
        <ItemContent className="basis-full">
          <RecentClientsTable clients={filteredClients} />
        </ItemContent>
      ) : (
        <ItemContent className="basis-full">
          <div className="p-6">
            <Empty aria-live="polite">
              <EmptyHeader>
                <EmptyTitle>No matching clients</EmptyTitle>
                <EmptyDescription>
                  Try adjusting your search terms or clearing the filter
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button type="button" variant="outline" onClick={() => setQuery('')}>
                  Clear filter
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        </ItemContent>
      )}
    </Item>
  )
}
