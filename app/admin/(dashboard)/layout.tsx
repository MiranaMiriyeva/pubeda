import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { signOut, auth } from '@/auth'
import { LayoutList, Settings, LogOut, Store } from 'lucide-react'
import { getSettings, localizeSettings } from '@/lib/settings'
import { getLocale } from '@/lib/i18n-server'
import { t } from '@/lib/i18n'

async function signOutAction() {
  'use server'
  await signOut({ redirectTo: '/admin/login' })
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')

  const locale = await getLocale()
  const settings = await getSettings()
  const l = localizeSettings(settings, locale)
  const strings = t(locale)

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-5xl mx-auto flex items-center justify-between h-14 px-4">
          <Link href="/admin" className="flex items-center gap-2 min-w-0">
            <div className="relative w-8 h-8 shrink-0">
              <Image
                src="/logo.jpg"
                alt=""
                fill
                sizes="2rem"
                className="object-contain rounded-full"
              />
            </div>
            <span className="font-heading font-bold text-sm truncate">
              {l.shopName} · Admin
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/admin"
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              aria-label={strings.categories}
              title={strings.categories}
            >
              <LayoutList className="w-4 h-4" />
            </Link>
            <Link
              href="/admin/settings"
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              aria-label={strings.settings}
              title={strings.settings}
            >
              <Settings className="w-4 h-4" />
            </Link>
            <Link
              href="/menu"
              target="_blank"
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              aria-label={strings.menu}
              title={strings.menu}
            >
              <Store className="w-4 h-4" />
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                aria-label={strings.logout}
                title={strings.logout}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">{children}</main>
    </div>
  )
}
