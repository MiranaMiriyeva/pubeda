'use server'

import { AuthError } from 'next-auth'
import { signIn } from '@/auth'
import { loginSchema } from '@/lib/validators'

export interface LoginFormState {
  error: 'invalid' | 'unknown' | null
}

export async function loginAction(
  _prev: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  if (!parsed.success) return { error: 'invalid' }

  try {
    await signIn('credentials', {
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      redirectTo: '/admin',
    })
    return { error: null }
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: 'invalid' }
    }
    // signIn triggers a redirect by throwing NEXT_REDIRECT — let it bubble
    throw err
  }
}
