// One-off: wipe every category + item and re-import from menu-data.ts.
// Use ONLY when you want to reset the menu — this DELETES current data.
//
//   npx tsx prisma/import-menu.ts --confirm

import { PrismaClient, Prisma } from '@prisma/client'
import { menuData } from './menu-data'

const prisma = new PrismaClient()

async function main() {
  if (!process.argv.includes('--confirm')) {
    console.error(
      'Refusing to run without --confirm — this DELETES all categories and items.',
    )
    process.exit(1)
  }

  await prisma.item.deleteMany({})
  await prisma.category.deleteMany({})

  for (let ci = 0; ci < menuData.length; ci++) {
    const cat = menuData[ci]
    const created = await prisma.category.create({
      data: {
        slug: cat.slug,
        name: cat.name,
        nameEn: cat.nameEn,
        nameRu: cat.nameRu,
        displayOrder: ci,
      },
    })
    for (let ii = 0; ii < cat.items.length; ii++) {
      const it = cat.items[ii]
      await prisma.item.create({
        data: {
          categoryId: created.id,
          title: it.title,
          titleEn: it.titleEn ?? null,
          titleRu: it.titleRu ?? null,
          subtitle: it.subtitle ?? null,
          subtitleEn: it.subtitleEn ?? null,
          subtitleRu: it.subtitleRu ?? null,
          description: it.description ?? null,
          descriptionEn: it.descriptionEn ?? null,
          descriptionRu: it.descriptionRu ?? null,
          price: new Prisma.Decimal(it.price),
          priceLabel: it.priceLabel ?? null,
          isSet: it.isSet ?? false,
          displayOrder: ii,
        },
      })
    }
    console.log(`✓ ${cat.name}`)
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
