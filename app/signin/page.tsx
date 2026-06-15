'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

const MOCK_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'demo@123',
    role: 'MAINTAINER' as const,
    isElectedMaintainer: true,
    busPassBalance: 5000,
    avatar: 'JD',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'demo@123',
    role: 'STUDENT' as const,
    isElectedMaintainer: false,
    busPassBalance: 2500,
    avatar: 'JS',
  },
]

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Find matching user
      const user = MOCK_USERS.find(
        (u) => u.email === email && u.password === password,
      )

      if (!user) {
        setError('Invalid email or password')
        setIsLoading(false)
        return
      }

      // Login and redirect
      login(user)
      router.push('/')
    } catch (err) {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] dark:bg-[#111827] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#F7B538] rounded-lg flex items-center justify-center font-bold text-[#1F2937]">
              HH
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#111827] dark:text-white">
                HostelHub
              </h1>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                Management System
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-[#1F2937] rounded-lg shadow-sm border border-[#E5E7EB] dark:border-[#374151] p-8">
          <h2 className="text-2xl font-bold text-[#111827] dark:text-white mb-2">
            Sign In
          </h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-6">
            Enter your credentials to access the hostel management system
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-[#9CA3AF]"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F7B538] dark:focus:ring-[#F7B538]"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-[#9CA3AF]"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F7B538] dark:focus:ring-[#F7B538]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#F7B538] hover:bg-[#F59E0B] disabled:bg-[#D1D5DB] text-[#1F2937] font-semibold rounded-lg transition-all"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-400 mb-2">
              Demo Credentials
            </p>
            <div className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
              <p>
                <span className="font-medium">Maintainer:</span> john@example.com /
                demo@123
              </p>
              <p>
                <span className="font-medium">Student:</span> jane@example.com /
                demo@123
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-6">
            Don&apos;t have an account?{' '}
            <Link
              href="/join-hostel"
              className="text-[#F7B538] hover:text-[#F59E0B] font-semibold"
            >
              Join Hostel
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
