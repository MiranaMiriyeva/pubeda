import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
})
export type LoginInput = z.infer<typeof loginSchema>

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a #RRGGBB hex color')

export const categorySchema = z.object({
  name: z.string().min(1).max(120),
  nameEn: z.string().max(120).optional().nullable(),
  nameRu: z.string().max(120).optional().nullable(),
  slug: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/),
})
export type CategoryInput = z.infer<typeof categorySchema>

export const itemSchema = z.object({
  title: z.string().min(1).max(200),
  titleEn: z.string().max(200).optional().nullable(),
  titleRu: z.string().max(200).optional().nullable(),
  subtitle: z.string().max(300).optional().nullable(),
  subtitleEn: z.string().max(300).optional().nullable(),
  subtitleRu: z.string().max(300).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  descriptionEn: z.string().max(2000).optional().nullable(),
  descriptionRu: z.string().max(2000).optional().nullable(),
  price: z.coerce.number().min(0).max(99999.99),
  priceLabel: z.string().max(80).optional().nullable(),
  isSet: z.boolean(),
  available: z.boolean(),
})
export type ItemInput = z.infer<typeof itemSchema>

// Settings are stored as SiteSetting rows. Keys and their expected shapes:
export const settingsSchema = z
  .object({
    shop_name: z.string().max(120),
    shop_name_en: z.string().max(120).optional(),
    shop_name_ru: z.string().max(120).optional(),
    tagline: z.string().max(200).optional(),
    tagline_en: z.string().max(200).optional(),
    tagline_ru: z.string().max(200).optional(),
    about: z.string().max(2000).optional(),
    about_en: z.string().max(2000).optional(),
    about_ru: z.string().max(2000).optional(),
    hours: z.string().max(200).optional(),
    hours_en: z.string().max(200).optional(),
    hours_ru: z.string().max(200).optional(),
    address: z.string().max(300).optional(),
    address_en: z.string().max(300).optional(),
    address_ru: z.string().max(300).optional(),
    phone: z.string().max(50).optional(),
    email: z.string().max(200).optional().or(z.literal('')),
    whatsapp: z.string().max(300).optional().or(z.literal('')),
    instagram: z.string().max(300).optional().or(z.literal('')),
    facebook: z.string().max(300).optional().or(z.literal('')),
    service_charge_note: z.string().max(300).optional(),
    service_charge_note_en: z.string().max(300).optional(),
    service_charge_note_ru: z.string().max(300).optional(),
    currency_symbol: z.string().min(1).max(5),
    theme_primary: hex,
    theme_accent: hex,
    hero_image_url: z.string().max(500).optional().or(z.literal('')),
  })
  .partial({
    shop_name: false as unknown as true, // shop_name required
  })
export type SettingsInput = Partial<z.infer<typeof settingsSchema>>
