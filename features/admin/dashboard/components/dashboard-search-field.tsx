'use client'

import { Search, X } from 'lucide-react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'

interface DashboardSearchFieldProps {
  /**
   * Unique ID for the input field
   */
  id: string
  /**
   * Label text for the search field
   */
  label: string
  /**
   * Placeholder text
   */
  placeholder: string
  /**
   * Current search value
   */
  value: string
  /**
   * Change handler for the search input
   */
  onChange: (value: string) => void
  /**
   * Number of results matching the search
   */
  resultsCount: number
  /**
   * Optional description text below the input
   */
  description?: string
  /**
   * Optional aria-label override
   */
  ariaLabel?: string
}

/**
 * Unified search field component for dashboard pages
 * Provides consistent search UX with clear button and result count
 * Note: This returns a Field component, not FieldGroup. Wrap in FieldGroup if needed.
 */
export function DashboardSearchField({
  id,
  label,
  placeholder,
  value,
  onChange,
  resultsCount,
  description,
  ariaLabel,
}: DashboardSearchFieldProps) {
  const hasQuery = value.trim().length > 0

  return (
    <Field orientation="responsive">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FieldContent>
        <InputGroup>
          <InputGroupInput
            id={id}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            aria-label={ariaLabel || label}
          />
          <InputGroupAddon align="inline-start" aria-hidden="true">
            <Search className="size-4" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupText aria-live="polite">
              {resultsCount} {resultsCount === 1 ? 'result' : 'results'}
            </InputGroupText>
            {hasQuery && (
              <InputGroupButton
                type="button"
                onClick={() => onChange('')}
                aria-label="Clear search"
              >
                <X className="size-4" />
              </InputGroupButton>
            )}
          </InputGroupAddon>
        </InputGroup>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>
    </Field>
  )
}
