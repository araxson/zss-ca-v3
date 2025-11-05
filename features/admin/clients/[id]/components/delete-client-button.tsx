'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteClientAction } from '../api/mutations'
import { ROUTES } from '@/lib/constants/routes'

interface DeleteClientButtonProps {
  clientId: string
  clientName: string
}

export function DeleteClientButton({ clientId, clientName }: DeleteClientButtonProps): React.JSX.Element {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete(): Promise<void> {
    setIsDeleting(true)
    const result = await deleteClientAction({ profileId: clientId })

    if ('error' in result) {
      toast.error('Delete failed', {
        description: result.error,
      })
      setIsDeleting(false)
    } else {
      toast.success('Client deleted', {
        description: 'The client account has been permanently deleted.',
      })
      router.push(ROUTES.ADMIN_CLIENTS)
      router.refresh()
    }
  }

  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertTitle>Danger Zone</AlertTitle>
        <AlertDescription>
          Permanently delete this client account. This action cannot be undone.
        </AlertDescription>
      </Alert>
      <AlertDialog>
        <HoverCard>
          <HoverCardTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={isDeleting}
                aria-label={`Delete ${clientName}`}
              >
                <Trash2 className="mr-2 size-4" />
                Delete Client
              </Button>
            </AlertDialogTrigger>
          </HoverCardTrigger>
          <HoverCardContent align="start" className="text-sm text-muted-foreground">
            Removing this client deletes project data, tickets, and analytics snapshots.
            Export records before you proceed.
          </HoverCardContent>
        </HoverCard>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {clientName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the client account and all associated data.
              This action cannot be undone. Are you absolutely sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="flex justify-end gap-2">
              <AlertDialogCancel asChild>
                <Button variant="outline">Cancel</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? <Spinner /> : 'Yes, Delete Client'}
                </Button>
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
