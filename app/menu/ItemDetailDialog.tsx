'use client'

import { useEffect } from 'react'
import { X, Sparkles } from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'
import type { MenuItem } from './MenuBoard'

interface Props {
  item: MenuItem | null
  currency: string
  setMenuLabel: string
  includesLabel: string
  unavailableLabel: string
  closeLabel: string
  onClose: () => void
}

export function ItemDetailDialog({
  item,
  currency,
  setMenuLabel,
  includesLabel,
  unavailableLabel,
  closeLabel,
  onClose,
}: Props) {
  useEffect(() => {
    if (!item) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [item, onClose])

  if (!item) return null
  const priceText = item.priceLabel || formatPrice(item.price, currency)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'relative w-full sm:max-w-md sm:mx-4 max-h-[85dvh] overflow-y-auto',
          'bg-card text-card-foreground rounded-t-3xl sm:rounded-2xl shadow-xl',
          'animate-in slide-in-from-bottom sm:zoom-in-95 duration-200',
          item.isSet && 'set-card',
        )}
      >
        <button
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-muted hover:bg-border flex items-center justify-center z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 pt-8 sm:p-8">
          {item.isSet && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-primary mb-2">
              <Sparkles className="w-3 h-3" />
              {setMenuLabel}
            </div>
          )}
          <h2 className="text-2xl font-heading font-bold text-foreground pr-8">
            {item.title}
          </h2>
          {item.subtitle && (
            <p className="mt-1 text-sm text-muted-foreground italic">
              {item.subtitle}
            </p>
          )}

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-heading font-bold text-primary text-2xl">
              {priceText}
            </span>
            {!item.available && (
              <span className="ml-auto text-xs uppercase tracking-wider font-semibold text-destructive">
                {unavailableLabel}
              </span>
            )}
          </div>

          {item.description && (
            <div className="mt-5 pt-5 border-t border-border">
              {item.isSet && (
                <div className="text-[10px] uppercase tracking-widest font-semibold text-accent mb-1.5">
                  {includesLabel}
                </div>
              )}
              <p className="text-[15px] leading-relaxed text-foreground/90 whitespace-pre-line">
                {item.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
