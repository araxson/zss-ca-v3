// Client-safe exports only
export {
  CheckoutButton,
  ManageSubscriptionButtons,
  SubscriptionCard,
} from './components'

// Server components must be imported directly:
// import { SubscriptionFeature } from '@/features/shared/subscription/components/subscription-feature'

// Client-safe API exports (mutations and schema only, no server queries)
export * from './api/mutations'
export * from './api/schema'

// Server queries must be imported directly:
// import { getSubscription } from '@/features/shared/subscription/api/queries'
