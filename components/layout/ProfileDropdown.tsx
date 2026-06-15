'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from '@/lib/theme-context'
import {
  User,
  Settings,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react'

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { currentUser, logout } = useAuth()
  const router = useRouter()
  
  // Use state to track theme instead of calling hook before mount
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [toggleThemeFn, setToggleThemeFn] = useState<() => void>(() => {})

  // Initialize hooks only after mount
  useEffect(() => {
    try {
      const themeContext = useTheme()
      setIsDarkMode(themeContext.isDarkMode)
      setToggleThemeFn(() => themeContext.toggleTheme)
      setIsLoaded(true)
    } catch (e) {
      // Context not ready yet
      setIsLoaded(true)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () =>
        document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    router.push('/signin')
  }

  if (!isLoaded || !currentUser) {
    return null
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 pl-4 border-l border-[#E5E7EB] dark:border-[#374151] hover:opacity-75 transition-opacity"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F7B538] to-[#F59E0B] flex items-center justify-center text-white font-semibold text-sm dark:from-[#FCD34D] dark:to-[#F59E0B]">
          {currentUser.avatar}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-[#111827] dark:text-white">
            {currentUser.name}
          </p>
          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            {currentUser.role === 'MAINTAINER' ? 'Maintainer' : 'Student'}
          </p>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && isLoaded && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#1F2937] rounded-lg shadow-lg border border-[#E5E7EB] dark:border-[#374151] z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-[#E5E7EB] dark:border-[#374151]">
            <p className="text-sm font-semibold text-[#111827] dark:text-white">
              {currentUser.name}
            </p>
            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
              {currentUser.email}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm text-[#111827] dark:text-white hover:bg-[#F5F7FA] dark:hover:bg-[#374151] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
              <span>My Profile</span>
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-2 text-sm text-[#111827] dark:text-white hover:bg-[#F5F7FA] dark:hover:bg-[#374151] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
              <span>Settings</span>
            </Link>

            {/* Theme Toggle */}
            {isLoaded && (
              <button
                onClick={() => {
                  toggleThemeFn()
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#111827] dark:text-white hover:bg-[#F5F7FA] dark:hover:bg-[#374151] transition-colors"
              >
                {isDarkMode ? (
                  <>
                    <Sun size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-[#FEE2E2] dark:hover:bg-[#7F1D1D] transition-colors border-t border-[#E5E7EB] dark:border-[#374151] mt-2 pt-2"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
