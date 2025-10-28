// Client-safe exports only
export {
  CheckoutButton,
  ManageSubscriptionButtons,
  SubscriptionCard,
} from './components'

// Server components must be imported directly:
// import { SubscriptionFeature } from '@/features/shared/subscription/components/subscription-feature'

export {
  createCheckoutSessionSchema,
  cancelSubscriptionSchema,
  type CreateCheckoutSessionInput,
  type CancelSubscriptionInput,
} from './schema'

// Server-only types - safe to export as types
export type { SubscriptionWithPlan } from './api/queries'
