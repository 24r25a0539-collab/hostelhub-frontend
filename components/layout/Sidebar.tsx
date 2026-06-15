'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  Users,
  Clock,
  Banknote,
  Receipt,
  UtensilsCrossed,
  Megaphone,
  AlertCircle,
  Users2,
  BarChart3,
  Vote,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { RoleSwitch } from '@/components/auth/RoleSwitch'

const menuItems = [
  { label: 'Dashboard', href: '/', icon: BarChart3 },
  { label: 'Students', href: '/students', icon: Users },
  { label: 'Attendance', href: '/attendance', icon: Clock },
  { label: 'Bus Pass', href: '/bus-pass', icon: Banknote },
  { label: 'Fund Management', href: '/fund-management', icon: Banknote },
  { label: 'Expenses', href: '/expenses', icon: Receipt },
  { label: 'Cooking Duties', href: '/cooking-duties', icon: UtensilsCrossed },
  { label: 'Announcements', href: '/announcements', icon: Megaphone },
  { label: 'Complaints', href: '/complaints', icon: AlertCircle },
  { label: 'Visitors', href: '/visitors', icon: Users2 },
  { label: 'Elections', href: '/elections', icon: Vote },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    router.push('/signin')
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#1F2937] text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white border-r border-[#E5E7EB] dark:border-[#374151] transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#E5E7EB] dark:border-[#374151]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F7B538] rounded-lg flex items-center justify-center font-bold text-[#1F2937]">
              HH
            </div>
            <div>
              <h1 className="text-xl font-bold">HostelHub</h1>
              <p className="text-xs text-[#9CA3AF]">Management System</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#F7B538] text-[#1F2937] font-semibold dark:bg-[#F7B538] dark:text-[#1F2937]'
                      : 'text-[#6B7280] dark:text-[#D1D5DB] hover:bg-[#F5F7FA] dark:hover:bg-[#374151]'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Role Switch */}
        <RoleSwitch />

        {/* Bottom actions */}
        <div className="border-t border-[#E5E7EB] dark:border-[#374151] p-4 space-y-2">
          <Link
            href="/settings"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-[#6B7280] dark:text-[#D1D5DB] hover:bg-[#F5F7FA] dark:hover:bg-[#374151]"
            onClick={() => setIsOpen(false)}
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-[#6B7280] dark:text-[#D1D5DB] hover:bg-[#F5F7FA] dark:hover:bg-[#374151]"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
