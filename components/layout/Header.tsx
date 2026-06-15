'use client'

import { Bell, User } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white border-b border-[#E5E7EB] py-4 px-6 flex items-center justify-between">
      <div className="flex-1" />
      
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-[#F5F7FA] transition-all">
          <Bell size={20} className="text-[#6B7280]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-[#E5E7EB]">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F7B538] to-[#F59E0B] flex items-center justify-center text-white font-semibold">
            JD
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-[#111827]">John Doe</p>
            <p className="text-xs text-[#6B7280]">Maintainer</p>
          </div>
        </div>
      </div>
    </header>
  )
}
