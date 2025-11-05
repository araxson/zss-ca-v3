'use client'

import { useRouter } from 'next/navigation'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/components/ui/field'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import type { ComponentProps } from 'react'

type BadgeVariant = ComponentProps<typeof Badge>['variant']

interface DashboardSearchSuggestion {
  value: string
  label: string
  href?: string
  description?: string
  badge?: string
  badgeVariant?: BadgeVariant
}

interface DashboardSearchFieldProps {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  resultsCount: number
  suggestions: DashboardSearchSuggestion[]
  description?: string
  ariaLabel?: string
  emptyMessage?: string
}

export function DashboardSearchField({
  label,
  placeholder,
  value,
  onChange,
  resultsCount,
  suggestions,
  description,
  ariaLabel,
  emptyMessage = 'No results found.',
}: DashboardSearchFieldProps): React.JSX.Element {
  const router = useRouter()

  const handleSelect = (item: DashboardSearchSuggestion) => {
    onChange(item.value)

    if (item.href) {
      router.push(item.href)
    }
  }

  return (
    <Field orientation="vertical">
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        <Command className="rounded-lg border">
          <CommandInput
            value={value}
            onValueChange={onChange}
            placeholder={placeholder}
            aria-label={ariaLabel || label}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            {suggestions.length > 0 ? (
              <CommandGroup heading={`Matches (${resultsCount})`}>
                {suggestions.slice(0, 6).map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={() => handleSelect(item)}
                  >
                    <div className="flex flex-1 flex-col gap-1">
                      <span className="font-medium">{item.label}</span>
                      {item.description ? (
                        <span className="text-xs text-muted-foreground">{item.description}</span>
                      ) : null}
                    </div>
                    {item.badge ? (
                      <Badge variant={item.badgeVariant ?? 'secondary'}>{item.badge}</Badge>
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
        {description ? (
          <FieldDescription>{description}</FieldDescription>
        ) : null}
      </FieldContent>
    </Field>
  )
}
