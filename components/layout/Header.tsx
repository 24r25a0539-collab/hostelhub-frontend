'use client'

import { useState } from 'react'
import { Bell, X, Check, Trash2 } from 'lucide-react'
import { useNotifications } from '@/lib/notifications-context'
import { ProfileDropdown } from './ProfileDropdown'
import { NotificationRequestDialog } from '@/components/notifications/NotificationRequestDialog'

export function Header() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications()
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)

  return (
    <header className="bg-white dark:bg-[#111827] border-b border-[#E5E7EB] dark:border-[#374151] py-4 px-6 flex items-center justify-between">
      <div className="flex-1" />

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-[#F5F7FA] dark:hover:bg-[#1F2937] transition-all"
          >
            <Bell size={20} className="text-[#6B7280] dark:text-[#9CA3AF]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-96 bg-white dark:bg-[#1F2937] border border-[#E5E7EB] dark:border-[#374151] rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-[#E5E7EB] dark:border-[#374151] flex items-center justify-between">
                <h3 className="font-semibold text-[#111827] dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      markAllAsRead()
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-[#6B7280] dark:text-[#9CA3AF]">No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-[#E5E7EB] dark:divide-[#374151]">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 cursor-pointer hover:bg-[#F5F7FA] dark:hover:bg-[#374151] transition-all ${
                        !notification.read
                          ? 'bg-blue-50 dark:bg-blue-900/20'
                          : ''
                      }`}
                      onClick={() => {
                        if (!notification.read) {
                          markAsRead(notification.id)
                        }
                        if (notification.type === 'student_request') {
                          setSelectedRequest(notification.id)
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-[#111827] dark:text-white text-sm">
                            {notification.title}
                          </p>
                          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-[#9CA3AF] dark:text-[#6B7280] mt-1">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {notifications.length > 0 && (
                <div className="p-2 border-t border-[#E5E7EB] dark:border-[#374151] flex gap-2">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="flex-1 text-xs text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white py-1"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <ProfileDropdown />
      </div>

      {/* Student Request Dialog */}
      {selectedRequest && (
        <NotificationRequestDialog
          notificationId={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </header>
  )
}

function formatTime(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return date.toLocaleDateString()
}

