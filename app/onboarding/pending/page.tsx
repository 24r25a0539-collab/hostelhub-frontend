'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, CheckCircle2, XCircle, LogOut, RefreshCw } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

export default function PendingPage() {
  const router = useRouter()
  const { currentUser, isLoading, logout, refreshUser } = useAuth()

  // Poll for an approval/rejection decision
  useEffect(() => {
    const id = setInterval(refreshUser, 3000)
    return () => clearInterval(id)
  }, [refreshUser])

  useEffect(() => {
    if (isLoading) return
    if (!currentUser) {
      router.replace('/login')
      return
    }
    if (currentUser.joinStatus === 'approved') {
      router.replace(currentUser.profileComplete ? '/dashboard' : '/profile/setup')
    }
  }, [currentUser, isLoading, router])

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] dark:bg-[#111827]">
        <div className="text-[#6B7280] dark:text-[#9CA3AF]">Loading...</div>
      </div>
    )
  }

  const rejected = currentUser.joinStatus === 'rejected'

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-white dark:from-[#111827] dark:to-[#1F2937] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white dark:bg-[#1F2937] rounded-2xl border border-[#E5E7EB] dark:border-[#374151] p-8 text-center">
        {rejected ? (
          <>
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-5">
              <XCircle className="text-red-600 dark:text-red-400" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-[#111827] dark:text-white mb-2">
              Request not approved
            </h1>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-6">
              Your request to join{' '}
              <span className="font-semibold">{currentUser.hostelName}</span> was
              declined. You can try a different hostel code.
            </p>
            <button
              onClick={() => router.replace('/onboarding')}
              className="w-full py-3 bg-[#1F3A93] hover:bg-[#162952] text-white font-semibold rounded-lg transition-all mb-3"
            >
              Try another hostel
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-[#F7B538]/15 flex items-center justify-center mx-auto mb-5">
              <Clock className="text-[#F7B538]" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-[#111827] dark:text-white mb-2">
              Awaiting approval
            </h1>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-6 text-pretty">
              Your request to join{' '}
              <span className="font-semibold text-[#111827] dark:text-white">
                {currentUser.hostelName}
              </span>{' '}
              has been sent. You&apos;ll get access as soon as the maintainer
              approves it.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F7FA] dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#374151]">
                <CheckCircle2 size={13} className="text-green-500" /> Request submitted
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F7FA] dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#374151]">
                <RefreshCw size={13} className="text-[#F7B538] animate-spin" style={{ animationDuration: '3s' }} /> Checking status
              </span>
            </div>
            <button
              onClick={refreshUser}
              className="w-full py-3 bg-[#1F3A93] hover:bg-[#162952] text-white font-semibold rounded-lg transition-all mb-3 inline-flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} /> Check now
            </button>
          </>
        )}
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
    </main>
  )
}
