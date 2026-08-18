'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export function PasswordInput({
  name,
  placeholder,
  required,
  autoComplete,
}: {
  name: string
  placeholder?: string
  required?: boolean
  autoComplete?: string
}) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        name={name}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="w-full h-11 rounded-lg border border-border bg-card px-3 pr-10 text-[15px] focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
      />
      <button
        type="button"
        aria-label={visible ? 'Hide password' : 'Show password'}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground"
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  )
}
