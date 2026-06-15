'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

export type NotificationType =
  | 'student_request'
  | 'student_approved'
  | 'student_rejected'
  | 'election_created'
  | 'election_started'
  | 'election_ended'
  | 'election_winner'
  | 'expense_added'
  | 'fund_added'
  | 'complaint_submitted'
  | 'complaint_resolved'
  | 'visitor_request'
  | 'visitor_approved'
  | 'bus_pass_updated'
  | 'cooking_duty_changed'

export type NotificationPriority = 'low' | 'normal' | 'high'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  priority: NotificationPriority
  timestamp: Date
  read: boolean
  actionData?: Record<string, any>
}

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  clearAll: () => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(
  undefined,
)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('hostelhub_notifications')
    if (saved) {
      try {
        const data = JSON.parse(saved) as Notification[]
        // Convert timestamp strings back to Date objects
        const parsed = data.map((n) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }))
        setNotifications(parsed)
      } catch (e) {
        // Use defaults if parsing fails
        const defaults = getDefaultNotifications()
        setNotifications(defaults)
      }
    } else {
      const defaults = getDefaultNotifications()
      setNotifications(defaults)
    }
    setIsLoaded(true)
  }, [])

  const getDefaultNotifications = (): Notification[] => [
    {
      id: '1',
      type: 'student_request',
      title: 'New Student Request',
      message: 'Rahul Kumar wants to join the hostel',
      priority: 'high',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      actionData: {
        studentId: 'req1',
        name: 'Rahul Kumar',
        email: 'rahul@example.com',
        phone: '9876543210',
        roomPreference: 'Single',
      },
    },
    {
      id: '2',
      type: 'election_started',
      title: 'Election Started',
      message: 'Election for June 2026 has started',
      priority: 'high',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: '3',
      type: 'expense_added',
      title: 'Expense Added',
      message: 'Groceries expense of ₹5000 has been added',
      priority: 'normal',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: true,
    },
  ]

  const addNotification = (
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>,
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    }

    const updated = [newNotification, ...notifications]
    setNotifications(updated)
    localStorage.setItem('hostelhub_notifications', JSON.stringify(updated))
  }

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    )
    setNotifications(updated)
    localStorage.setItem('hostelhub_notifications', JSON.stringify(updated))
  }

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(updated)
    localStorage.setItem('hostelhub_notifications', JSON.stringify(updated))
  }

  const deleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id)
    setNotifications(updated)
    localStorage.setItem('hostelhub_notifications', JSON.stringify(updated))
  }

  const clearAll = () => {
    setNotifications([])
    localStorage.setItem('hostelhub_notifications', JSON.stringify([]))
  }

  if (!isLoaded) {
    return <>{children}</>
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within NotificationsProvider')
  }
  return context
}
