import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getLocale } from '@/lib/i18n-server'
import { t } from '@/lib/i18n'
import { CategoryManager } from './CategoryManager'

export const dynamic = 'force-dynamic'

export default async function AdminHome() {
  const locale = await getLocale()
  const strings = t(locale)

  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
    include: {
      _count: { select: { items: true } },
    },
  })

  const initial = categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    nameEn: c.nameEn,
    nameRu: c.nameRu,
    itemCount: c._count.items,
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-heading font-bold">{strings.categories}</h1>
        <Link
          href="/menu"
          target="_blank"
          className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4"
        >
          {strings.menu} →
        </Link>
      </div>
      <CategoryManager initial={initial} />
    </div>
  )
}
