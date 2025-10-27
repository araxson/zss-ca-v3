'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { createCheckoutSessionAction } from '../api/mutations'
import { ROUTES } from '@/lib/constants/routes'

type BillingInterval = 'monthly' | 'yearly'

interface CheckoutButtonProps {
  planId: string
  planName: string
  billingInterval: BillingInterval
  isAuthenticated: boolean
  hasSubscription: boolean
  variant?: 'default' | 'outline'
}

export function CheckoutButton({
  planId,
  planName,
  billingInterval,
  isAuthenticated,
  hasSubscription,
  variant = 'default',
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleCheckout() {
    if (!isAuthenticated) {
      router.push(`${ROUTES.SIGNUP}?plan=${planId}`)
      return
    }

    if (hasSubscription) {
      router.push(ROUTES.CLIENT_SUBSCRIPTION)
      return
    }

    setLoading(true)
    try {
      const result = await createCheckoutSessionAction({
        planId,
        billingInterval,
      })

      if (result.error) {
        toast.error('Failed to start checkout', {
          description: result.error,
        })
      } else if (result.url) {
        window.location.href = result.url
      }
    } catch (error) {
      toast.error('Failed to start checkout', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  const buttonLabel = hasSubscription ? 'Manage Plan' : 'Get Started'
  const tooltipLabel = hasSubscription
    ? `Manage your existing ${planName} subscription`
    : `Start checkout for the ${planName} plan`

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleCheckout}
            disabled={loading}
            variant={variant}
            className="w-full"
            aria-label={tooltipLabel}
          >
            {loading ? <Spinner /> : buttonLabel}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipLabel}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
