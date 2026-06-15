'use client'

import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme-context'

export function RoleSwitch() {
  const { currentUser, currentRole, canSwitchRole, switchRole } = useAuth()
  const { isDarkMode } = useTheme()

  if (!currentUser) {
    return null
  }

  const isElected = canSwitchRole()

  if (!isElected) {
    return (
      <div className="border-t border-[#E5E7EB] dark:border-[#374151] p-4">
        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-2">Viewing As</p>
        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
          isDarkMode
            ? 'bg-[#374151] text-white'
            : 'bg-[#F5F7FA] text-[#111827]'
        }`}>
          Student
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-[#E5E7EB] dark:border-[#374151] p-4">
      <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-3">Viewing As</p>
      <div className="space-y-2">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
          isDarkMode
            ? 'hover:bg-[#374151]'
            : 'hover:bg-[#F5F7FA]'
        }`}>
          <input
            type="radio"
            id="role-student"
            name="role"
            value="STUDENT"
            checked={currentRole === 'STUDENT'}
            onChange={(e) => switchRole(e.target.value as 'STUDENT' | 'MAINTAINER')}
            className="w-4 h-4"
          />
          <label
            htmlFor="role-student"
            className={`flex-1 text-sm cursor-pointer ${
              isDarkMode
                ? 'text-[#D1D5DB]'
                : 'text-[#6B7280]'
            }`}
          >
            Student Mode
          </label>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
          isDarkMode
            ? 'hover:bg-[#374151]'
            : 'hover:bg-[#F5F7FA]'
        }`}>
          <input
            type="radio"
            id="role-maintainer"
            name="role"
            value="MAINTAINER"
            checked={currentRole === 'MAINTAINER'}
            onChange={(e) => switchRole(e.target.value as 'STUDENT' | 'MAINTAINER')}
            className="w-4 h-4"
          />
          <label
            htmlFor="role-maintainer"
            className={`flex-1 text-sm cursor-pointer ${
              isDarkMode
                ? 'text-[#D1D5DB]'
                : 'text-[#6B7280]'
            }`}
          >
            Maintainer Mode
          </label>
        </div>
      </div>
    </div>
  )
}
