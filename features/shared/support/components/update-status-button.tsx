'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

export function UpdateStatusButton({
  ticketId,
  currentStatus,
}: UpdateStatusButtonProps) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  function handleConfirmOpen() {
    if (status === currentStatus) return
    setShowConfirm(true)
  }

  async function handleUpdate() {
    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'] as const
    type ValidStatus = (typeof validStatuses)[number]

    if (!validStatuses.includes(status as ValidStatus)) {
      return
    }

    setLoading(true)
    setShowConfirm(false)

    try {
      const result = await updateTicketStatusAction({
        ticketId,
        status: status as ValidStatus,
      })

      if (result.error) {
        toast.error('Failed to update status', {
          description: result.error,
        })
        setStatus(currentStatus)
      } else {
        toast.success('Status updated successfully', {
          description: `Ticket status changed to ${status.replace('_', ' ')}.`,
        })
        router.refresh()
      }
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status', {
        description: 'An unexpected error occurred.',
      })
      setStatus(currentStatus)
    } finally {
      setLoading(false)
    }
  }

  function handleCancel() {
    setShowConfirm(false)
    setStatus(currentStatus)
  }

  return (
    <>
      <FieldGroup className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Field>
          <FieldLabel className="text-sm">Update Status</FieldLabel>
        </Field>
        <Field className="flex flex-1 items-center gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-48 sm:w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleConfirmOpen}
            disabled={loading || status === currentStatus}
            size="sm"
          >
            {loading ? 'Updating...' : 'Update'}
          </Button>
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
              Are you sure you want to change the ticket status to {status.replace('_', ' ')}?
              {status === 'closed' && ' This will prevent further replies.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdate}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
