export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

// Formats a numeric price for display. Uses non-breaking space between amount
// and currency symbol so mobile line wrapping never separates them.
export function formatPrice(
  price: number | string,
  currencySymbol: string = '₼',
): string {
  const n = typeof price === 'string' ? Number(price) : price
  if (!Number.isFinite(n)) return `0 ${currencySymbol}`
  const formatted =
    n % 1 === 0 ? n.toFixed(0) : n.toFixed(2).replace(/\.?0+$/, '')
  return `${formatted} ${currencySymbol}`
}

// Slugify Azerbaijani/Cyrillic text into an ASCII slug for URLs.
const translitMap: Record<string, string> = {
  ə: 'e', Ə: 'e', ğ: 'g', Ğ: 'g', ı: 'i', İ: 'i', ö: 'o', Ö: 'o',
  ş: 's', Ş: 's', ü: 'u', Ü: 'u', ç: 'c', Ç: 'c',
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh',
  з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
  п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts',
  ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
}

export function slugify(input: string): string {
  return input
    .split('')
    .map((ch) => translitMap[ch] ?? translitMap[ch.toLowerCase()] ?? ch)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
