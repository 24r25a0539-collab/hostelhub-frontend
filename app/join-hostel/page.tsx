'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Mail, Lock, User, Building2, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function JoinHostelPage() {
  const [step, setStep] = useState(1) // 1: Basic Info, 2: Hostel Info, 3: Confirm
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    hostelName: '',
    roomNumber: '',
    rollNumber: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const validateStep1 = (): boolean => {
    if (!formData.name.trim()) {
      setError('Full name is required')
      return false
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return false
    }
    if (!formData.password) {
      setError('Password is required')
      return false
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    return true
  }

  const validateStep2 = (): boolean => {
    if (!formData.hostelName.trim()) {
      setError('Hostel name is required')
      return false
    }
    if (!formData.roomNumber.trim()) {
      setError('Room number is required')
      return false
    }
    if (!formData.rollNumber.trim()) {
      setError('Roll number is required')
      return false
    }
    return true
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Create new user account
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: 'STUDENT' as const,
        isElectedMaintainer: false,
        busPassBalance: 0,
        avatar: formData.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
      }

      // Login and redirect
      login(newUser)
      router.push('/')
    } catch (err) {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] dark:bg-[#111827] flex items-center justify-center px-4 py-8">
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
                Join Your Hostel
              </p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-colors ${
                s <= step
                  ? 'bg-[#F7B538]'
                  : 'bg-[#E5E7EB] dark:bg-[#374151]'
              }`}
            />
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-[#1F2937] rounded-lg shadow-sm border border-[#E5E7EB] dark:border-[#374151] p-8">
          <h2 className="text-2xl font-bold text-[#111827] dark:text-white mb-2">
            {step === 1 && 'Create Account'}
            {step === 2 && 'Hostel Details'}
            {step === 3 && 'Confirm Information'}
          </h2>
          <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-6 text-sm">
            {step === 1 && 'Enter your basic information'}
            {step === 2 && 'Tell us about your hostel'}
            {step === 3 && 'Review your information'}
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-[#9CA3AF]"
                    />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F7B538] dark:focus:ring-[#F7B538]"
                      required
                    />
                  </div>
                </div>

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
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
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
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a password"
                      className="w-full pl-10 pr-10 py-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F7B538] dark:focus:ring-[#F7B538]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-[#9CA3AF]"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-[#9CA3AF]"
                    />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="w-full pl-10 pr-10 py-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F7B538] dark:focus:ring-[#F7B538]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-[#9CA3AF]"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Step 2: Hostel Details */}
            {step === 2 && (
              <>
                {/* Hostel Name */}
                <div>
                  <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">
                    Hostel Name
                  </label>
                  <div className="relative">
                    <Building2
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-[#9CA3AF]"
                    />
                    <input
                      type="text"
                      name="hostelName"
                      value={formData.hostelName}
                      onChange={handleInputChange}
                      placeholder="e.g., North Wing Hostel"
                      className="w-full pl-10 pr-4 py-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F7B538] dark:focus:ring-[#F7B538]"
                      required
                    />
                  </div>
                </div>

                {/* Room Number */}
                <div>
                  <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">
                    Room Number
                  </label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., 201"
                    className="w-full px-4 py-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F7B538] dark:focus:ring-[#F7B538]"
                    required
                  />
                </div>

                {/* Roll Number */}
                <div>
                  <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., 21BCE001"
                    className="w-full px-4 py-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F7B538] dark:focus:ring-[#F7B538]"
                    required
                  />
                </div>
              </>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="space-y-4 bg-[#F5F7FA] dark:bg-[#111827] p-4 rounded-lg">
                <div>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                    Full Name
                  </p>
                  <p className="text-sm font-semibold text-[#111827] dark:text-white">
                    {formData.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                    Email
                  </p>
                  <p className="text-sm font-semibold text-[#111827] dark:text-white">
                    {formData.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                    Hostel Name
                  </p>
                  <p className="text-sm font-semibold text-[#111827] dark:text-white">
                    {formData.hostelName}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
                    Room Number
                  </p>
                  <p className="text-sm font-semibold text-[#111827] dark:text-white">
                    {formData.roomNumber}
                  </p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 py-3 bg-[#E5E7EB] dark:bg-[#374151] hover:bg-[#D1D5DB] dark:hover:bg-[#4B5563] text-[#111827] dark:text-white font-semibold rounded-lg transition-all"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  Next
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 bg-[#F7B538] hover:bg-[#F59E0B] disabled:bg-[#D1D5DB] text-[#1F2937] font-semibold rounded-lg transition-all"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              )}
            </div>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-6">
            Already have an account?{' '}
            <Link
              href="/signin"
              className="text-[#F7B538] hover:text-[#F59E0B] font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
