import Link from 'next/link'
import Image from 'next/image'
import { Phone, MapPin, ArrowRight, Clock, ChevronDown } from 'lucide-react'
import { getSettings, localizeSettings } from '@/lib/settings'
import { getLocale } from '@/lib/i18n-server'
import { t } from '@/lib/i18n'
import { LanguageSwitcher } from './LanguageSwitcher'
import { InstagramIcon, FacebookIcon, WhatsappIcon } from './BrandIcons'

export const revalidate = 60

export default async function LandingPage() {
  const locale = await getLocale()
  const settings = await getSettings()
  const l = localizeSettings(settings, locale)
  const strings = t(locale)

  const mapsUrl =
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(l.address)

  const phoneHref = `tel:${l.phone.replace(/\s+/g, '')}`

  const hasHero = /^https?:\/\//.test(l.heroImageUrl)

  return (
    <main className="relative flex flex-col min-h-dvh bg-pattern">
      {/* Hero: full viewport with admin-editable background image */}
      <section className="relative isolate flex flex-col min-h-dvh overflow-hidden hero-grain">
        {/* Background layer */}
        <div className="absolute inset-0 -z-10">
          {hasHero ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={l.heroImageUrl}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover will-change-transform animate-ken-burns"
            />
          ) : (
            <div
              className="absolute inset-0 will-change-transform animate-ken-burns"
              style={{
                background:
                  'radial-gradient(circle at 25% 20%, color-mix(in oklab, var(--primary) 26%, transparent) 0, transparent 55%),' +
                  'radial-gradient(circle at 80% 80%, color-mix(in oklab, var(--accent) 30%, transparent) 0, transparent 55%),' +
                  'linear-gradient(140deg, #1a1210 0%, #2a1a14 60%, #1a1210 100%)',
              }}
            />
          )}

          {/* Legibility overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[color-mix(in_oklab,var(--primary)_35%,transparent)] via-transparent to-[color-mix(in_oklab,var(--accent)_25%,transparent)] mix-blend-soft-light" />
          {/* Warm nostalgic tint (echoes IG's retro aesthetic) */}
          <div className="hero-sepia" aria-hidden />

          {/* Floating color orbs for depth */}
          <div
            className="absolute -top-24 -left-16 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-40 animate-float-orb"
            style={{ background: 'color-mix(in oklab, var(--primary) 55%, transparent)' }}
          />
          <div
            className="absolute -bottom-32 -right-20 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-35 animate-float-orb animation-delay-500"
            style={{ background: 'color-mix(in oklab, var(--accent) 60%, transparent)' }}
          />
        </div>

        <header className="relative flex items-center justify-end px-4 pt-4 animate-fade-in">
          <LanguageSwitcher current={locale} />
        </header>

        <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-10 text-center text-white">
          {/* Logo with animated ring */}
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-6 animate-fade-up">
            <div
              className="absolute -inset-3 rounded-full opacity-70 animate-ring-drift"
              style={{
                background:
                  'conic-gradient(from 0deg, color-mix(in oklab, var(--primary) 70%, transparent), transparent 40%, color-mix(in oklab, var(--accent) 70%, transparent), transparent 80%)',
                filter: 'blur(14px)',
              }}
              aria-hidden
            />
            <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-white/25 shadow-2xl backdrop-blur-sm">
              <Image
                src="/logo.jpg"
                alt={l.shopName}
                fill
                sizes="(max-width: 640px) 10rem, 12rem"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="animate-fade-up animation-delay-100 mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/25 bg-white/10 backdrop-blur-md text-[11px] sm:text-xs uppercase tracking-[0.18em] font-semibold text-white/90">
            <span aria-hidden>🎞️</span>
            <span>{strings.heroBadge}</span>
            <span aria-hidden>🎞️</span>
          </div>

          <h1 className="animate-fade-up animation-delay-200 font-heading font-bold tracking-tight text-5xl sm:text-6xl md:text-7xl drop-shadow-[0_2px_20px_rgba(0,0,0,0.45)]">
            <span className="text-shimmer">{l.shopName}</span>
          </h1>

          {l.tagline && (
            <p className="animate-fade-up animation-delay-300 mt-4 max-w-xl text-base sm:text-lg italic text-white/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)]">
              {l.tagline}
            </p>
          )}

          <div className="animate-fade-up animation-delay-500 mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-sm">
            <Link
              href="/menu"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold transition-all hover:bg-primary-hover hover:-translate-y-0.5 hover:scale-[1.02] animate-glow"
            >
              {strings.viewMenu}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            {l.phone && (
              <a
                href={phoneHref}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/40 bg-white/10 text-white font-semibold backdrop-blur-md transition-all hover:bg-white/20 hover:-translate-y-0.5"
              >
                <Phone className="w-4 h-4" />
                {strings.callUs}
              </a>
            )}
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-fade-up animation-delay-700 mt-5 inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors"
          >
            <MapPin className="w-4 h-4" />
            {strings.directions}
          </a>
        </div>

        {/* Scroll cue */}
        <div className="relative pb-6 flex justify-center animate-fade-in animation-delay-1000">
          <ChevronDown
            className="w-6 h-6 text-white/70 animate-scroll-cue"
            aria-hidden
          />
        </div>
      </section>

      {l.about && (
        <section className="px-6 py-16 sm:py-20">
          <div className="relative max-w-2xl mx-auto">
            <div
              className="absolute -inset-6 sm:-inset-10 -z-10 opacity-40 blur-3xl rounded-[3rem]"
              style={{
                background:
                  'radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--primary) 25%, transparent) 0, transparent 60%),' +
                  'radial-gradient(circle at 70% 70%, color-mix(in oklab, var(--accent) 30%, transparent) 0, transparent 60%)',
              }}
              aria-hidden
            />

            <article
              className="relative overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-xl px-7 sm:px-10 py-10 sm:py-12 text-center"
              style={{
                backgroundImage:
                  'linear-gradient(180deg, color-mix(in oklab, var(--accent) 6%, var(--card)) 0%, var(--card) 70%)',
              }}
            >
              <span
                className="pointer-events-none absolute top-3 left-5 font-heading text-[7rem] sm:text-[9rem] leading-none text-primary/15 select-none"
                aria-hidden
              >
                “
              </span>
              <span
                className="pointer-events-none absolute bottom-0 right-5 font-heading text-[7rem] sm:text-[9rem] leading-none text-primary/15 select-none"
                aria-hidden
              >
                ”
              </span>

              <div className="relative">
                <div className="mx-auto mb-5 flex items-center justify-center gap-3 text-primary">
                  <span className="h-px w-8 bg-primary/40" />
                  <span className="text-[11px] uppercase tracking-[0.28em] font-semibold">
                    {strings.aboutUs}
                  </span>
                  <span className="h-px w-8 bg-primary/40" />
                </div>

                <p className="font-heading text-lg sm:text-xl leading-relaxed text-foreground/90 italic">
                  {l.about}
                </p>
              </div>
            </article>
          </div>
        </section>
      )}

      <footer className="mt-auto px-6 py-8 border-t border-border bg-card/60">
        <div className="max-w-2xl mx-auto grid gap-5 sm:grid-cols-3">
          {l.address && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
              <div>
                <div className="font-semibold text-foreground mb-0.5">{strings.address}</div>
                <div className="text-muted-foreground">{l.address}</div>
              </div>
            </div>
          )}
          {l.hours && (
            <div className="flex items-start gap-2 text-sm">
              <Clock className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
              <div>
                <div className="font-semibold text-foreground mb-0.5">{strings.hours}</div>
                <div className="text-muted-foreground">{l.hours}</div>
              </div>
            </div>
          )}
          {(l.phone || l.email) && (
            <div className="flex items-start gap-2 text-sm">
              <Phone className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
              <div>
                <div className="font-semibold text-foreground mb-0.5">{strings.contact}</div>
                {l.phone && (
                  <a
                    href={phoneHref}
                    className="block text-muted-foreground hover:text-foreground"
                  >
                    {l.phone}
                  </a>
                )}
                {l.email && (
                  <a
                    href={`mailto:${l.email}`}
                    className="block text-muted-foreground hover:text-foreground"
                  >
                    {l.email}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          {l.instagram && (
            <a
              href={l.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
          )}
          {l.facebook && (
            <a
              href={l.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
            >
              <FacebookIcon className="w-5 h-5" />
            </a>
          )}
          {l.whatsapp && (
            <a
              href={l.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
            >
              <WhatsappIcon className="w-5 h-5" />
            </a>
          )}
        </div>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {l.shopName}
        </div>
      </footer>
    </main>
  )
}
