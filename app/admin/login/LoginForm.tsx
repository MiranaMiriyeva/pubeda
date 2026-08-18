'use client'

import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'
import { PasswordInput } from './PasswordInput'
import { loginAction, type LoginFormState } from './actions'

const initialState: LoginFormState = { error: null }

interface Labels {
  email: string
  password: string
  login: string
  invalidCredentials: string
  tooManyAttempts: string
}

export function LoginForm({
  initialError,
  labels,
}: {
  initialError: string | null
  labels: Labels
}) {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  const errorMessage =
    initialError === 'rate_limited'
      ? labels.tooManyAttempts
      : state.error === 'invalid'
      ? labels.invalidCredentials
      : null

  return (
    <form action={formAction} className="mt-5 space-y-3">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          {labels.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full h-11 rounded-lg border border-border bg-card px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          {labels.password}
        </label>
        <PasswordInput
          name="password"
          required
          autoComplete="current-password"
        />
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2"
        >
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary-hover disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {pending && <Loader2 className="w-4 h-4 animate-spin" />}
        {labels.login}
      </button>
    </form>
  )
}
