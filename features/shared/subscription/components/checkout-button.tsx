'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
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
        console.error('Checkout error:', result.error)
        alert(result.error)
      } else if (result.url) {
        window.location.href = result.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      variant={variant}
      className="w-full"
    >
      {loading ? 'Loading...' : hasSubscription ? 'Manage Plan' : 'Get Started'}
    </Button>
  )
}
