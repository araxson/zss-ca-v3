'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Globe } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'
import { ROUTES, ROUTE_HELPERS } from '@/lib/constants/routes'
import { getStatusVariant, formatStatus } from '@/features/shared/utils'
import { DataTableViewOptions } from '@/features/admin/dashboard/components/data-table-view-options'

const STATUS_FILTERS: Record<string, string[]> = {
  live: ['live'],
  in_production: ['in_production'],
  pending: ['pending', 'awaiting_client_content'],
  paused: ['paused', 'archived'],
}

const STATUS_DESCRIPTIONS: Record<string, string> = {
  pending: 'Site has been created but work has not started.',
  in_production: 'The production team is actively building the site.',
  awaiting_client_content: 'Waiting for the client to provide content or assets.',
  ready_for_review: 'Development complete and awaiting client review.',
  live: 'Site is live and accessible to end users.',
  paused: 'Work has been temporarily paused.',
  archived: 'Site has been archived and is no longer active.',
}

type ClientSite = Database['public']['Tables']['client_site']['Row']
type Profile = Database['public']['Tables']['profile']['Row']
type Plan = Database['public']['Tables']['plan']['Row']
type Subscription = Database['public']['Tables']['subscription']['Row']

type SiteWithRelations = ClientSite & {
  profile: Pick<Profile, 'id' | 'contact_name' | 'contact_email' | 'company_name'>
  plan: Pick<Plan, 'id' | 'name' | 'slug'> | null
  subscription: Pick<Subscription, 'id' | 'status'> | null
}

