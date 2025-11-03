'use client'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Client {
  id: string
  contact_name: string | null
  contact_email: string | null
  company_name: string | null
  created_at: string
}

interface ClientsTableProps {
  clients: Client[]
}

export function RecentClientsTable({ clients }: ClientsTableProps) {
  return (
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
          {clients.map((client) => (
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
  )
}
