'use client'

import { forwardRef, InputHTMLAttributes, ReactNode, useState } from 'react'
import { Eye, EyeOff, LucideIcon } from 'lucide-react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: LucideIcon
  error?: string
  hint?: ReactNode
  isPassword?: boolean
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  function FormInput(
    { label, icon: Icon, error, hint, isPassword, className = '', ...props },
    ref,
  ) {
    const [show, setShow] = useState(false)
    const type = isPassword ? (show ? 'text' : 'password') : props.type

    return (
      <div>
        <label className="block text-sm font-medium text-[#111827] dark:text-white mb-1.5">
          {label}
        </label>
        <div className="relative">
          {Icon && (
            <Icon
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-[#9CA3AF] pointer-events-none"
            />
          )}
          <input
            ref={ref}
            {...props}
            type={type}
            aria-invalid={!!error}
            className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${
              isPassword ? 'pr-10' : 'pr-4'
            } py-2.5 border rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 transition-all ${
              error
                ? 'border-red-400 focus:ring-red-400'
                : 'border-[#E5E7EB] dark:border-[#374151] focus:ring-[#F7B538]'
            } ${className}`}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error ? (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        ) : hint ? (
          <div className="mt-1 text-xs text-[#6B7280] dark:text-[#9CA3AF]">{hint}</div>
        ) : null}
      </div>
    )
  },
)
