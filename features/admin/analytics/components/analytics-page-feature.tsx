import { getAnalyticsData } from '../api/queries'
import { ANALYTICS_PAGE } from '../api/constants'

export async function AnalyticsPageFeature() {
  const data = await getAnalyticsData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {ANALYTICS_PAGE.title}
        </h1>
        <p className="text-muted-foreground">{ANALYTICS_PAGE.description}</p>
      </div>

      {/* TODO: Add analytics charts and metrics */}
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        Analytics dashboard coming soon
      </div>
    </div>
  )
}
