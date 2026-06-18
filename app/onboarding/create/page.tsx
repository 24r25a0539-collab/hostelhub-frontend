'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Building2, MapPin, Hash, Users, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useHostel } from '@/lib/hostel-context'
import { createHostelSchema, type CreateHostelValues } from '@/lib/validation'
import { FormInput } from '@/components/auth/FormInput'

export default function CreateHostelPage() {
  const router = useRouter()
  const { currentUser, isLoading } = useAuth()
  const { createHostel, generateHostelCode } = useHostel()
  const [formError, setFormError] = useState('')
  const [createdCode, setCreatedCode] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateHostelValues>({
    resolver: zodResolver(createHostelSchema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      description: '',
      capacity: undefined as unknown as number,
      type: 'CO_LIVING',
    },
  })

  const nameValue = watch('name')
  const previewCode = nameValue && nameValue.length >= 3 ? generateHostelCode(nameValue) : null

  useEffect(() => {
    if (!isLoading && !currentUser) router.replace('/login')
  }, [currentUser, isLoading, router])

  const onSubmit = async (values: CreateHostelValues) => {
    setFormError('')
    const result = await createHostel({
      ...values,
      description: values.description || undefined,
    })
    if (!result.ok || !result.hostel) {
      setFormError(result.error ?? 'Could not create hostel')
      return
    }
    setCreatedCode(result.hostel.code)
  }

  if (createdCode) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-white dark:from-[#111827] dark:to-[#1F2937] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB] dark:border-[#374151] p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="text-green-600 dark:text-green-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white mb-2">
            Hostel created!
          </h1>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-6">
            Share this code with students so they can request to join your hostel.
          </p>
          <div className="bg-[#F5F7FA] dark:bg-[#111827] border border-dashed border-[#1F3A93] dark:border-[#F7B538] rounded-xl py-5 mb-6">
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-1">Your hostel code</p>
            <p className="text-3xl font-bold tracking-widest text-[#1F3A93] dark:text-[#F7B538]">
              {createdCode}
            </p>
          </div>
          <button
            onClick={() => router.replace('/profile/setup')}
            className="w-full py-3 bg-[#1F3A93] hover:bg-[#162952] text-white font-semibold rounded-lg transition-all"
          >
            Continue to profile setup
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-white dark:from-[#111827] dark:to-[#1F2937] px-4 py-10">
      <div className="w-full max-w-2xl mx-auto">
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 text-sm text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to options
        </Link>

        <div className="bg-white dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB] dark:border-[#374151] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#1F3A93]/10 dark:bg-[#1F3A93]/20 flex items-center justify-center">
              <Building2 className="text-[#1F3A93] dark:text-[#F7B538]" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#111827] dark:text-white">
                Create your hostel
              </h1>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                You&apos;ll become the maintainer of this hostel
              </p>
            </div>
          </div>

          {formError && (
            <div className="mb-5 flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormInput
              label="Hostel name"
              icon={Building2}
              placeholder="Sai Residency Hostel"
              error={errors.name?.message}
              hint={
                previewCode ? (
                  <span>
                    Auto-generated code:{' '}
                    <span className="font-semibold text-[#1F3A93] dark:text-[#F7B538]">
                      {previewCode}
                    </span>
                  </span>
                ) : (
                  'A unique code will be generated from the name'
                )
              }
              {...register('name')}
            />

            <FormInput
              label="Address"
              icon={MapPin}
              placeholder="12-4-9, College Road"
              error={errors.address?.message}
              {...register('address')}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="City"
                placeholder="Vizianagaram"
                error={errors.city?.message}
                {...register('city')}
              />
              <FormInput
                label="State"
                placeholder="Andhra Pradesh"
                error={errors.state?.message}
                {...register('state')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Pincode"
                icon={Hash}
                inputMode="numeric"
                placeholder="535002"
                error={errors.pincode?.message}
                {...register('pincode')}
              />
              <FormInput
                label="Capacity"
                icon={Users}
                type="number"
                inputMode="numeric"
                placeholder="120"
                error={errors.capacity?.message}
                {...register('capacity', { valueAsNumber: true })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] dark:text-white mb-1.5">
                Hostel type
              </label>
              <select
                {...register('type')}
                className="w-full px-4 py-2.5 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
              >
                <option value="BOYS">Boys hostel</option>
                <option value="GIRLS">Girls hostel</option>
                <option value="CO_LIVING">Co-living</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] dark:text-white mb-1.5">
                Description <span className="text-[#9CA3AF] font-normal">(optional)</span>
              </label>
              <textarea
                {...register('description')}
                rows={3}
                placeholder="A short description of your hostel"
                className="w-full px-4 py-2.5 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F7B538] resize-none"
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#1F3A93] hover:bg-[#162952] disabled:opacity-60 text-white font-semibold rounded-lg transition-all"
            >
              {isSubmitting ? 'Creating hostel...' : 'Create Hostel'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
