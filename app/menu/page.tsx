import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getSettings, localizeSettings } from '@/lib/settings'
import { getLocale } from '@/lib/i18n-server'
import { pickLocalized, t } from '@/lib/i18n'
import { LanguageSwitcher } from '../LanguageSwitcher'
import { MenuBoard } from './MenuBoard'

export const revalidate = 60

export default async function MenuPage() {
  const locale = await getLocale()
  const [rawCategories, settings] = await Promise.all([
    prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        items: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    }),
    getSettings(),
  ])

  const l = localizeSettings(settings, locale)
  const strings = t(locale)

  // Serialize Decimal → number for client component and localize text fields
  const categories = rawCategories.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: pickLocalized(c, 'name', locale),
    items: c.items.map((it) => ({
      id: it.id,
      title: pickLocalized(it, 'title', locale),
      subtitle: pickLocalized(it, 'subtitle', locale) || null,
      description: pickLocalized(it, 'description', locale) || null,
      price: Number(it.price),
      priceLabel: it.priceLabel,
      isSet: it.isSet,
      available: it.available,
    })),
  })).filter((c) => c.items.length > 0)

  return (
    <div className="flex flex-col min-h-dvh">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{strings.backToHome}</span>
          </Link>

          <div className="flex items-center gap-2 min-w-0">
            <div className="relative w-8 h-8 shrink-0">
              <Image
                src="/logo.jpg"
                alt=""
                fill
                sizes="2rem"
                className="object-contain rounded-full"
              />
            </div>
            <h1 className="text-base font-heading font-bold truncate">
              {l.shopName}
            </h1>
          </div>

          <LanguageSwitcher current={locale} />
        </div>
      </header>

      {/* Decorative page banner */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[color-mix(in_oklab,var(--accent)_10%,var(--background))] to-background border-b border-border">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 20% 30%, color-mix(in oklab, var(--primary) 22%, transparent) 0, transparent 55%),' +
              'radial-gradient(circle at 80% 70%, color-mix(in oklab, var(--accent) 28%, transparent) 0, transparent 55%)',
          }}
          aria-hidden
        />
        <div className="relative max-w-3xl mx-auto px-6 py-8 sm:py-10 text-center">
          <div className="mx-auto mb-3 flex items-center justify-center gap-3 text-primary animate-fade-up">
            <span className="h-px w-10 bg-primary/40" />
            <span className="text-[11px] uppercase tracking-[0.32em] font-semibold">
              {strings.menu}
            </span>
            <span className="h-px w-10 bg-primary/40" />
          </div>
          <h1 className="animate-fade-up animation-delay-100 font-heading font-bold text-3xl sm:text-4xl tracking-tight text-foreground">
            <span className="text-shimmer">{l.shopName}</span>
          </h1>
          {l.tagline && (
            <p className="animate-fade-up animation-delay-200 mt-2 text-sm sm:text-base italic text-muted-foreground">
              {l.tagline}
            </p>
          )}
        </div>
      </div>

      <MenuBoard
        categories={categories}
        currency={l.currencySymbol}
        setMenuLabel={strings.setMenu}
        includesLabel={strings.includes}
        unavailableLabel={strings.unavailableToday}
        closeLabel={strings.close}
      />

      <footer className="mt-8 px-6 py-6 border-t border-border bg-card/40 text-center">
        {l.serviceChargeNote && (
          <p className="text-xs sm:text-sm text-muted-foreground">
            {l.serviceChargeNote}
          </p>
        )}
        <p className="mt-2 text-xs text-muted-foreground/70">
          © {new Date().getFullYear()} {l.shopName}
        </p>
      </footer>
    </div>
  )
}
