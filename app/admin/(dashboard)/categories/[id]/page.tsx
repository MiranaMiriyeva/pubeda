import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { ItemManager } from './ItemManager'

export const dynamic = 'force-dynamic'

export default async function CategoryItemsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const cat = await prisma.category.findUnique({
    where: { id },
    include: {
      items: { orderBy: { displayOrder: 'asc' } },
    },
  })
  if (!cat) notFound()

  const items = cat.items.map((it) => ({
    id: it.id,
    title: it.title,
    titleEn: it.titleEn,
    titleRu: it.titleRu,
    subtitle: it.subtitle,
    subtitleEn: it.subtitleEn,
    subtitleRu: it.subtitleRu,
    description: it.description,
    descriptionEn: it.descriptionEn,
    descriptionRu: it.descriptionRu,
    price: Number(it.price),
    priceLabel: it.priceLabel,
    isSet: it.isSet,
    available: it.available,
  }))

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3"
      >
        <ChevronLeft className="w-4 h-4" />
        Categories
      </Link>
      <h1 className="text-xl font-heading font-bold mb-1">{cat.name}</h1>
      <p className="text-sm text-muted-foreground mb-4">
        {items.length} {items.length === 1 ? 'item' : 'items'}
      </p>
      <ItemManager categoryId={cat.id} initial={items} />
    </div>
  )
}
