'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { LOCALE_COOKIE, isValidLocale } from '@/lib/i18n'

export async function setLocale(next: string) {
  if (!isValidLocale(next)) return
  const store = await cookies()
  store.set(LOCALE_COOKIE, next, {
    httpOnly: false, // client can read for progressive enhancement
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })
  revalidatePath('/', 'layout')
}
