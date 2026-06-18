'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Building2, DoorOpen, ArrowRight, LogOut } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function OnboardingPage() {
  const router = useRouter()
  const { currentUser, isLoading, logout } = useAuth()

  useEffect(() => {
    if (isLoading) return
    if (!currentUser) {
      router.replace('/login')
      return
    }
    if (currentUser.joinStatus === 'pending') {
      router.replace('/onboarding/pending')
      return
    }
    if (currentUser.hostelId && currentUser.joinStatus === 'approved') {
      router.replace('/dashboard')
    }
  }, [currentUser, isLoading, router])

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] dark:bg-[#111827]">
        <div className="text-[#6B7280] dark:text-[#9CA3AF]">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-white dark:from-[#111827] dark:to-[#1F2937] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <p className="text-sm text-[#1F3A93] dark:text-[#F7B538] font-semibold mb-2">
            Welcome, {currentUser.name.split(' ')[0]}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#111827] dark:text-white text-balance">
            How would you like to get started?
          </h1>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] mt-3 max-w-xl mx-auto text-pretty">
            Set up a brand-new hostel as its maintainer, or join an existing
            hostel using the code shared by your maintainer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/onboarding/create"
            className="group bg-white dark:bg-[#1F2937] rounded-2xl p-8 border border-[#E5E7EB] dark:border-[#374151] hover:border-[#1F3A93] dark:hover:border-[#F7B538] hover:shadow-lg transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#1F3A93]/10 dark:bg-[#1F3A93]/20 flex items-center justify-center mb-5">
              <Building2 className="text-[#1F3A93] dark:text-[#F7B538]" size={28} />
            </div>
            <h2 className="text-xl font-bold text-[#111827] dark:text-white mb-2">
              Create a Hostel
            </h2>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-6">
              Register a new hostel and become its maintainer. You&apos;ll get a
              unique code to invite students.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#1F3A93] dark:text-[#F7B538] group-hover:gap-2 transition-all">
              Set up hostel <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            href="/onboarding/join"
            className="group bg-white dark:bg-[#1F2937] rounded-2xl p-8 border border-[#E5E7EB] dark:border-[#374151] hover:border-[#1F3A93] dark:hover:border-[#F7B538] hover:shadow-lg transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#F7B538]/15 flex items-center justify-center mb-5">
              <DoorOpen className="text-[#F7B538]" size={28} />
            </div>
            <h2 className="text-xl font-bold text-[#111827] dark:text-white mb-2">
              Join a Hostel
            </h2>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-6">
              Already have a hostel code? Submit a join request and wait for the
              maintainer to approve you.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#1F3A93] dark:text-[#F7B538] group-hover:gap-2 transition-all">
              Enter a code <ArrowRight size={16} />
            </span>
          </Link>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => {
              logout()
              router.replace('/login')
            }}
            className="inline-flex items-center gap-2 text-sm text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white transition-colors"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </div>
    </main>
  )
}
