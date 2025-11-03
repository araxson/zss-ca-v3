'use client'

import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from '@/components/ui/input-group'
import { Search, X } from 'lucide-react'

interface TicketsSearchProps {
  query: string
  setQuery: (query: string) => void
  resultCount: number
}

export function AdminTicketsSearch({ query, setQuery, resultCount }: TicketsSearchProps) {
  return (
    <FieldGroup>
      <Field orientation="responsive">
        <FieldLabel htmlFor="admin-ticket-search">Search tickets</FieldLabel>
        <FieldContent>
          <InputGroup>
            <InputGroupInput
              id="admin-ticket-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by subject, client, status, or priority"
              aria-label="Search support tickets"
            />
            <InputGroupAddon align="inline-start" aria-hidden="true">
              <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <InputGroupText aria-live="polite">
                {resultCount > 0 ? `${resultCount} results` : '0 results'}
              </InputGroupText>
              {query ? (
                <InputGroupButton
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </InputGroupButton>
              ) : null}
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>Filter recent tickets. Results update instantly.</FieldDescription>
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
