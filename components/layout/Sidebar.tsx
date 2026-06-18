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
  ClipboardCheck,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme-context'

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: BarChart3 },
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
  const { logout, currentRole } = useAuth()
  const { isDarkMode } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    router.push('/login')
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#0F172A] text-white"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 flex flex-col bg-[#0F172A] text-white border-r border-[#1E293B] transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F7B538] rounded-xl flex items-center justify-center font-bold text-[#0F172A]">
              HH
            </div>
            <div>
              <h1 className="text-xl font-bold">HostelHub AI</h1>
              <p className="text-xs text-[#94A3B8]">Management System</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-1">
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
                      ? 'bg-[#F7B538] text-[#0F172A] font-semibold'
                      : 'text-[#CBD5E1] hover:bg-[#1E293B] hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}

            {/* Maintainer-only: Join Requests */}
            {currentRole === 'MAINTAINER' && (
              <Link
                href="/join-requests"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  pathname === '/join-requests'
                    ? 'bg-[#F7B538] text-[#0F172A] font-semibold'
                    : 'text-[#CBD5E1] hover:bg-[#1E293B] hover:text-white'
                }`}
              >
                <ClipboardCheck size={20} />
                <span>Join Requests</span>
              </Link>
            )}
          </div>
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-[#1E293B] p-4 space-y-1">
          <Link
            href="/settings"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#CBD5E1] hover:bg-[#1E293B] hover:text-white transition-all"
            onClick={() => setIsOpen(false)}
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#CBD5E1] hover:bg-[#7F1D1D] hover:text-white transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