const columns: ColumnDef<SiteWithRelations>[] = [
  {
    accessorKey: 'site_name',
    header: 'Site',
    cell: ({ row }) => (
      <div className="font-medium text-sm">{row.original.site_name}</div>
    ),
  },
  {
    id: 'client',
    header: 'Client',
    cell: ({ row }) => {
      const client = row.original.profile
      const displayName = client.company_name || client.contact_name || 'Unknown client'
      const contactEmail = client.contact_email || 'No email on file'

      return (
        <div className="space-y-1">
          <HoverCard>
            <HoverCardTrigger asChild>
              <button type="button" className="text-left text-sm font-medium hover:underline focus:outline-none">
                {displayName}
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-72 space-y-3" align="start">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">{displayName}</h4>
                <p className="text-xs text-muted-foreground">{contactEmail}</p>
              </div>
              {row.original.plan && row.original.subscription && (
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">{row.original.plan.name}</Badge>
                  <span aria-hidden="true">•</span>
                  <span>{formatStatus(row.original.subscription.status)}</span>
                </div>
              )}
              <Button asChild size="sm" variant="outline" className="w-full">
                <Link href={ROUTE_HELPERS.adminClientDetail(client.id)}>View client profile</Link>
              </Button>
            </HoverCardContent>
          </HoverCard>
          <div className="text-xs text-muted-foreground">
            {client.contact_email ? (
              <a className="hover:text-primary" href={`mailto:${client.contact_email}`}>
                {client.contact_email}
              </a>
            ) : (
              'No email'
            )}
          </div>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'plan.name',
    header: 'Plan',
    cell: ({ row }) => (
      row.original.plan ? (
        <Badge variant="outline" className="text-xs font-medium">{row.original.plan.name}</Badge>
      ) : (
        <span className="text-sm text-muted-foreground">No plan</span>
      )
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant={getStatusVariant(row.original.status)}>
              {formatStatus(row.original.status)}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-sm text-muted-foreground">
              {STATUS_DESCRIPTIONS[row.original.status] || 'Status information unavailable.'}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) return true
      return value.some((filter) => STATUS_FILTERS[filter]?.includes(row.getValue(id)))
    },
  },
  {
    accessorKey: 'deployment_url',
    header: 'Deployed URL',
    cell: ({ row }) => (
      row.original.deployment_url ? (
        <a
          href={row.original.deployment_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          View site
        </a>
      ) : (
        <span className="text-sm text-muted-foreground">Not deployed</span>
      )
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'updated_at',
    header: 'Updated',
    cell: ({ row }) => {
      const updatedAt = row.original.updated_at
        ? new Date(row.original.updated_at)
        : row.original.created_at
          ? new Date(row.original.created_at)
          : null
      return (
        <span className="text-xs text-muted-foreground">
          {updatedAt ? formatDistanceToNow(updatedAt, { addSuffix: true }) : '—'}
        </span>
      )
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" aria-label={`Manage ${row.original.site_name}`}>
            Manage
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Site actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={ROUTE_HELPERS.adminSiteDetail(row.original.id)}>View details</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`${ROUTES.ADMIN_CLIENTS}?site=${row.original.id}`}>View client</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`${ROUTES.ADMIN_SUPPORT}?site=${row.original.id}`}>Support tickets</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]

export function SitesTable({ sites }: { sites: SiteWithRelations[] }): React.JSX.Element {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({})
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data: sites,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      if (typeof filterValue !== 'string' || filterValue.trim() === '') {
        return true
      }
      const query = filterValue.trim().toLowerCase()
      const record = row.original
      return [
        record.site_name,
        record.profile.company_name,
        record.profile.contact_name,
        record.profile.contact_email,
        record.deployment_url,
        record.custom_domain,
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query))
    },
  })

  const statusFilterValues = (table.getColumn('status')?.getFilterValue() as string[]) ?? []
  const suggestions = table.getPreFilteredRowModel().rows.slice(0, 8)
  const filteredRowCount = table.getFilteredRowModel().rows.length

  if (sites.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Globe className="size-6" />
          </EmptyMedia>
          <EmptyTitle>No sites found</EmptyTitle>
          <EmptyDescription>
            Create a site to get started or import an existing deployment.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild variant="outline" size="sm">
            <Link href={`${ROUTES.ADMIN_SITES}/new`}>Create Site</Link>
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <div className="space-y-4">
      <Command className="rounded-md border" shouldFilter={false} aria-label="Search sites">
        <CommandInput
          value={globalFilter}
          onValueChange={setGlobalFilter}
          placeholder="Search by site name, client, or URL..."
          aria-label="Search sites"
        />
        <CommandList>
          <CommandEmpty>No sites found.</CommandEmpty>
          <CommandGroup heading="Matches">
            {suggestions.map((row) => (
              <CommandItem
                key={row.id}
                value={row.original.id}
                onSelect={() => router.push(ROUTE_HELPERS.adminSiteDetail(row.original.id))}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{row.original.site_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {row.original.profile.company_name || row.original.profile.contact_name || row.original.profile.contact_email || 'Unassigned'}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ToggleGroup
          type="multiple"
          value={statusFilterValues}
          onValueChange={(values) => table.getColumn('status')?.setFilterValue(values)}
          className="flex flex-wrap gap-2"
          aria-label="Filter sites by status"
        >
          <ToggleGroupItem value="live" aria-label="Show live sites">
            Live
          </ToggleGroupItem>
          <ToggleGroupItem value="in_production" aria-label="Show in production sites">
            In Production
          </ToggleGroupItem>
          <ToggleGroupItem value="pending" aria-label="Show pending sites">
            Pending
          </ToggleGroupItem>
          <ToggleGroupItem value="paused" aria-label="Show paused sites">
            Paused
          </ToggleGroupItem>
        </ToggleGroup>

        <DataTableViewOptions table={table} />
      </div>

      <ScrollArea className="rounded-md border">
        <Table className="min-w-[720px]">
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
                  No sites match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {filteredRowCount === 0 && (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyTitle>No matching sites</EmptyTitle>
            <EmptyDescription>Adjust your search or status filters to view results.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {filteredRowCount > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-muted-foreground">
            {filteredRowCount} {filteredRowCount === 1 ? 'result' : 'results'}
          </span>
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
      )}
    </div>
  )
}
