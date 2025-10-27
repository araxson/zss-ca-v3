'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
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

export function UpdateStatusButton({
  ticketId,
  currentStatus,
}: UpdateStatusButtonProps) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleUpdate() {
    if (status === currentStatus) return

    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'] as const
    type ValidStatus = (typeof validStatuses)[number]

    if (!validStatuses.includes(status as ValidStatus)) {
      return
    }

    setLoading(true)
    try {
      const result = await updateTicketStatusAction({
        ticketId,
        status: status as ValidStatus,
      })

      if (result.error) {
        alert(result.error)
        setStatus(currentStatus)
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
      setStatus(currentStatus)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <p className="text-sm text-muted-foreground">Update Status:</p>
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[180px]">
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
        onClick={handleUpdate}
        disabled={loading || status === currentStatus}
        size="sm"
      >
        {loading ? 'Updating...' : 'Update'}
      </Button>
    </div>
  )
}
