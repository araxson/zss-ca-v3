'use client'

import { Search, X } from 'lucide-react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'

interface ClientSearchFieldProps {
  query: string
  onQueryChange: (query: string) => void
  resultsCount: number
}

export function ClientSearchField({ query, onQueryChange, resultsCount }: ClientSearchFieldProps) {
  return (
    <FieldGroup>
      <Field orientation="responsive">
        <FieldLabel htmlFor="admin-clients-search">Search clients</FieldLabel>
        <FieldContent>
          <InputGroup>
            <InputGroupInput
              id="admin-clients-search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search by name, email, or company"
              aria-label="Search clients"
            />
            <InputGroupAddon align="inline-start" aria-hidden="true">
              <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <InputGroupText aria-live="polite">
                {resultsCount > 0 ? `${resultsCount} results` : '0 results'}
              </InputGroupText>
              {query ? (
                <InputGroupButton
                  type="button"
                  onClick={() => onQueryChange('')}
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </InputGroupButton>
              ) : null}
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>Use keywords to quickly find a client record.</FieldDescription>
        </FieldContent>
      </Field>
    </FieldGroup>
  )
}
