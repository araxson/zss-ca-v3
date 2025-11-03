import { getSystemSettings } from '../api/queries'
import { SETTINGS_PAGE } from '../api/constants'

export async function SettingsPageFeature() {
  const settings = await getSystemSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {SETTINGS_PAGE.title}
        </h1>
        <p className="text-muted-foreground">{SETTINGS_PAGE.description}</p>
      </div>

      {/* TODO: Add settings forms and sections */}
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        Settings interface coming soon
      </div>
    </div>
  )
}
