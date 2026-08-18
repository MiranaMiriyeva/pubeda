import { prisma } from './prisma'
import { pickLocalized, type Locale } from './i18n'

// Fallback values used when the database has not been seeded yet, or a
// specific key is missing. Kept in sync with prisma/menu-data.ts defaultSettings.
export const DEFAULT_SETTINGS: Record<string, string> = {
  shop_name: 'PABEDA',
  shop_name_en: 'PABEDA',
  shop_name_ru: 'PABEDA',
  tagline: 'Nostalji atmosfer, klassik dadlar',
  tagline_en: 'Nostalgic atmosphere, classic tastes',
  tagline_ru: 'Ностальгическая атмосфера, классические вкусы',
  about: '',
  about_en: '',
  about_ru: '',
  hours: '',
  hours_en: '',
  hours_ru: '',
  address: 'Bəsti Bağırova küç. 2A, Bakı',
  address_en: 'Basti Bagirova st. 2A, Baku',
  address_ru: 'ул. Бести Багировой 2А, Баку',
  phone: '+994 50 702 72 22',
  email: '',
  whatsapp: 'https://wa.me/994507027222',
  instagram: 'https://www.instagram.com/pabeda.restoran/',
  facebook: '',
  service_charge_note: '10% xidmət haqqı hesabınıza əlavə olunur.',
  service_charge_note_en: 'A 10% service charge is added to your bill.',
  service_charge_note_ru: 'К счёту добавляется 10% за обслуживание.',
  currency_symbol: '₼',
  default_locale: 'az',
  theme_primary: '#D91E1E',
  theme_accent: '#C89632',
  hero_image_url: '',
}

export type SettingsMap = Record<string, string>

export async function getSettings(): Promise<SettingsMap> {
  try {
    const rows = await prisma.siteSetting.findMany()
    const map: SettingsMap = { ...DEFAULT_SETTINGS }
    for (const r of rows) map[r.key] = r.value
    return map
  } catch {
    // DB not reachable — return defaults so pages still render during setup
    return { ...DEFAULT_SETTINGS }
  }
}

export interface LocalizedSettings {
  shopName: string
  tagline: string
  about: string
  hours: string
  address: string
  phone: string
  email: string
  whatsapp: string
  instagram: string
  facebook: string
  serviceChargeNote: string
  currencySymbol: string
  themePrimary: string
  themeAccent: string
  heroImageUrl: string
}

// Picks the values for a given locale using the *_en / *_ru suffix pattern
// (base = Azerbaijani). Falls back to the base value if a translation is empty.
export function localizeSettings(
  s: SettingsMap,
  locale: Locale,
): LocalizedSettings {
  const asObj = (base: string) => ({
    [base]: s[base] ?? '',
    [base + 'En']: s[`${base}_en`] ?? '',
    [base + 'Ru']: s[`${base}_ru`] ?? '',
  })
  return {
    shopName: pickLocalized(asObj('shop_name'), 'shop_name', locale),
    tagline: pickLocalized(asObj('tagline'), 'tagline', locale),
    about: pickLocalized(asObj('about'), 'about', locale),
    hours: pickLocalized(asObj('hours'), 'hours', locale),
    address: pickLocalized(asObj('address'), 'address', locale),
    phone: s.phone ?? '',
    email: s.email ?? '',
    whatsapp: s.whatsapp ?? '',
    instagram: s.instagram ?? '',
    facebook: s.facebook ?? '',
    serviceChargeNote: pickLocalized(
      asObj('service_charge_note'),
      'service_charge_note',
      locale,
    ),
    currencySymbol: s.currency_symbol || '₼',
    themePrimary: s.theme_primary || '#D91E1E',
    themeAccent: s.theme_accent || '#C89632',
    heroImageUrl: s.hero_image_url ?? '',
  }
}

// Validates a color string is a #rrggbb hex. Used before injecting into CSS.
export function sanitizeHex(hex: string, fallback: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : fallback
}

// Derives a slightly darker shade for hover states without needing extra input.
export function darken(hex: string, amount = 0.12): string {
  const safe = sanitizeHex(hex, '#000000')
  const r = parseInt(safe.slice(1, 3), 16)
  const g = parseInt(safe.slice(3, 5), 16)
  const b = parseInt(safe.slice(5, 7), 16)
  const shift = (c: number) => Math.max(0, Math.round(c * (1 - amount)))
  return (
    '#' +
    [shift(r), shift(g), shift(b)]
      .map((c) => c.toString(16).padStart(2, '0'))
      .join('')
  )
}

// Returns black or white text depending on which contrasts better with the background hex.
export function contrastText(hex: string): string {
  const safe = sanitizeHex(hex, '#000000')
  const r = parseInt(safe.slice(1, 3), 16)
  const g = parseInt(safe.slice(3, 5), 16)
  const b = parseInt(safe.slice(5, 7), 16)
  // Perceived luminance (rec. 709)
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return luminance > 0.6 ? '#111111' : '#ffffff'
}
