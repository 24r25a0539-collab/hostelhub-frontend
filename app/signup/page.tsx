'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Lock, User, Phone, AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import {
  signupSchema,
  type SignupValues,
  getPasswordStrength,
} from '@/lib/validation'
import { AuthShell } from '@/components/auth/AuthShell'
import { FormInput } from '@/components/auth/FormInput'

export default function SignupPage() {
  const router = useRouter()
  const { currentUser, isLoading, signup } = useAuth()
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  })

  const passwordValue = watch('password')
  const strength = passwordValue ? getPasswordStrength(passwordValue) : null

  useEffect(() => {
    if (!isLoading && currentUser) {
      router.replace('/onboarding')
    }
  }, [currentUser, isLoading, router])

  const onSubmit = async (values: SignupValues) => {
    setFormError('')
    const result = await signup({
      name: values.name,
      email: values.email,
      phone: values.phone,
      password: values.password,
    })
    if (!result.ok) {
      setFormError(result.error ?? 'Unable to create account')
      return
    }
    router.replace('/onboarding')
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join HostelHub to manage or find your hostel"
      footer={
        <span>
          Already have an account?{' '}
          <Link href="/login" className="text-[#1F3A93] dark:text-[#F7B538] font-semibold hover:underline">
            Sign in
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
          label="Full name"
          icon={User}
          placeholder="Jane Smith"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
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
          label="Phone number"
          icon={Phone}
          type="tel"
          placeholder="+91 90000 00000"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <div>
          <FormInput
            label="Password"
            icon={Lock}
            isPassword
            placeholder="Create a strong password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          {strength && !errors.password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-1.5 flex-1 rounded-full transition-colors"
                    style={{
                      backgroundColor:
                        i <= strength.score ? strength.color : '#E5E7EB',
                    }}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs" style={{ color: strength.color }}>
                {strength.label} password
              </p>
            </div>
          )}
        </div>
        <FormInput
          label="Confirm password"
          icon={Lock}
          isPassword
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-[#1F3A93] hover:bg-[#162952] disabled:opacity-60 text-white font-semibold rounded-lg transition-all"
        >
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </AuthShell>
  )
}
