'use client'

import Link from 'next/link'

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] dark:from-[#111827] dark:to-[#1F2937] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#111827] dark:text-white mb-4">Module Page</h1>
        <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-6">This module is being built...</p>
        <Link href="/dashboard" className="text-[#1F3A93] hover:underline font-semibold">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
