import { getBillingData } from '../api/queries'
import { BILLING_PAGE } from '../api/constants'

export async function BillingPageFeature() {
  const data = await getBillingData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {BILLING_PAGE.title}
        </h1>
        <p className="text-muted-foreground">{BILLING_PAGE.description}</p>
      </div>

      {/* TODO: Add billing interface */}
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        Billing dashboard coming soon
      </div>
    </div>
  )
}
