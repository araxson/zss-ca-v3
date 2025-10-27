# Stripe Integration Guide

Complete guide for working with Stripe products, prices, and subscriptions in this project.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Database Schema](#database-schema)
- [Stripe Configuration](#stripe-configuration)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This project uses **Stripe Billing** for subscription management with the following architecture:

- **4 Subscription Plans**: Essential, Growth, Pro, Elite
- **Monthly & Annual Billing**: 20% discount on annual plans
- **Supabase Database**: `plan` table synced with Stripe
- **Lookup Keys**: For easy price references without hard-coded IDs
- **Metadata**: Rich product/price metadata for feature flags

---

## 🗄️ Database Schema

### Plan Table Structure

```sql
TABLE plan (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE,                    -- 'essential', 'growth', 'pro', 'elite'
  name TEXT,                           -- 'Essential Plan', etc.
  description TEXT,
  stripe_product_id TEXT,              -- Stripe product ID (prod_xxx)
  stripe_price_id_monthly TEXT UNIQUE, -- Monthly price ID (price_xxx)
  stripe_price_id_yearly TEXT UNIQUE,  -- Annual price ID (price_xxx)
  features JSONB,                      -- Array of feature objects
  page_limit SMALLINT,                 -- Max pages (NULL = unlimited)
  revision_limit SMALLINT,             -- Max revisions/month (NULL = unlimited)
  setup_fee_cents INTEGER,
  currency_code TEXT DEFAULT 'CAD',
  is_active BOOLEAN DEFAULT true,
  sort_order SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
)
```

### Current Plans

| Plan      | Database ID                          | Stripe Product ID     | Monthly Price ID               | Annual Price ID                |
| --------- | ------------------------------------ | --------------------- | ------------------------------ | ------------------------------ |
| Essential | `cbb83be0-730b-4387-a77d-78c2ec986179` | `prod_TJ3wnJmnh994fm` | `price_1SMRoVP9fFsmlAaF9zkoG6QT` | `price_1SMRoVP9fFsmlAaFUMgWLMJO` |
| Growth    | `37fe5159-58ae-4ca0-be54-f9f3441c5ab7` | `prod_TJ3wEEskj8hM4R` | `price_1SMRoWP9fFsmlAaFnRp0Qap8` | `price_1SMRoWP9fFsmlAaF4V7jpxQI` |
| Pro       | `9ca6174b-da03-41ef-b9a6-83c737927c9f` | `prod_TJ3wpQuXztGOK3` | `price_1SMRoXP9fFsmlAaFSKYWVyRK` | `price_1SMRoXP9fFsmlAaFrwN3YGUF` |
| Elite     | `e9acb70a-f0d3-44ee-92eb-3f6f50c0bcca` | `prod_TJ3wDlsVVABcCt` | `price_1SMRoYP9fFsmlAaFHmXwXCth` | `price_1SMRoYP9fFsmlAaFt182MXUM` |

---

## ⚙️ Stripe Configuration

### Products (in Stripe Dashboard)

Each product has:
- **Name & Description**: Marketing copy
- **Metadata**: Feature flags (max_pages, content_updates_per_month, etc.)
- **Tax Code**: `txcd_10103100` (SaaS - Software as a Service)
- **Statement Descriptor**: What appears on bank statements (e.g., "ZSS Essential")

### Prices (in Stripe Dashboard)

Each price has:
- **Unit Amount**: In cents (9700 = $97.00 CAD)
- **Currency**: CAD
- **Billing Interval**: `month` or `year`
- **Lookup Key**: e.g., `essential_monthly`, `growth_annual`
- **Nickname**: Internal reference (e.g., "Essential - Monthly")
- **Tax Behavior**: `exclusive` (tax added on top of price)
- **Metadata**: tier, billing_cycle, savings amount

---

## 💻 Usage Examples

### 1. Import Constants

```typescript
import {
  STRIPE_PRICES,
  STRIPE_LOOKUP_KEYS,
  PLAN_SLUGS,
  getPriceId,
  getLookupKey,
  formatPrice,
  getAnnualSavings,
} from '@/lib/constants/stripe'
```

### 2. Get Price by Slug (Recommended)

```typescript
// Using helper function
const priceId = getPriceId('essential', 'monthly')
// Returns: 'price_1SMRoVP9fFsmlAaF9zkoG6QT'

// Using direct import
const priceId = STRIPE_PRICES.essential_monthly
```

### 3. Use Lookup Keys (Production Best Practice)

```typescript
import { stripe } from '@/lib/stripe/server'
import { STRIPE_LOOKUP_KEYS } from '@/lib/constants/stripe'

// Fetch price by lookup key
const prices = await stripe.prices.list({
  lookup_keys: [STRIPE_LOOKUP_KEYS.growth_annual],
})

const price = prices.data[0]
```

**Why Lookup Keys?**
- Update prices in Stripe Dashboard without code changes
- Transfer lookup keys between price versions
- Query prices by name instead of hard-coded IDs

### 4. Create Checkout Session

```typescript
import { stripe } from '@/lib/stripe/server'
import { getPriceId } from '@/lib/constants/stripe'

async function createCheckoutSession(
  planSlug: 'essential' | 'growth' | 'pro' | 'elite',
  billingCycle: 'monthly' | 'annual',
  customerId: string
) {
  const priceId = getPriceId(planSlug, billingCycle)

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/client/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    metadata: {
      plan_slug: planSlug,
      billing_cycle: billingCycle,
    },
  })

  return session
}
```

### 5. Query Plans from Database

```typescript
import { createClient } from '@/lib/supabase/server'

async function getAllPlans() {
  const supabase = await createClient()

  const { data: plans } = await supabase
    .from('plan')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  return plans
}

async function getPlanBySlug(slug: string) {
  const supabase = await createClient()

  const { data: plan } = await supabase
    .from('plan')
    .select('*')
    .eq('slug', slug)
    .single()

  return plan
}
```

### 6. Format Pricing for Display

```typescript
import { PRICING, formatPrice, getAnnualSavings } from '@/lib/constants/stripe'

function PricingCard({ plan }: { plan: 'essential' | 'growth' | 'pro' | 'elite' }) {
  const monthlyPrice = formatPrice(PRICING[plan].monthly)
  const annualPrice = formatPrice(PRICING[plan].annual)
  const savings = formatPrice(getAnnualSavings(plan))

  return (
    <div>
      <p>Monthly: {monthlyPrice}/month</p>
      <p>Annual: {annualPrice}/year (save {savings}!)</p>
    </div>
  )
}
```

### 7. Webhook Handler

```typescript
import { verifyWebhookSignature } from '@/lib/stripe/webhooks'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const body = await req.text()
  const event = await verifyWebhookSignature(body)

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const supabase = await createClient()

      // Extract metadata
      const planSlug = session.metadata?.plan_slug
      const billingCycle = session.metadata?.billing_cycle

      // Get plan from database
      const { data: plan } = await supabase
        .from('plan')
        .select('id')
        .eq('slug', planSlug)
        .single()

      // Create subscription record
      await supabase.from('subscription').insert({
        profile_id: session.client_reference_id,
        plan_id: plan.id,
        stripe_subscription_id: session.subscription,
        status: 'active',
      })

      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object
      const supabase = await createClient()

      await supabase
        .from('subscription')
        .update({
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000),
          current_period_end: new Date(subscription.current_period_end * 1000),
        })
        .eq('stripe_subscription_id', subscription.id)

      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object
      const supabase = await createClient()

      await supabase
        .from('subscription')
        .update({
          status: 'canceled',
          canceled_at: new Date(),
        })
        .eq('stripe_subscription_id', subscription.id)

      break
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 })
}
```

---

## 🎯 Best Practices

### 1. Use Lookup Keys in Production

**DON'T:**
```typescript
// Hard-coded price ID
const priceId = 'price_1SMRoVP9fFsmlAaF9zkoG6QT'
```

**DO:**
```typescript
// Use lookup key or helper function
const priceId = getLookupKey('essential', 'monthly')
```

### 2. Store Plan Slug in Metadata

When creating Stripe sessions/subscriptions, always include plan metadata:

```typescript
metadata: {
  plan_slug: 'growth',
  billing_cycle: 'annual',
  // other relevant data
}
```

### 3. Sync Database with Stripe

Always keep your `plan` table in sync with Stripe products:
- Update `stripe_price_id_monthly` and `stripe_price_id_yearly` when prices change
- Update `features` JSONB when features change
- Use migrations to track changes

### 4. Handle Stripe Webhooks

Critical webhook events to handle:
- `checkout.session.completed` - Create subscription
- `customer.subscription.updated` - Update subscription status
- `customer.subscription.deleted` - Cancel subscription
- `invoice.payment_succeeded` - Confirm payment
- `invoice.payment_failed` - Handle failed payment

### 5. Tax Handling

All prices use `tax_behavior: 'exclusive'` meaning:
- Tax is calculated and added on top of the price
- Use Stripe Tax for automatic tax calculation
- Tax code `txcd_10103100` applies SaaS tax rules

---

## 🔧 Troubleshooting

### Price Mismatch

**Problem:** Database price IDs don't match Stripe Dashboard

**Solution:**
```bash
# Run verification script
npx tsx scripts/verify-stripe-setup.ts

# Update database if needed
npx tsx scripts/update-plans.ts
```

### Lookup Key Not Found

**Problem:** `No prices found for lookup key`

**Solution:**
- Verify lookup key exists in Stripe Dashboard
- Check spelling matches `STRIPE_LOOKUP_KEYS` constant
- Ensure price is active (not archived)

### Webhook Signature Verification Failed

**Problem:** `Webhook signature verification failed`

**Solution:**
1. Check `STRIPE_WEBHOOK_SECRET` in `.env.local`
2. Verify webhook endpoint URL in Stripe Dashboard
3. Ensure raw request body is passed to `verifyWebhookSignature()`

### Customer Not Found

**Problem:** Stripe customer doesn't exist for user

**Solution:**
1. Create Stripe customer before checkout:
```typescript
const customer = await stripe.customers.create({
  email: user.email,
  metadata: {
    profile_id: user.id,
  },
})

await supabase
  .from('profile')
  .update({ stripe_customer_id: customer.id })
  .eq('id', user.id)
```

---

## 📚 Additional Resources

- [Stripe Docs: Subscriptions](https://docs.stripe.com/billing/subscriptions)
- [Stripe Docs: Lookup Keys](https://docs.stripe.com/products-prices/manage-prices#lookup-keys)
- [Stripe Docs: Metadata](https://docs.stripe.com/metadata)
- [Stripe Docs: Webhooks](https://docs.stripe.com/webhooks)
- [Stripe Docs: Tax Behavior](https://docs.stripe.com/tax/products-prices-tax-codes-tax-behavior)

---

## 🚀 Next Steps

1. **Implement Pricing Page**: Display plans with pricing from constants
2. **Create Checkout Flow**: Use `createCheckoutSession` helper
3. **Set Up Webhooks**: Handle subscription lifecycle events
4. **Add Billing Portal**: Let customers manage subscriptions
5. **Implement Usage Tracking**: Monitor plan limits (page_limit, revision_limit)

---

**Last Updated:** 2025-01-26
**Stripe API Version:** 2025-09-30.clover
