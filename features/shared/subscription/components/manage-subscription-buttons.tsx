'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
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
import { cancelSubscriptionAction, createBillingPortalSessionAction } from '../api/mutations'

interface ManageSubscriptionButtonsProps {
  subscriptionId: string
}

export function ManageSubscriptionButtons({
  subscriptionId,
}: ManageSubscriptionButtonsProps) {
  const [loading, setLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)

  async function handleBillingPortal() {
    setLoading(true)
    try {
      const result = await createBillingPortalSessionAction()

      if (result.error) {
        toast.error('Failed to open billing portal', {
          description: result.error,
        })
      } else if (result.url) {
        window.location.href = result.url
      }
    } catch (error) {
      toast.error('Failed to open billing portal', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    setCancelLoading(true)
    try {
      const result = await cancelSubscriptionAction({
        subscriptionId,
      })

      if (result.error) {
        toast.error('Failed to cancel subscription', {
          description: result.error,
        })
      } else {
        toast.success('Subscription canceled successfully', {
          description: 'Your subscription will remain active until the end of the billing period.',
        })
        window.location.reload()
      }
    } catch (error) {
      toast.error('Failed to cancel subscription', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    } finally {
      setCancelLoading(false)
    }
  }

  return (
    <ButtonGroup className="w-full">
      <Button onClick={handleBillingPortal} disabled={loading} className="flex-1">
        {loading ? <Spinner /> : 'Manage Billing'}
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" disabled={cancelLoading} className="flex-1">
            Cancel Plan
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel your subscription at the end of the current billing
              period. You&apos;ll continue to have access until then.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <ButtonGroup className="justify-end">
              <AlertDialogCancel asChild>
                <Button variant="outline">Keep Subscription</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button onClick={handleCancel} disabled={cancelLoading}>
                  {cancelLoading ? <Spinner /> : 'Yes, Cancel'}
                </Button>
              </AlertDialogAction>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ButtonGroup>
  )
}
