'use client'

import { useAuth } from '@/lib/auth-context'

export function RoleSwitch() {
  const { currentUser, currentRole, canSwitchRole, switchRole } = useAuth()

  if (!currentUser) {
    return null
  }

  const isElected = canSwitchRole()

  if (!isElected) {
    return (
      <div className="border-t border-[#E5E7EB] dark:border-[#374151] p-4">
        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-2">Viewing As</p>
        <div className="px-4 py-2 rounded-lg text-sm font-medium bg-[#F5F7FA] dark:bg-[#374151] text-[#111827] dark:text-white">
          Student
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-[#E5E7EB] dark:border-[#374151] p-4">
      <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-3">Viewing As</p>
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-[#F5F7FA] dark:hover:bg-[#374151]">
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
            className="flex-1 text-sm cursor-pointer text-[#6B7280] dark:text-[#D1D5DB]"
          >
            Student Mode
          </label>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-[#F5F7FA] dark:hover:bg-[#374151]">
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
            className="flex-1 text-sm cursor-pointer text-[#6B7280] dark:text-[#D1D5DB]"
          >
            Maintainer Mode
          </label>
        </div>
      </div>
    </div>
  )
}
