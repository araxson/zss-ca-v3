'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ScrollText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import type { AuditLogWithProfiles } from '../api/queries'

interface AuditLogTableProps {
  logs: AuditLogWithProfiles[]
}

const ITEMS_PER_PAGE = 15

function getActionVariant(action: string) {
  if (action.toLowerCase().includes('create') || action.toLowerCase().includes('insert')) {
    return 'default'
  }
  if (action.toLowerCase().includes('update')) {
    return 'secondary'
  }
  if (action.toLowerCase().includes('delete')) {
    return 'destructive'
  }
  return 'outline'
}

function formatResourceTable(table: string) {
  return table
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function AuditLogTable({ logs }: AuditLogTableProps): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState(1)

  if (logs.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ScrollText />
          </EmptyMedia>
          <EmptyTitle>No audit activity yet</EmptyTitle>
          <EmptyDescription>Actions will appear here once the team starts making changes.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent />
      </Empty>
    )
  }

  // Calculate pagination
  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedLogs = logs.slice(startIndex, endIndex)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      if (currentPage > 3) {
        pages.push('ellipsis')
      }
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis')
      }
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="space-y-4">
      <ScrollArea className="rounded-md border" aria-label="Audit log table">
        <Table className="min-w-[700px] md:min-w-[800px]">
          <caption className="sr-only">
            Audit log of system actions showing timestamps, actors, and resource changes
          </caption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Timestamp</TableHead>
              <TableHead scope="col">Actor</TableHead>
              <TableHead scope="col">Action</TableHead>
              <TableHead scope="col">Resource</TableHead>
              <TableHead scope="col">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="whitespace-nowrap">
                <span className="text-xs">
                  {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {log.actor_profile?.contact_name || 'System'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {log.actor_profile?.contact_email || 'N/A'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getActionVariant(log.action)}>{log.action}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {formatResourceTable(log.resource_table)}
                  </span>
                  {log.resource_id && (
                    <span className="text-xs text-muted-foreground font-mono">
                      {log.resource_id.slice(0, 8)}...
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {log.change_summary && typeof log.change_summary === 'object' && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label={`View change summary for action ${log.action}`}
                      >
                        <Eye className="mr-2 size-4" />
                        View Details
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-screen max-w-md sm:max-w-lg" align="end">
                      <div className="space-y-2">
                        <h4 className="font-medium">Change Summary</h4>
                        <pre className="text-xs overflow-auto max-h-96 rounded-md bg-muted p-4">
                          {JSON.stringify(log.change_summary, null, 2)}
                        </pre>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) {
                    setCurrentPage(currentPage - 1)
                  }
                }}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) => (
              <PaginationItem key={`${page}-${index}`}>
                {page === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(page)
                    }}
                    isActive={currentPage === page}
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages) {
                    setCurrentPage(currentPage + 1)
                  }
                }}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
