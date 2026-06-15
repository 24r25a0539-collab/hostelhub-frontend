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
      <div className="border-t border-[#374151] p-4">
        <p className="text-xs text-[#9CA3AF] mb-2">Viewing As</p>
        <div className="px-4 py-2 rounded-lg bg-[#374151] text-white text-sm font-medium">
          Student
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-[#374151] p-4">
      <p className="text-xs text-[#9CA3AF] mb-3">Viewing As</p>
      <div className="space-y-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#374151] transition-colors cursor-pointer">
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
            className="flex-1 text-sm text-[#D1D5DB] cursor-pointer"
          >
            Student
          </label>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#374151] transition-colors cursor-pointer">
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
            className="flex-1 text-sm text-[#D1D5DB] cursor-pointer"
          >
            Maintainer
          </label>
        </div>
      </div>
    </div>
  )
}
