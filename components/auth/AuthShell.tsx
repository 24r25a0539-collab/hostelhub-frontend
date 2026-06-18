'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

interface AuthShellProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F5F7FA] to-white dark:from-[#111827] dark:to-[#1F2937] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-[#F7B538] rounded-xl flex items-center justify-center font-bold text-[#1F2937] text-lg">
            HH
          </div>
          <div className="text-left">
            <h1 className="text-xl font-bold text-[#111827] dark:text-white leading-tight">
              HostelHub
            </h1>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              Management System
            </p>
          </div>
        </Link>

        <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-sm border border-[#E5E7EB] dark:border-[#374151] p-8">
          <h2 className="text-2xl font-bold text-[#111827] dark:text-white mb-1 text-balance">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-6 text-pretty">
              {subtitle}
            </p>
          )}
          <div className={subtitle ? '' : 'mt-6'}>{children}</div>
        </div>

        {footer && (
          <div className="text-center text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-6">
            {footer}
          </div>
        )}
      </div>
    </main>
  )
}
