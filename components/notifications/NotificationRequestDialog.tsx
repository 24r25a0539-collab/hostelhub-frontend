'use client'

import { X, Check, XCircle } from 'lucide-react'
import { useNotifications } from '@/lib/notifications-context'
import { useState } from 'react'

interface NotificationRequestDialogProps {
  notificationId: string
  onClose: () => void
}

export function NotificationRequestDialog({
  notificationId,
  onClose,
}: NotificationRequestDialogProps) {
  const { notifications, deleteNotification, addNotification } =
    useNotifications()
  const [loading, setLoading] = useState(false)

  const notification = notifications.find((n) => n.id === notificationId)

  if (!notification || notification.type !== 'student_request') {
    return null
  }

  const { name, email, phone, roomPreference } = notification.actionData || {}

  const handleApprove = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Add approval notification
    addNotification({
      type: 'student_approved',
      title: 'Request Approved',
      message: `${name} has been approved to join the hostel`,
      priority: 'high',
    })

    // Remove request notification
    deleteNotification(notificationId)
    setLoading(false)
    onClose()
  }

  const handleReject = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Add rejection notification
    addNotification({
      type: 'student_rejected',
      title: 'Request Rejected',
      message: `${name}'s request to join the hostel has been rejected`,
      priority: 'normal',
    })

    // Remove request notification
    deleteNotification(notificationId)
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#111827] dark:text-white">
            Hostel Join Request
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Name</p>
            <p className="text-lg font-semibold text-[#111827] dark:text-white">
              {name}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Email</p>
            <p className="text-lg font-semibold text-[#111827] dark:text-white">
              {email}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Phone</p>
            <p className="text-lg font-semibold text-[#111827] dark:text-white">
              {phone}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
              Room Preference
            </p>
            <p className="text-lg font-semibold text-[#111827] dark:text-white">
              {roomPreference}
            </p>
          </div>

          <div className="bg-[#F5F7FA] dark:bg-[#374151] p-4 rounded-lg border border-[#E5E7EB] dark:border-[#4B5563]">
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
              Requested on:{' '}
              <span className="font-semibold text-[#111827] dark:text-white">
                {new Date().toLocaleDateString()}
              </span>
            </p>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleReject}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-lg font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
            >
              <XCircle size={18} /> Reject
            </button>
            <button
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg font-semibold hover:bg-green-700 dark:hover:bg-green-800 transition-all disabled:opacity-50"
            >
              <Check size={18} /> Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
