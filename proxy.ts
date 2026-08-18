// Next.js 16 renamed `middleware.ts` → `proxy.ts` (functionality unchanged).
// Purpose:
//  1. Guard /admin/** — redirect unauthenticated users to /admin/login
//  2. Rate-limit POSTs to /admin/login  (5 attempts / 10 min / IP)

import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import authConfig from './auth.config'
import { rateLimit } from './lib/rate-limit'

const { auth } = NextAuth(authConfig)

function ipOf(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

export default auth((req) => {
  // Rate-limit login POSTs before Auth handles them
  if (
    req.method === 'POST' &&
    req.nextUrl.pathname.startsWith('/api/auth/callback/credentials')
  ) {
    const ip = ipOf(req)
    const rl = rateLimit(`login:${ip}`, 5, 10 * 60 * 1000)
    if (!rl.allowed) {
      const url = req.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('error', 'rate_limited')
      return NextResponse.redirect(url)
    }
  }

  // NextAuth's `auth()` wrapper already applies the `authorized` callback
  // (defined in auth.config.ts) which handles /admin/** protection.
  return NextResponse.next()
})

export const config = {
  // Skip static assets, Next.js internals, and the logo file
  matcher: ['/((?!_next/static|_next/image|_next/data|favicon.ico|logo\\.jpg|logo\\.png).*)'],
}
