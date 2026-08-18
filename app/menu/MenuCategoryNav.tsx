'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { MenuCategory } from './MenuBoard'

export function MenuCategoryNav({ categories }: { categories: MenuCategory[] }) {
  const [active, setActive] = useState<string>(categories[0]?.slug ?? '')
  const navRef = useRef<HTMLDivElement>(null)
  const pillRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  // Scroll-spy: pick the section closest to the top of the viewport
  useEffect(() => {
    if (typeof window === 'undefined' || categories.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the largest intersection ratio that's visible
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) {
          const slug = visible.target.id.replace(/^cat-/, '')
          setActive(slug)
        }
      },
      {
        rootMargin: '-140px 0px -60% 0px',
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
      },
    )
    categories.forEach((c) => {
      const el = document.getElementById(`cat-${c.slug}`)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [categories])

  // Auto-scroll the pill row to keep the active pill in view
  useEffect(() => {
    const pill = pillRefs.current.get(active)
    if (pill && navRef.current) {
      pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [active])

  const handleClick = (slug: string) => {
    const el = document.getElementById(`cat-${slug}`)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 120
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <nav
      ref={navRef}
      className="sticky top-14 z-20 bg-background/95 backdrop-blur border-b border-border overflow-x-auto no-scrollbar"
    >
      <div className="flex items-center gap-1.5 px-4 py-2.5 whitespace-nowrap">
        {categories.map((c) => (
          <button
            key={c.slug}
            ref={(el) => {
              if (el) pillRefs.current.set(c.slug, el)
            }}
            onClick={() => handleClick(c.slug)}
            className={cn(
              'shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all',
              active === c.slug
                ? 'bg-primary text-primary-foreground shadow-[0_4px_16px_-4px_color-mix(in_oklab,var(--primary)_60%,transparent)] scale-[1.03]'
                : 'bg-card text-muted-foreground border border-border hover:text-foreground hover:border-primary/50',
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
    </nav>
  )
}
