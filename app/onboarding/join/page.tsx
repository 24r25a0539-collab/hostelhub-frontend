'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, DoorOpen, Hash, BedDouble, User, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useHostel } from '@/lib/hostel-context'
import { joinHostelSchema, type JoinHostelValues } from '@/lib/validation'
import { FormInput } from '@/components/auth/FormInput'

export default function JoinHostelPage() {
  const router = useRouter()
  const { currentUser, isLoading } = useAuth()
  const { submitJoinRequest, hostelExists } = useHostel()
  const [formError, setFormError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<JoinHostelValues>({
    resolver: zodResolver(joinHostelSchema),
    defaultValues: {
      hostelCode: '',
      roomNumber: '',
      preferredName: '',
      intro: '',
    },
  })

  const codeValue = watch('hostelCode')?.toUpperCase()
  const codeValid = codeValue && /^[A-Z]{2,4}\d{4}$/.test(codeValue)
  const codeFound = codeValid ? hostelExists(codeValue) : null

  useEffect(() => {
    if (!isLoading && !currentUser) router.replace('/login')
  }, [currentUser, isLoading, router])

  const onSubmit = async (values: JoinHostelValues) => {
    setFormError('')
    const result = await submitJoinRequest({
      hostelCode: values.hostelCode.toUpperCase(),
      roomNumber: values.roomNumber,
      preferredName: values.preferredName,
      intro: values.intro,
    })
    if (!result.ok) {
      setFormError(result.error ?? 'Could not submit request')
      return
    }
    router.replace('/onboarding/pending')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-white dark:from-[#111827] dark:to-[#1F2937] px-4 py-10">
      <div className="w-full max-w-xl mx-auto">
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 text-sm text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to options
        </Link>

        <div className="bg-white dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB] dark:border-[#374151] p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#F7B538]/15 flex items-center justify-center">
              <DoorOpen className="text-[#F7B538]" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#111827] dark:text-white">
                Join a hostel
              </h1>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                Your request will be reviewed by the maintainer
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
              label="Hostel code"
              icon={Hash}
              placeholder="SRH2026"
              className="uppercase tracking-widest"
              error={errors.hostelCode?.message}
              hint={
                codeValid ? (
                  codeFound ? (
                    <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                      <CheckCircle2 size={13} /> Hostel found
                    </span>
                  ) : (
                    <span className="text-red-500">No hostel found with this code</span>
                  )
                ) : (
                  'Ask your maintainer for the hostel code (e.g. SRH2026)'
                )
              }
              {...register('hostelCode')}
            />
            <FormInput
              label="Preferred room number"
              icon={BedDouble}
              placeholder="204"
              error={errors.roomNumber?.message}
              {...register('roomNumber')}
            />
            <FormInput
              label="Preferred name"
              icon={User}
              placeholder="What should we call you?"
              error={errors.preferredName?.message}
              {...register('preferredName')}
            />
            <div>
              <label className="block text-sm font-medium text-[#111827] dark:text-white mb-1.5">
                Short introduction
              </label>
              <textarea
                {...register('intro')}
                rows={3}
                placeholder="Tell the maintainer a bit about yourself"
                className="w-full px-4 py-2.5 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F7B538] resize-none"
              />
              {errors.intro && (
                <p className="mt-1 text-xs text-red-500">{errors.intro.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#1F3A93] hover:bg-[#162952] disabled:opacity-60 text-white font-semibold rounded-lg transition-all"
            >
              {isSubmitting ? 'Submitting request...' : 'Submit Join Request'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
