'use client'

import { useEffect, useState } from 'react'
import { X, Loader2 } from 'lucide-react'

export interface CategoryFormValues {
  name: string
  nameEn: string | null
  nameRu: string | null
}

export function CategoryDialog({
  initial,
  onCancel,
  onSubmit,
}: {
  initial: { name: string; nameEn: string; nameRu: string }
  onCancel: () => void
  onSubmit: (values: CategoryFormValues) => Promise<void> | void
}) {
  const [name, setName] = useState(initial.name)
  const [nameEn, setNameEn] = useState(initial.nameEn)
  const [nameRu, setNameRu] = useState(initial.nameRu)
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting || !name.trim()) return
    setSubmitting(true)
    try {
      await onSubmit({
        name: name.trim(),
        nameEn: nameEn.trim() || null,
        nameRu: nameRu.trim() || null,
      })
    } finally {
      setSubmitting(false)
    }
  }

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
        className="relative w-full sm:max-w-md sm:mx-4 max-h-[85dvh] overflow-y-auto bg-card rounded-t-3xl sm:rounded-2xl shadow-xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
      >
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-muted hover:bg-border flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-7 space-y-3">
          <h2 className="text-lg font-heading font-bold">
            {initial.name ? 'Edit category' : 'New category'}
          </h2>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">
              Name (AZ)
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={120}
              className="w-full h-10 rounded-lg border border-border bg-background px-3 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">
              Name (EN)
            </label>
            <input
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              maxLength={120}
              className="w-full h-10 rounded-lg border border-border bg-background px-3 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">
              Name (RU)
            </label>
            <input
              value={nameRu}
              onChange={(e) => setNameRu(e.target.value)}
              maxLength={120}
              className="w-full h-10 rounded-lg border border-border bg-background px-3 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
            />
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
              disabled={submitting || !name.trim()}
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
