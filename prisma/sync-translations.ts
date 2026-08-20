// Push EN/RU translations from menu-data.ts into the DB without touching
// prices, availability, images, or ordering. Matches items by category slug
// + base (Azerbaijani) title.
//
//   npx tsx prisma/sync-translations.ts          # dry run — prints what would change
//   npx tsx prisma/sync-translations.ts --apply  # actually write the updates

import { PrismaClient } from '@prisma/client'
import { menuData } from './menu-data'

const prisma = new PrismaClient()

async function main() {
  const apply = process.argv.includes('--apply')

  let itemsUpdated = 0
  let itemsMissing = 0
  let categoriesUpdated = 0
  let categoriesMissing = 0

  for (const cat of menuData) {
    const dbCat = await prisma.category.findUnique({
      where: { slug: cat.slug },
      include: { items: true },
    })

    if (!dbCat) {
      categoriesMissing++
      console.log(`✗ category not found: ${cat.slug} (${cat.name})`)
      continue
    }

    const catNeedsUpdate =
      dbCat.nameEn !== cat.nameEn || dbCat.nameRu !== cat.nameRu

    if (catNeedsUpdate) {
      categoriesUpdated++
      console.log(
        `~ category ${cat.slug}: nameEn "${dbCat.nameEn ?? ''}" → "${cat.nameEn}", nameRu "${dbCat.nameRu ?? ''}" → "${cat.nameRu}"`,
      )
      if (apply) {
        await prisma.category.update({
          where: { id: dbCat.id },
          data: { nameEn: cat.nameEn, nameRu: cat.nameRu },
        })
      }
    }

    for (const seed of cat.items) {
      const dbItem = dbCat.items.find((i) => i.title === seed.title)
      if (!dbItem) {
        itemsMissing++
        console.log(`  ✗ item not found in ${cat.slug}: "${seed.title}"`)
        continue
      }

      const patch: Record<string, string | null> = {}
      if (seed.titleEn !== undefined && dbItem.titleEn !== seed.titleEn)
        patch.titleEn = seed.titleEn
      if (seed.titleRu !== undefined && dbItem.titleRu !== seed.titleRu)
        patch.titleRu = seed.titleRu
      if (seed.subtitleEn !== undefined && dbItem.subtitleEn !== seed.subtitleEn)
        patch.subtitleEn = seed.subtitleEn
      if (seed.subtitleRu !== undefined && dbItem.subtitleRu !== seed.subtitleRu)
        patch.subtitleRu = seed.subtitleRu
      if (seed.descriptionEn !== undefined && dbItem.descriptionEn !== seed.descriptionEn)
        patch.descriptionEn = seed.descriptionEn
      if (seed.descriptionRu !== undefined && dbItem.descriptionRu !== seed.descriptionRu)
        patch.descriptionRu = seed.descriptionRu

      if (Object.keys(patch).length === 0) continue

      itemsUpdated++
      const preview = Object.entries(patch)
        .map(([k, v]) => `${k}="${v}"`)
        .join(', ')
      console.log(`  ~ ${cat.slug} / "${seed.title}": ${preview}`)

      if (apply) {
        await prisma.item.update({ where: { id: dbItem.id }, data: patch })
      }
    }
  }

  console.log('')
  console.log(
    apply
      ? `✅ applied: ${categoriesUpdated} categories, ${itemsUpdated} items updated`
      : `ℹ dry run: ${categoriesUpdated} categories, ${itemsUpdated} items would be updated`,
  )
  if (categoriesMissing || itemsMissing) {
    console.log(
      `⚠  ${categoriesMissing} category(ies) and ${itemsMissing} item(s) in menu-data.ts have no match in DB — likely renamed via admin`,
    )
  }
  if (!apply) console.log('   Re-run with --apply to write these changes.')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
