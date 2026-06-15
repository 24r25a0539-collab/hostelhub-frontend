'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PageContainer } from '@/components/layout/PageContainer'
import { User, Lock, Building2, Mail, Phone, MapPin } from 'lucide-react'

type SettingsTab = 'profile' | 'hostel' | 'account'

function SettingsContent() {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    bio: '',
  })

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsSaving(false)
  }

  return (
    <PageContainer title="Settings">
          <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#111827] dark:text-white">
                Settings
              </h1>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] mt-2">
                Manage your account and preferences
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-[#E5E7EB] dark:border-[#374151]">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === 'profile'
                    ? 'border-[#F7B538] text-[#F7B538]'
                    : 'border-transparent text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User size={18} />
                  Profile
                </div>
              </button>
              <button
                onClick={() => setActiveTab('hostel')}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === 'hostel'
                    ? 'border-[#F7B538] text-[#F7B538]'
                    : 'border-transparent text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2 size={18} />
                  Hostel
                </div>
              </button>

              <button
                onClick={() => setActiveTab('account')}
                className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === 'account'
                    ? 'border-[#F7B538] text-[#F7B538]'
                    : 'border-transparent text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Lock size={18} />
                  Account
                </div>
              </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-[#1F2937] rounded-lg border border-[#E5E7EB] dark:border-[#374151] p-6">
                <h2 className="text-xl font-bold text-[#111827] dark:text-white mb-6">
                  Profile Information
                </h2>

                <div className="space-y-6">
                  {/* Avatar */}
                  <div>
                    <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">
                      Profile Picture
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F7B538] to-[#F59E0B] flex items-center justify-center text-white font-semibold text-xl dark:from-[#FCD34D] dark:to-[#F59E0B]">
                        {currentUser?.avatar}
                      </div>
                      <button className="px-4 py-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg text-[#111827] dark:text-white hover:bg-[#F5F7FA] dark:hover:bg-[#374151] transition-colors">
                        Change Avatar
                      </button>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-[#9CA3AF]"
                      />
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      placeholder="Tell us about yourself"
                      rows={4}
                      className="w-full px-4 py-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F7B538] resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2 bg-[#F7B538] hover:bg-[#F59E0B] disabled:bg-[#D1D5DB] text-[#1F2937] font-semibold rounded-lg transition-all"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Hostel Tab */}
            {activeTab === 'hostel' && (
              <div className="bg-white dark:bg-[#1F2937] rounded-lg border border-[#E5E7EB] dark:border-[#374151] p-6">
                <h2 className="text-xl font-bold text-[#111827] dark:text-white mb-6">
                  Hostel Details
                </h2>

                <div className="space-y-6">
                  {/* Hostel Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">
                      Hostel Name
                    </label>
                    <input
                      type="text"
                      defaultValue="North Wing Hostel"
                      className="w-full px-4 py-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
                    />
                  </div>

                  {/* Room Number */}
                  <div>
                    <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">
                      Room Number
                    </label>
                    <input
                      type="text"
                      defaultValue="201"
                      className="w-full px-4 py-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
                    />
                  </div>

                  {/* Roll Number */}
                  <div>
                    <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">
                      Roll Number
                    </label>
                    <input
                      type="text"
                      defaultValue="21BCE001"
                      className="w-full px-4 py-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
                    />
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2 bg-[#F7B538] hover:bg-[#F59E0B] disabled:bg-[#D1D5DB] text-[#1F2937] font-semibold rounded-lg transition-all"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Theme Tab */}
            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="bg-white dark:bg-[#1F2937] rounded-lg border border-[#E5E7EB] dark:border-[#374151] p-6">
                <h2 className="text-xl font-bold text-[#111827] dark:text-white mb-6">
                  Account Settings
                </h2>

                <div className="space-y-6">
                  {/* Change Password */}
                  <div>
                    <h3 className="font-semibold text-[#111827] dark:text-white mb-4">
                      Change Password
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter current password"
                          className="w-full px-4 py-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Enter new password"
                          className="w-full px-4 py-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#111827] dark:text-white mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          className="w-full px-4 py-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
                        />
                      </div>

                      <button className="px-6 py-2 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] font-semibold rounded-lg transition-all">
                        Update Password
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-[#E5E7EB] dark:border-[#374151] pt-6">
                    <h3 className="font-semibold text-[#111827] dark:text-white mb-2 text-red-600">
                      Danger Zone
                    </h3>
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-4">
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>
                    <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
      </div>
    </PageContainer>
  )
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  )
}
