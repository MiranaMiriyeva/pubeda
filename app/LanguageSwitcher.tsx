'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { LOCALES, LOCALE_LABELS, type Locale } from '@/lib/i18n'
import { setLocale } from './actions/locale'
import { cn } from '@/lib/utils'

export function LanguageSwitcher({ current }: { current: Locale }) {
  const [pending, startTransition] = useTransition()
  const [value, setValue] = useState<Locale>(current)
  const router = useRouter()

  function change(next: Locale) {
    if (next === value) return
    setValue(next)
    startTransition(async () => {
      await setLocale(next)
      router.refresh()
    })
  }

  return (
    <div
      role="tablist"
      aria-label="Language"
      className="inline-flex items-center gap-0.5 rounded-full border border-border bg-card/80 backdrop-blur px-0.5 py-0.5 text-xs shadow-sm"
    >
      {LOCALES.map((l) => {
        const active = l === value
        return (
          <button
            key={l}
            role="tab"
            aria-selected={active}
            disabled={pending}
            onClick={() => change(l)}
            className={cn(
              'px-2.5 py-1 rounded-full font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {LOCALE_LABELS[l]}
          </button>
        )
      })}
    </div>
  )
}
