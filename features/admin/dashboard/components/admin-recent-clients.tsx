'use client'

import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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
      <Card>
        <CardHeader>
          <CardTitle>Recent Clients</CardTitle>
          <CardDescription>Latest registered client accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No clients yet</EmptyTitle>
              <EmptyDescription>
                Client accounts will appear here once registered
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Clients</CardTitle>
        <CardDescription>Latest registered client accounts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldGroup>
          <Field orientation="responsive">
            <FieldLabel htmlFor="admin-clients-search">Search clients</FieldLabel>
            <FieldContent>
              <InputGroup>
                <InputGroupInput
                  id="admin-clients-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by name, email, or company"
                  aria-label="Search clients"
                />
                <InputGroupAddon align="inline-start" aria-hidden="true">
                  <Search className="size-4" />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <InputGroupText aria-live="polite">
                    {hasResults ? `${filteredClients.length} results` : '0 results'}
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
              <FieldDescription>Use keywords to quickly find a client record.</FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
        {hasResults ? (
          <ScrollArea className="rounded-md border" aria-label="Recent clients table">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarFallback>
                            {client.contact_name?.charAt(0).toUpperCase() ?? 'C'}
                          </AvatarFallback>
                        </Avatar>
                        <span>{client.contact_name ?? 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{client.contact_email}</TableCell>
                    <TableCell>{client.company_name ?? '—'}</TableCell>
                    <TableCell>
                      {new Date(client.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        ) : (
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
        )}
      </CardContent>
    </Card>
  )
}
