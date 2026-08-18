'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/require-admin'
import { settingsSchema, type SettingsInput } from '@/lib/validators'

const ALLOWED_KEYS = new Set(Object.keys(settingsSchema.shape))

export async function updateSettings(raw: Record<string, string>) {
  await requireAdmin()

  // Filter to known keys, drop anything else the client sent
  const filtered: Record<string, string> = {}
  for (const [k, v] of Object.entries(raw)) {
    if (ALLOWED_KEYS.has(k)) filtered[k] = typeof v === 'string' ? v : ''
  }

  const parsed = settingsSchema.partial().safeParse(filtered)
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '))
  }

  const entries = Object.entries(parsed.data) as Array<[string, string | undefined]>
  await prisma.$transaction(
    entries
      .filter(([, v]) => v !== undefined)
      .map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value: value as string },
          create: { key, value: value as string },
        }),
      ),
  )

  revalidatePath('/', 'layout')
  revalidatePath('/menu')
  revalidatePath('/admin/settings')
}

// Exported so the form component can type its state
export type { SettingsInput }
