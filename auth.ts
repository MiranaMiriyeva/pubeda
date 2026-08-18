import NextAuth, { CredentialsSignin } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import authConfig from './auth.config'
import { prisma } from '@/lib/prisma'

class InvalidCredentialsError extends CredentialsSignin {
  code = 'invalid_credentials'
}

const loginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) throw new InvalidCredentialsError()

        const user = await prisma.adminUser.findUnique({
          where: { email: parsed.data.email.toLowerCase() },
        })
        if (!user) throw new InvalidCredentialsError()

        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash)
        if (!ok) throw new InvalidCredentialsError()

        return { id: user.id, email: user.email, role: 'admin' as const }
      },
    }),
  ],
})
