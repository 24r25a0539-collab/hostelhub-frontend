'use client'

import { Bell } from 'lucide-react'
import { ProfileDropdown } from './ProfileDropdown'

export function Header() {
  return (
    <header className="bg-white dark:bg-[#111827] border-b border-[#E5E7EB] dark:border-[#374151] py-4 px-6 flex items-center justify-between">
      <div className="flex-1" />
      
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-[#F5F7FA] dark:hover:bg-[#1F2937] transition-all">
          <Bell size={20} className="text-[#6B7280] dark:text-[#9CA3AF]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Profile Dropdown */}
        <ProfileDropdown />
      </div>
    </header>
  )
}

