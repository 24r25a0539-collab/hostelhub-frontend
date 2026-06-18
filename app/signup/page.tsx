'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { ArrowRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  const [step, setStep] = useState<'signup' | 'hostelbuild'>('signup')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [hostelName, setHostelName] = useState('')
  const [hostelAddress, setHostelAddress] = useState('')
  const [capacity, setCapacity] = useState('')
  const [description, setDescription] = useState('')
  const [hostelCode, setHostelCode] = useState('')
  const [actionType, setActionType] = useState<'create' | 'join' | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signup, createHostel, joinHostel } = useAuth()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await signup({
        email,
        name,
        phone,
        password,
      })
      setStep('hostelbuild')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateHostel = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const code = `${hostelName.substring(0, 3).toUpperCase()}${new Date().getFullYear()}`
      await createHostel({
        name: hostelName,
        address: hostelAddress,
        capacity: parseInt(capacity),
        description,
        code,
      })
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create hostel')
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinHostel = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await joinHostel(hostelCode)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid hostel code')
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 'hostelbuild' && actionType === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#F5F7FA] dark:from-[#111827] dark:to-[#1F2937] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#F7B538] rounded-xl flex items-center justify-center shadow-lg">
              <span className="font-bold text-[#1F2937] text-xl">H</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#111827] dark:text-white">HostelHub</h1>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Join or Create a Hostel</p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setActionType('create')}
              className="w-full p-6 bg-white dark:bg-[#1F2937] rounded-2xl shadow-lg border-2 border-[#1F3A93] hover:shadow-xl transition-all text-left"
            >
              <h3 className="text-xl font-bold text-[#111827] dark:text-white mb-2">Create New Hostel</h3>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Start managing a new hostel as the founder</p>
            </button>

            <button
              onClick={() => setActionType('join')}
              className="w-full p-6 bg-white dark:bg-[#1F2937] rounded-2xl shadow-lg border-2 border-[#F7B538] hover:shadow-xl transition-all text-left"
            >
              <h3 className="text-xl font-bold text-[#111827] dark:text-white mb-2">Join Existing Hostel</h3>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Join with a hostel code from your admin</p>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'hostelbuild' && actionType === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#F5F7FA] dark:from-[#111827] dark:to-[#1F2937] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#F7B538] rounded-xl flex items-center justify-center shadow-lg">
              <span className="font-bold text-[#1F2937] text-xl">H</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Create Hostel</h1>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Set up your hostel</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-xl border border-[#E5E7EB] dark:border-[#374151] p-8 mb-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleCreateHostel} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">Hostel Name</label>
                <input
                  type="text"
                  value={hostelName}
                  onChange={(e) => setHostelName(e.target.value)}
                  placeholder="Sai Residency Hostel"
                  className="w-full px-4 py-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">Address</label>
                <input
                  type="text"
                  value={hostelAddress}
                  onChange={(e) => setHostelAddress(e.target.value)}
                  placeholder="Bangalore, India"
                  className="w-full px-4 py-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">Capacity</label>
                <input
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="50"
                  className="w-full px-4 py-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description about the hostel"
                  className="w-full px-4 py-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F7B538] resize-none"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#1F3A93] hover:bg-[#162952] text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : <>Create Hostel <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'hostelbuild' && actionType === 'join') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-[#F5F7FA] dark:from-[#111827] dark:to-[#1F2937] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#F7B538] rounded-xl flex items-center justify-center shadow-lg">
              <span className="font-bold text-[#1F2937] text-xl">H</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Join Hostel</h1>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Enter the hostel code</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-xl border border-[#E5E7EB] dark:border-[#374151] p-8 mb-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleJoinHostel} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">Hostel Code</label>
                <input
                  type="text"
                  value={hostelCode}
                  onChange={(e) => setHostelCode(e.target.value.toUpperCase())}
                  placeholder="MDK2026"
                  className="w-full px-4 py-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F7B538] text-center text-2xl tracking-widest font-bold"
                  required
                />
              </div>

              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Get the code from your hostel administrator. Your request will be reviewed before approval.</p>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#1F3A93] hover:bg-[#162952] text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? 'Joining...' : <>Join Hostel <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F5F7FA] dark:from-[#111827] dark:to-[#1F2937] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-[#F7B538] rounded-xl flex items-center justify-center shadow-lg">
            <span className="font-bold text-[#1F2937] text-xl">H</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Create Account</h1>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Join HostelHub today</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-xl border border-[#E5E7EB] dark:border-[#374151] p-8 mb-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#1F3A93] hover:bg-[#162952] text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : <>Continue <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-[#6B7280] dark:text-[#9CA3AF]">
            Already have an account?{' '}
            <Link href="/signin" className="text-[#1F3A93] dark:text-[#F7B538] font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
