'use client'

import Link from 'next/link'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { ROUTES } from '@/lib/constants/routes'

interface SitesSearchFieldProps {
  query: string
  onQueryChange: (query: string) => void
  resultsCount: number
}

export function SitesSearchField({ query, onQueryChange, resultsCount }: SitesSearchFieldProps) {
  return (
    <FieldGroup>
      <Field orientation="responsive">
        <FieldLabel htmlFor="client-sites-search">Search websites</FieldLabel>
        <FieldContent>
          <InputGroup>
            <InputGroupInput
              id="client-sites-search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search by name, domain, or status"
              aria-label="Search websites"
            />
            <InputGroupAddon align="inline-start" aria-hidden="true">
              <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <InputGroupText aria-live="polite">
                {resultsCount} results
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
          <FieldDescription>Filter your website list. Charts and stats reflect the current results.</FieldDescription>
        </FieldContent>
      </Field>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Website actions">
        <Button asChild>
          <Link href={ROUTES.CLIENT_SITES}>Manage Sites</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={ROUTES.CLIENT_SITES_NEW}>Request New Site</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={ROUTES.CLIENT_SUPPORT_NEW}>Create Support Ticket</Link>
        </Button>
      </div>
    </FieldGroup>
  )
}
