'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Users, Calendar, Utensils, Bus, Vote, FileText, CheckCircle, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#111827]">
        <div className="text-[#6B7280] dark:text-[#9CA3AF]">Loading...</div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-[#F5F7FA] dark:from-[#111827] dark:to-[#1F2937]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border-b border-[#E5E7EB] dark:border-[#374151]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#F7B538] rounded-lg flex items-center justify-center">
              <span className="font-bold text-[#1F2937]">H</span>
            </div>
            <div>
              <h1 className="font-bold text-[#111827] dark:text-white">HostelHub</h1>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Sai Residency Hostel</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/signin" className="px-4 py-2 text-[#111827] dark:text-white hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded-lg transition-all">
              Sign In
            </Link>
            <Link href="/signup" className="px-4 py-2 bg-[#F7B538] text-[#1F2937] rounded-lg font-medium hover:bg-[#F59E0B] transition-all">
              Join Hostel
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-[#111827] dark:text-white mb-6 text-balance">
          Complete Hostel Management System
        </h2>
        <p className="text-lg text-[#6B7280] dark:text-[#9CA3AF] mb-12 max-w-2xl mx-auto text-balance">
          Streamline attendance, manage funds, handle cooking duties, and conduct elections all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signin" className="px-8 py-4 bg-[#1F3A93] text-white rounded-lg font-semibold hover:bg-[#162952] transition-all flex items-center justify-center gap-2">
            Sign In <ArrowRight size={20} />
          </Link>
          <Link href="/signup" className="px-8 py-4 border-2 border-[#1F3A93] text-[#1F3A93] dark:text-[#F7B538] dark:border-[#F7B538] rounded-lg font-semibold hover:bg-[#1F3A93]/10 transition-all">
            Create New Account
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-[#1F2937] py-20 border-t border-[#E5E7EB] dark:border-[#374151]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-[#111827] dark:text-white text-center mb-12">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, title: 'Student Management', desc: 'Track all students and manage their records' },
              { icon: Calendar, title: 'Attendance Tracking', desc: 'Auto-rotated cooking duties and attendance' },
              { icon: Utensils, title: 'Cooking Duties', desc: 'Assign and manage monthly cooking duties' },
              { icon: Bus, title: 'Bus Pass System', desc: 'Manage bus pass balance and transactions' },
              { icon: Vote, title: 'Elections', desc: 'Conduct monthly democratic elections' },
              { icon: FileText, title: 'Reports', desc: 'Generate comprehensive reports and exports' },
              { icon: CheckCircle, title: 'Expense Tracking', desc: 'Track hostel expenses and fund management' },
              { icon: Users, title: 'Visitor Management', desc: 'Log and approve visitor entries' },
            ].map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="p-6 rounded-2xl bg-[#F5F7FA] dark:bg-[#374151] hover:shadow-lg transition-shadow">
                  <Icon className="w-10 h-10 text-[#F7B538] mb-4" />
                  <h4 className="font-semibold text-[#111827] dark:text-white mb-2">{feature.title}</h4>
                  <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Demo Credentials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-[#F5F7FA] dark:bg-[#374151] rounded-3xl p-8 border border-[#E5E7EB] dark:border-[#4B5563]">
          <h3 className="text-2xl font-bold text-[#111827] dark:text-white mb-6">Demo Accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-4 bg-white dark:bg-[#1F2937] rounded-lg border border-[#E5E7EB] dark:border-[#374151]">
              <p className="font-semibold text-[#111827] dark:text-white mb-2">Maintainer Account</p>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Email: john@example.com</p>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Password: demo@123</p>
            </div>
            <div className="p-4 bg-white dark:bg-[#1F2937] rounded-lg border border-[#E5E7EB] dark:border-[#374151]">
              <p className="font-semibold text-[#111827] dark:text-white mb-2">Student Account</p>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Email: jane@example.com</p>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Password: demo@123</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#1F2937] border-t border-[#E5E7EB] dark:border-[#374151] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#6B7280] dark:text-[#9CA3AF]">© 2026 HostelHub. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
