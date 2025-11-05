'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Field,
  FieldDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

  async function handleUpdate(): Promise<void> {
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

      if ('error' in result) {
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
      <Field className="space-y-2">
        <FieldLabel>Update Status</FieldLabel>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Select
            value={status}
            onValueChange={handleStatusSelect}
            disabled={loading}
          >
            <SelectTrigger className="w-full sm:w-[16rem]" aria-label="Select ticket status">
              <SelectValue placeholder="Choose status" />
            </SelectTrigger>
            <SelectContent align="start">
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant={currentStatusData?.variant || 'default'}>
            {currentStatusData?.label || 'Unknown'}
          </Badge>
        </div>
        <FieldDescription>Closing tickets prevents additional replies.</FieldDescription>
      </Field>

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
            <div className="flex gap-2">
              <AlertDialogCancel asChild>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button onClick={handleUpdate}>Confirm</Button>
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
