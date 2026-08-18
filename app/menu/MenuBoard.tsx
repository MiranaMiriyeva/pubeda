'use client'

import { useState, useCallback } from 'react'
import { MenuCategoryNav } from './MenuCategoryNav'
import { ItemDetailDialog } from './ItemDetailDialog'
import { formatPrice, cn } from '@/lib/utils'
import { Sparkles } from 'lucide-react'

export interface MenuItem {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  price: number
  priceLabel: string | null
  isSet: boolean
  available: boolean
}

export interface MenuCategory {
  id: string
  slug: string
  name: string
  items: MenuItem[]
}

interface Props {
  categories: MenuCategory[]
  currency: string
  setMenuLabel: string
  includesLabel: string
  unavailableLabel: string
  closeLabel: string
}

export function MenuBoard({
  categories,
  currency,
  setMenuLabel,
  includesLabel,
  unavailableLabel,
  closeLabel,
}: Props) {
  const [openItem, setOpenItem] = useState<MenuItem | null>(null)

  const open = useCallback((item: MenuItem) => setOpenItem(item), [])
  const close = useCallback(() => setOpenItem(null), [])

  return (
    <>
      <MenuCategoryNav categories={categories} />

      <div className="px-4 pb-16 pt-2 max-w-3xl mx-auto w-full">
        {categories.map((cat) => (
          <section
            key={cat.id}
            id={`cat-${cat.slug}`}
            className="scroll-mt-32 pt-10 first:pt-6"
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/40" />
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-foreground whitespace-nowrap">
                {cat.name}
              </h2>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/40" />
            </div>
            <div className="space-y-2.5">
              {cat.items.map((item, i) =>
                item.isSet ? (
                  <SetItemCard
                    key={item.id}
                    item={item}
                    index={i}
                    currency={currency}
                    setMenuLabel={setMenuLabel}
                    includesLabel={includesLabel}
                    unavailableLabel={unavailableLabel}
                    onOpen={open}
                  />
                ) : (
                  <RegularItemCard
                    key={item.id}
                    item={item}
                    index={i}
                    currency={currency}
                    unavailableLabel={unavailableLabel}
                    onOpen={open}
                  />
                ),
              )}
            </div>
          </section>
        ))}
      </div>

      <ItemDetailDialog
        item={openItem}
        currency={currency}
        setMenuLabel={setMenuLabel}
        includesLabel={includesLabel}
        unavailableLabel={unavailableLabel}
        closeLabel={closeLabel}
        onClose={close}
      />
    </>
  )
}

function RegularItemCard({
  item,
  index,
  currency,
  unavailableLabel,
  onOpen,
}: {
  item: MenuItem
  index: number
  currency: string
  unavailableLabel: string
  onOpen: (item: MenuItem) => void
}) {
  const priceText = item.priceLabel || formatPrice(item.price, currency)
  return (
    <button
      onClick={() => onOpen(item)}
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
      className={cn(
        'animate-reveal group w-full text-left flex items-start gap-3 rounded-lg bg-card border border-border/60 px-3.5 py-3 hover:border-primary/60 hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-[0.99]',
        !item.available && 'opacity-55',
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="menu-row">
          <span className="font-semibold text-foreground text-[15px] leading-snug">
            {item.title}
          </span>
          <span className="leader" aria-hidden />
          <span className="shrink-0 font-heading font-bold text-primary tabular-nums">
            {priceText}
          </span>
        </div>
        {item.subtitle && (
          <p className="mt-1 text-xs text-muted-foreground leading-snug">
            {item.subtitle}
          </p>
        )}
        {!item.available && (
          <span className="inline-block mt-1.5 text-[10px] uppercase tracking-wider font-semibold text-destructive/80">
            {unavailableLabel}
          </span>
        )}
      </div>
    </button>
  )
}

function SetItemCard({
  item,
  index,
  currency,
  setMenuLabel,
  includesLabel,
  unavailableLabel,
  onOpen,
}: {
  item: MenuItem
  index: number
  currency: string
  setMenuLabel: string
  includesLabel: string
  unavailableLabel: string
  onOpen: (item: MenuItem) => void
}) {
  const priceText = item.priceLabel || formatPrice(item.price, currency)
  return (
    <button
      onClick={() => onOpen(item)}
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
      className={cn(
        'set-card animate-reveal group relative w-full text-left rounded-[var(--radius)] px-5 py-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-[0.99]',
        !item.available && 'opacity-55',
      )}
    >
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-primary mb-1.5">
        <Sparkles className="w-3 h-3" />
        {setMenuLabel}
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-heading font-bold text-lg leading-tight text-foreground">
          {item.title}
        </h3>
        <span className="shrink-0 font-heading font-bold text-primary text-lg tabular-nums">
          {priceText}
        </span>
      </div>

      {item.subtitle && (
        <p className="mt-1 text-sm text-muted-foreground italic">
          {item.subtitle}
        </p>
      )}

      {item.description && (
        <div className="mt-3 pt-3 border-t border-dashed border-border/70">
          <div className="text-[10px] uppercase tracking-widest font-semibold text-accent mb-1">
            {includesLabel}
          </div>
          <p className="text-sm text-foreground/85 leading-relaxed">
            {item.description}
          </p>
        </div>
      )}

      {!item.available && (
        <span className="inline-block mt-2 text-[10px] uppercase tracking-wider font-semibold text-destructive/80">
          {unavailableLabel}
        </span>
      )}
    </button>
  )
}
