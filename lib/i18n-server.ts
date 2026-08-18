import { cookies } from 'next/headers'
import { DEFAULT_LOCALE, LOCALE_COOKIE, isValidLocale, type Locale } from './i18n'

export async function getLocale(): Promise<Locale> {
  const store = await cookies()
  const v = store.get(LOCALE_COOKIE)?.value
  return isValidLocale(v) ? v : DEFAULT_LOCALE
}
