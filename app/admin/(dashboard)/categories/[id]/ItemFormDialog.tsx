'use client'

import { useEffect, useState } from 'react'
import { X, Loader2, Sparkles } from 'lucide-react'

export interface ItemFormValues {
  title: string
  titleEn: string | null
  titleRu: string | null
  subtitle: string | null
  subtitleEn: string | null
  subtitleRu: string | null
  description: string | null
  descriptionEn: string | null
  descriptionRu: string | null
  price: number
  priceLabel: string | null
  isSet: boolean
  available: boolean
}

interface Initial {
  title: string
  titleEn: string
  titleRu: string
  subtitle: string
  subtitleEn: string
  subtitleRu: string
  description: string
  descriptionEn: string
  descriptionRu: string
  price: number
  priceLabel: string
  isSet: boolean
  available: boolean
}

export function ItemFormDialog({
  initial,
  isEdit,
  onCancel,
  onSubmit,
}: {
  initial: Initial
  isEdit: boolean
  onCancel: () => void
  onSubmit: (v: ItemFormValues) => Promise<void> | void
}) {
  const [state, setState] = useState<Initial>(initial)
  const [tab, setTab] = useState<'az' | 'en' | 'ru'>('az')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onCancel])

  function set<K extends keyof Initial>(k: K, v: Initial[K]) {
    setState((s) => ({ ...s, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting || !state.title.trim()) return
    setSubmitting(true)
    try {
      await onSubmit({
        title: state.title.trim(),
        titleEn: state.titleEn.trim() || null,
        titleRu: state.titleRu.trim() || null,
        subtitle: state.subtitle.trim() || null,
        subtitleEn: state.subtitleEn.trim() || null,
        subtitleRu: state.subtitleRu.trim() || null,
        description: state.description.trim() || null,
        descriptionEn: state.descriptionEn.trim() || null,
        descriptionRu: state.descriptionRu.trim() || null,
        price: Number(state.price) || 0,
        priceLabel: state.priceLabel.trim() || null,
        isSet: state.isSet,
        available: state.available,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const tabs: Array<{ key: 'az' | 'en' | 'ru'; label: string }> = [
    { key: 'az', label: 'AZ' },
    { key: 'en', label: 'EN' },
    { key: 'ru', label: 'RU' },
  ]

  const titleField =
    tab === 'az' ? 'title' : tab === 'en' ? 'titleEn' : 'titleRu'
  const subtitleField =
    tab === 'az' ? 'subtitle' : tab === 'en' ? 'subtitleEn' : 'subtitleRu'
  const descField =
    tab === 'az' ? 'description' : tab === 'en' ? 'descriptionEn' : 'descriptionRu'

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onCancel}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-lg sm:mx-4 max-h-[90dvh] overflow-y-auto bg-card rounded-t-3xl sm:rounded-2xl shadow-xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
      >
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-muted hover:bg-border flex items-center justify-center z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-7 space-y-4">
          <h2 className="text-lg font-heading font-bold">
            {isEdit ? 'Edit item' : 'New item'}
          </h2>

          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted w-fit">
            {tabs.map((tab_) => (
              <button
                key={tab_.key}
                type="button"
                onClick={() => setTab(tab_.key)}
                className={
                  'px-3 py-1 rounded-md text-xs font-semibold ' +
                  (tab === tab_.key
                    ? 'bg-card shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground')
                }
              >
                {tab_.label}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">
              Title ({tab.toUpperCase()})
              {tab === 'az' && <span className="text-primary ml-1">*</span>}
            </label>
            <input
              value={state[titleField]}
              onChange={(e) => set(titleField, e.target.value)}
              required={tab === 'az'}
              maxLength={200}
              className="w-full h-10 rounded-lg border border-border bg-background px-3 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">
              Subtitle ({tab.toUpperCase()})
            </label>
            <input
              value={state[subtitleField]}
              onChange={(e) => set(subtitleField, e.target.value)}
              maxLength={300}
              placeholder="e.g. 50 ml / 0.5 L / 1 L"
              className="w-full h-10 rounded-lg border border-border bg-background px-3 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">
              Description ({tab.toUpperCase()})
            </label>
            <textarea
              value={state[descField]}
              onChange={(e) => set(descField, e.target.value)}
              maxLength={2000}
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1 mt-3">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={state.price}
                onChange={(e) => set('price', Number(e.target.value))}
                required
                className="w-full h-10 rounded-lg border border-border bg-background px-3 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1 mt-3">
                Price label
              </label>
              <input
                value={state.priceLabel}
                onChange={(e) => set('priceLabel', e.target.value)}
                placeholder="e.g. 7 / 55 / 90 ₼"
                maxLength={80}
                className="w-full h-10 rounded-lg border border-border bg-background px-3 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              />
            </div>
            <p className="col-span-2 -mt-1 text-[11px] text-muted-foreground">
              Leave the label empty to auto-format. Use it for multi-size drinks like whisky where you want to show "7 / 55 / 90 ₼".
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            <label className="flex items-center justify-between gap-3 cursor-pointer py-2">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Set menu</span>
                <span className="text-xs text-muted-foreground">— special premium card</span>
              </span>
              <input
                type="checkbox"
                checked={state.isSet}
                onChange={(e) => set('isSet', e.target.checked)}
                className="w-5 h-5 rounded accent-[var(--primary)]"
              />
            </label>
            <label className="flex items-center justify-between gap-3 cursor-pointer py-2">
              <span className="text-sm font-medium">Available</span>
              <input
                type="checkbox"
                checked={state.available}
                onChange={(e) => set('available', e.target.checked)}
                className="w-5 h-5 rounded accent-[var(--primary)]"
              />
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 h-10 rounded-lg border border-border hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !state.title.trim()}
              className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary-hover disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
