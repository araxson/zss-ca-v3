'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Check, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { updateTicketStatusAction } from '../api/mutations'

interface UpdateStatusButtonProps {
  ticketId: string
  currentStatus: string
}

const statusOptions = [
  { value: 'open', label: 'Open', variant: 'default' as const },
  { value: 'in_progress', label: 'In Progress', variant: 'secondary' as const },
  { value: 'resolved', label: 'Resolved', variant: 'outline' as const },
  { value: 'closed', label: 'Closed', variant: 'outline' as const },
]

function getStatusData(status: string) {
  return statusOptions.find(opt => opt.value === status) || statusOptions[0]
}

export function UpdateStatusButton({
  ticketId,
  currentStatus,
}: UpdateStatusButtonProps) {
  const [status, setStatus] = useState(currentStatus)
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  function handleStatusSelect(newStatus: string) {
    if (newStatus === status) return
    setPendingStatus(newStatus)
    setShowConfirm(true)
  }

  async function handleUpdate() {
    if (!pendingStatus) return
    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'] as const
    type ValidStatus = (typeof validStatuses)[number]

    if (!validStatuses.includes(pendingStatus as ValidStatus)) {
      return
    }

    setLoading(true)
    setShowConfirm(false)

    try {
      const result = await updateTicketStatusAction({
        ticketId,
        status: pendingStatus as ValidStatus,
      })

      if (result.error) {
        toast.error('Failed to update status', {
          description: result.error,
        })
        setPendingStatus(null)
      } else {
        toast.success('Status updated successfully', {
          description: `Ticket status changed to ${pendingStatus.replace('_', ' ')}.`,
        })
        setStatus(pendingStatus)
        setPendingStatus(null)
        router.refresh()
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status', {
        description: 'An unexpected error occurred.',
      })
      setPendingStatus(null)
    } finally {
      setLoading(false)
    }
  }

  function handleCancel() {
    setShowConfirm(false)
    setPendingStatus(null)
  }

  const currentStatusData = getStatusData(status)

  return (
    <>
      <FieldGroup className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Field>
          <FieldLabel className="text-sm">Update Status</FieldLabel>
        </Field>
        <Field className="flex flex-1 items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={loading} className="gap-2 w-48 sm:w-56 justify-between">
                <Badge variant={currentStatusData.variant}>
                  {currentStatusData.label}
                </Badge>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {statusOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleStatusSelect(option.value)}
                  disabled={loading}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{option.label}</span>
                    {status === option.value && <Check className="h-4 w-4" />}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </Field>
        <FieldDescription className="text-xs text-muted-foreground">
          Closing tickets prevents additional replies.
        </FieldDescription>
      </FieldGroup>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Ticket Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the ticket status to {pendingStatus?.replace('_', ' ')}?
              {pendingStatus === 'closed' && ' This will prevent further replies.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <ButtonGroup>
              <AlertDialogCancel asChild>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button onClick={handleUpdate}>Confirm</Button>
              </AlertDialogAction>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
