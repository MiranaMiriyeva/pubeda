import { getSettings } from '@/lib/settings'
import { SettingsForm } from './SettingsForm'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const settings = await getSettings()
  return (
    <div>
      <h1 className="text-xl font-heading font-bold mb-4">Settings</h1>
      <SettingsForm initial={settings} />
    </div>
  )
}
