'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { loginSchema, type LoginValues } from '@/lib/validation'
import { AuthShell } from '@/components/auth/AuthShell'
import { FormInput } from '@/components/auth/FormInput'

export default function LoginPage() {
  const router = useRouter()
  const { currentUser, isLoading, login } = useAuth()
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  })

  useEffect(() => {
    if (!isLoading && currentUser) {
      router.replace('/dashboard')
    }
  }, [currentUser, isLoading, router])

  const onSubmit = async (values: LoginValues) => {
    setFormError('')
    const result = await login(values.email, values.password, values.rememberMe)
    if (!result.ok) {
      setFormError(result.error ?? 'Unable to sign in')
      return
    }
    router.replace('/dashboard')
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to access your hostel dashboard"
      footer={
        <span>
          New to HostelHub?{' '}
          <Link href="/signup" className="text-[#1F3A93] dark:text-[#F7B538] font-semibold hover:underline">
            Create an account
          </Link>
        </span>
      }
    >
      {formError && (
        <div className="mb-5 flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormInput
          label="Email address"
          icon={Mail}
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <FormInput
          label="Password"
          icon={Lock}
          isPassword
          placeholder="Enter your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-[#6B7280] dark:text-[#9CA3AF] cursor-pointer">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="w-4 h-4 rounded border-[#E5E7EB] dark:border-[#374151] text-[#1F3A93] focus:ring-[#F7B538]"
            />
            Remember me for 30 days
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-[#1F3A93] hover:bg-[#162952] disabled:opacity-60 text-white font-semibold rounded-lg transition-all"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-[#F5F7FA] dark:bg-[#374151]/50 border border-[#E5E7EB] dark:border-[#374151] rounded-lg">
        <p className="text-xs font-semibold text-[#111827] dark:text-white mb-1">
          Demo accounts (password: Demo@123)
        </p>
        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
          Maintainer: john@example.com · Student: jane@example.com
        </p>
      </div>
    </AuthShell>
  )
}
