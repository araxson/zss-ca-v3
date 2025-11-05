'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ROUTES } from '@/lib/constants/routes'
import { getTicketStatusVariant, getTicketPriorityVariant, getTicketStatusLabel, getTicketPriorityLabel } from '@/features/admin/support/utils'
import type { TicketStatus, TicketPriority } from '@/lib/types/global.types'
import { DataTableViewOptions } from './data-table-view-options'

interface Ticket {
  id: string
  subject: string
  status: TicketStatus
  priority: TicketPriority
  created_at: string
  profile: { contact_name: string | null; company_name: string | null } | null
}

interface TicketsTableProps {
  tickets: Ticket[]
}

const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: 'subject',
    header: 'Subject',
    cell: ({ row }) => (
      <Link href={`${ROUTES.ADMIN_SUPPORT}/${row.original.id}`} className="font-medium hover:underline">
        {row.getValue<string>('subject')}
      </Link>
    ),
  },
  {
    accessorKey: 'profile.company_name',
    header: 'Client',
    cell: ({ row }) => row.original.profile?.company_name ?? row.original.profile?.contact_name ?? 'Unknown',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue<TicketStatus>('status')
      return <Badge variant={getTicketStatusVariant(status)}>{getTicketStatusLabel(status)}</Badge>
    },
    filterFn: (row, id, value: TicketStatus[]) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => {
      const priority = row.getValue<TicketPriority>('priority')
      return <Badge variant={getTicketPriorityVariant(priority)}>{getTicketPriorityLabel(priority)}</Badge>
    },
    filterFn: (row, id, value: TicketPriority[]) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => new Date(row.getValue<string>('created_at')).toLocaleDateString(),
  },
]

export function AdminTicketsTable({ tickets }: TicketsTableProps): React.JSX.Element {
  const memoisedData = useMemo(() => tickets, [tickets])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({})
  const [search, setSearch] = useState('')

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: memoisedData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  })

  const subjectColumn = table.getColumn('subject')
  if (subjectColumn) {
    subjectColumn.setFilterValue(search)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by subject..."
          className="w-full lg:max-w-xs"
        />
        <DataTableViewOptions table={table} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} scope="col">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No tickets found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} results
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
