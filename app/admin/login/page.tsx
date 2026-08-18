import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { getSettings, localizeSettings } from '@/lib/settings'
import { getLocale } from '@/lib/i18n-server'
import { t } from '@/lib/i18n'
import { LoginForm } from './LoginForm'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const session = await auth()
  if (session?.user) redirect('/admin')

  const params = await searchParams
  const errorParam = params.error === 'rate_limited' ? 'rate_limited' : null

  const locale = await getLocale()
  const settings = await getSettings()
  const l = localizeSettings(settings, locale)
  const strings = t(locale)

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-4 py-10 bg-pattern">
      <Link href="/" className="mb-6 flex flex-col items-center gap-2">
        <div className="relative w-16 h-16">
          <Image
            src="/logo.jpg"
            alt=""
            fill
            sizes="4rem"
            className="object-contain rounded-full"
          />
        </div>
        <span className="font-heading text-lg font-bold text-foreground">
          {l.shopName}
        </span>
      </Link>

      <div className="w-full max-w-sm rounded-2xl bg-card border border-border shadow-lg p-6 sm:p-8">
        <h1 className="text-xl font-heading font-bold text-foreground">
          {strings.loginTitle}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {strings.loginSubtitle}
        </p>

        <LoginForm
          initialError={errorParam}
          labels={{
            email: strings.email,
            password: strings.password,
            login: strings.login,
            invalidCredentials: strings.invalidCredentials,
            tooManyAttempts: strings.tooManyAttempts,
          }}
        />
      </div>
    </main>
  )
}
