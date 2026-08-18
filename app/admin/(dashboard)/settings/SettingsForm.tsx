'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { updateSettings } from '../actions/settings'

const LOCALIZED_FIELDS: Array<{
  base: string
  label: string
  type: 'input' | 'textarea'
  placeholder?: string
}> = [
  { base: 'shop_name', label: 'Shop name', type: 'input' },
  { base: 'tagline', label: 'Tagline', type: 'input' },
  { base: 'about', label: 'About', type: 'textarea' },
  { base: 'hours', label: 'Opening hours', type: 'input', placeholder: 'e.g. Every day 12:00 – 02:00' },
  { base: 'address', label: 'Address', type: 'input' },
  { base: 'service_charge_note', label: 'Service-charge notice', type: 'input' },
]

const SIMPLE_FIELDS: Array<{ key: string; label: string; placeholder?: string; type?: string }> = [
  { key: 'phone', label: 'Phone', placeholder: '+994 50 000 00 00' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/…' },
  { key: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/…' },
  { key: 'whatsapp', label: 'WhatsApp URL', placeholder: 'https://wa.me/994…' },
  { key: 'currency_symbol', label: 'Currency symbol', placeholder: '₼' },
]

type FormState = Record<string, string>

export function SettingsForm({ initial }: { initial: FormState }) {
  const [state, setState] = useState<FormState>(initial)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function set(key: string, value: string) {
    setState((s) => ({ ...s, [key]: value }))
  }

  function save() {
    startTransition(async () => {
      try {
        await updateSettings(state)
        toast.success('Saved')
        router.refresh()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Save failed')
      }
    })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        save()
      }}
      className="space-y-8"
    >
      <Section title="Restaurant info">
        {LOCALIZED_FIELDS.map((f) => (
          <TrilingualField
            key={f.base}
            base={f.base}
            label={f.label}
            type={f.type}
            placeholder={f.placeholder}
            values={state}
            onChange={set}
          />
        ))}
      </Section>

      <Section title="Contact & socials">
        <div className="grid sm:grid-cols-2 gap-3">
          {SIMPLE_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="block text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">
                {f.label}
              </label>
              <input
                type={f.type ?? 'text'}
                value={state[f.key] ?? ''}
                onChange={(e) => set(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full h-10 rounded-lg border border-border bg-background px-3 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Homepage hero image">
        <p className="text-xs text-muted-foreground mb-3">
          Full-screen background on the landing page. Paste an HTTPS URL to any
          image (16:9 or wider works best). Leave blank to use the default
          textured pattern.
        </p>
        <div className="flex items-start gap-3">
          <div
            className="w-24 h-16 rounded-lg border border-border shrink-0 bg-muted bg-cover bg-center"
            style={
              /^https?:\/\//.test(state.hero_image_url ?? '')
                ? { backgroundImage: `url(${state.hero_image_url})` }
                : undefined
            }
            aria-hidden
          />
          <input
            value={state.hero_image_url ?? ''}
            onChange={(e) => set('hero_image_url', e.target.value)}
            placeholder="https://images.example.com/hero.jpg"
            className="flex-1 h-10 rounded-lg border border-border bg-background px-3 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-sm"
          />
        </div>
      </Section>

      <Section title="Theme colors">
        <p className="text-xs text-muted-foreground mb-3">
          Refresh the page after saving to see the new colors everywhere.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <ColorField
            label="Primary"
            hint="Buttons, links, category pills"
            value={state.theme_primary ?? '#D91E1E'}
            onChange={(v) => set('theme_primary', v)}
          />
          <ColorField
            label="Accent"
            hint="Set-menu highlights"
            value={state.theme_accent ?? '#C89632'}
            onChange={(v) => set('theme_accent', v)}
          />
        </div>
      </Section>

      <div className="sticky bottom-0 -mx-4 px-4 py-3 bg-background/95 backdrop-blur border-t border-border">
        <div className="max-w-5xl mx-auto flex justify-end">
          <button
            type="submit"
            disabled={pending}
            className="h-11 px-6 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary-hover disabled:opacity-60 flex items-center gap-2"
          >
            {pending && <Loader2 className="w-4 h-4 animate-spin" />}
            Save changes
          </button>
        </div>
      </div>
    </form>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl bg-card border border-border p-4 sm:p-5">
      <h2 className="text-sm font-heading font-bold uppercase tracking-wider text-foreground mb-4">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function TrilingualField({
  base,
  label,
  type,
  placeholder,
  values,
  onChange,
}: {
  base: string
  label: string
  type: 'input' | 'textarea'
  placeholder?: string
  values: FormState
  onChange: (k: string, v: string) => void
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2">
        {label}
      </div>
      <div className="grid sm:grid-cols-3 gap-2">
        {(['', '_en', '_ru'] as const).map((suffix) => {
          const key = base + suffix
          const flag = suffix === '' ? 'AZ' : suffix === '_en' ? 'EN' : 'RU'
          return (
            <div key={key}>
              <div className="text-[10px] font-bold text-muted-foreground mb-1">{flag}</div>
              {type === 'textarea' ? (
                <textarea
                  rows={3}
                  value={values[key] ?? ''}
                  onChange={(e) => onChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring resize-y text-sm"
                />
              ) : (
                <input
                  value={values[key] ?? ''}
                  onChange={(e) => onChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="w-full h-10 rounded-lg border border-border bg-background px-3 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-sm"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ColorField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string
  hint: string
  value: string
  onChange: (v: string) => void
}) {
  const safe = /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000'
  return (
    <div className="flex items-center gap-3">
      <label
        className="w-12 h-12 rounded-lg border border-border shrink-0 cursor-pointer overflow-hidden"
        style={{ background: safe }}
      >
        <input
          type="color"
          value={safe}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          className="w-full h-full opacity-0 cursor-pointer"
        />
      </label>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground mb-1">{hint}</div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          maxLength={7}
          className="w-full h-9 rounded-md border border-border bg-background px-2 font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  )
}
