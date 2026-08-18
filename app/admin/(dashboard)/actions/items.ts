'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/require-admin'
import { itemSchema, type ItemInput } from '@/lib/validators'

function toDataInput(v: ItemInput) {
  return {
    title: v.title.trim(),
    titleEn: v.titleEn?.trim() || null,
    titleRu: v.titleRu?.trim() || null,
    subtitle: v.subtitle?.trim() || null,
    subtitleEn: v.subtitleEn?.trim() || null,
    subtitleRu: v.subtitleRu?.trim() || null,
    description: v.description?.trim() || null,
    descriptionEn: v.descriptionEn?.trim() || null,
    descriptionRu: v.descriptionRu?.trim() || null,
    price: new Prisma.Decimal(v.price),
    priceLabel: v.priceLabel?.trim() || null,
    isSet: v.isSet,
    available: v.available,
  }
}

export async function createItem(categoryId: string, raw: unknown) {
  await requireAdmin()
  const values = itemSchema.parse(raw)
  const last = await prisma.item.findFirst({
    where: { categoryId },
    orderBy: { displayOrder: 'desc' },
    select: { displayOrder: true },
  })
  const created = await prisma.item.create({
    data: {
      ...toDataInput(values),
      categoryId,
      displayOrder: (last?.displayOrder ?? -1) + 1,
    },
  })
  revalidatePath(`/admin/categories/${categoryId}`)
  revalidatePath('/menu')
  return created
}

export async function updateItem(id: string, raw: unknown) {
  await requireAdmin()
  const values = itemSchema.parse(raw)
  const updated = await prisma.item.update({
    where: { id },
    data: toDataInput(values),
  })
  revalidatePath(`/admin/categories/${updated.categoryId}`)
  revalidatePath('/menu')
  return updated
}

export async function toggleItemAvailability(id: string, available: boolean) {
  await requireAdmin()
  const updated = await prisma.item.update({
    where: { id },
    data: { available },
    select: { categoryId: true },
  })
  revalidatePath(`/admin/categories/${updated.categoryId}`)
  revalidatePath('/menu')
}

export async function deleteItem(id: string) {
  await requireAdmin()
  const item = await prisma.item.delete({
    where: { id },
    select: { categoryId: true },
  })
  revalidatePath(`/admin/categories/${item.categoryId}`)
  revalidatePath('/menu')
}

const reorderSchema = z.array(z.string().min(1))

export async function reorderItems(categoryId: string, orderedIds: string[]) {
  await requireAdmin()
  const ids = reorderSchema.parse(orderedIds)
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.item.update({
        where: { id },
        data: { displayOrder: index },
      }),
    ),
  )
  revalidatePath(`/admin/categories/${categoryId}`)
  revalidatePath('/menu')
}
