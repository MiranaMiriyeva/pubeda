import type { NextAuthConfig } from 'next-auth'

// Edge-safe config — no Node-only imports (bcryptjs, prisma).
// Consumed both by the full auth.ts (which adds the Credentials provider)
// and by proxy.ts middleware (which only needs the callbacks).
export default {
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  callbacks: {
    // Used by the proxy middleware to gate /admin/**
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl
      const isAdminRoute =
        pathname.startsWith('/admin') && pathname !== '/admin/login'
      if (isAdminRoute) return !!auth
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = 'admin'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
  providers: [], // Populated in auth.ts
} satisfies NextAuthConfig
