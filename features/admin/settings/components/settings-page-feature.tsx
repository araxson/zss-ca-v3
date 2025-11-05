import { getSystemSettings } from '../api/queries'

export async function SettingsPageFeature(): Promise<React.JSX.Element> {
  const _settings = await getSystemSettings()

  return (
    <div className="space-y-6">
      {/* TODO: Add settings forms and sections */}
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        Settings interface coming soon
      </div>
    </div>
  )
}
