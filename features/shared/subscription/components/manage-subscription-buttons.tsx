'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
        console.error('Billing portal error:', result.error)
        alert(result.error)
      } else if (result.url) {
        window.location.href = result.url
      }
    } catch (error) {
      console.error('Billing portal error:', error)
      alert('Failed to open billing portal')
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
        console.error('Cancel error:', result.error)
        alert(result.error)
      } else {
        alert('Subscription canceled successfully')
        window.location.reload()
      }
    } catch (error) {
      console.error('Cancel error:', error)
      alert('Failed to cancel subscription')
    } finally {
      setCancelLoading(false)
    }
  }

  return (
    <div className="flex gap-2 w-full">
      <Button onClick={handleBillingPortal} disabled={loading} className="flex-1">
        {loading ? 'Loading...' : 'Manage Billing'}
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
            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} disabled={cancelLoading}>
              {cancelLoading ? 'Canceling...' : 'Yes, Cancel'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
