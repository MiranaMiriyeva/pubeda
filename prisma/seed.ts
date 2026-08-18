import { PrismaClient, Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { menuData, defaultSettings } from './menu-data'

const prisma = new PrismaClient()

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.log('⚠  ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user')
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  })
  console.log(`✓ Admin user ready: ${email}`)
}

async function seedSettings() {
  const entries = Object.entries(defaultSettings)
  for (const [key, value] of entries) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    })
  }
  console.log(`✓ Seeded ${entries.length} site settings (existing values preserved)`)
}

async function seedMenu() {
  const existingCount = await prisma.category.count()
  if (existingCount > 0) {
    console.log(`ℹ Menu already has ${existingCount} categories — skipping menu seed`)
    return
  }

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
    console.log(`✓ ${cat.name} — ${cat.items.length} items`)
  }
}

async function main() {
  await seedAdmin()
  await seedSettings()
  await seedMenu()
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('\n✅ Seed complete')
  })
  .catch(async (e) => {
    console.error('\n❌ Seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
