'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/require-admin'
import { categorySchema } from '@/lib/validators'
import { slugify } from '@/lib/utils'

async function nextDisplayOrder() {
  const last = await prisma.category.findFirst({
    orderBy: { displayOrder: 'desc' },
    select: { displayOrder: true },
  })
  return (last?.displayOrder ?? -1) + 1
}

async function ensureUniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const clean = slugify(base) || 'kateqoriya'
  let candidate = clean
  let n = 2
  while (true) {
    const existing = await prisma.category.findUnique({ where: { slug: candidate } })
    if (!existing || existing.id === ignoreId) return candidate
    candidate = `${clean}-${n++}`
  }
}

export async function createCategory(input: {
  name: string
  nameEn?: string | null
  nameRu?: string | null
}) {
  await requireAdmin()
  const parsed = categorySchema.omit({ slug: true }).parse({
    name: input.name.trim(),
    nameEn: input.nameEn?.trim() || null,
    nameRu: input.nameRu?.trim() || null,
  })
  const slug = await ensureUniqueSlug(parsed.name)
  const created = await prisma.category.create({
    data: {
      name: parsed.name,
      nameEn: parsed.nameEn,
      nameRu: parsed.nameRu,
      slug,
      displayOrder: await nextDisplayOrder(),
    },
  })
  revalidatePath('/admin')
  revalidatePath('/menu')
  return created
}

export async function updateCategory(
  id: string,
  input: { name: string; nameEn?: string | null; nameRu?: string | null },
) {
  await requireAdmin()
  const parsed = categorySchema.omit({ slug: true }).parse({
    name: input.name.trim(),
    nameEn: input.nameEn?.trim() || null,
    nameRu: input.nameRu?.trim() || null,
  })
  await prisma.category.update({
    where: { id },
    data: {
      name: parsed.name,
      nameEn: parsed.nameEn,
      nameRu: parsed.nameRu,
    },
  })
  revalidatePath('/admin')
  revalidatePath('/menu')
}

export async function deleteCategory(id: string) {
  await requireAdmin()
  await prisma.category.delete({ where: { id } })
  revalidatePath('/admin')
  revalidatePath('/menu')
}

const reorderSchema = z.array(z.string().min(1))

export async function reorderCategories(orderedIds: string[]) {
  await requireAdmin()
  const ids = reorderSchema.parse(orderedIds)
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.category.update({
        where: { id },
        data: { displayOrder: index },
      }),
    ),
  )
  revalidatePath('/admin')
  revalidatePath('/menu')
}
