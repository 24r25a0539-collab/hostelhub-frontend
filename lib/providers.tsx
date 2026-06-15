'use client'

import { AuthProvider } from './auth-context'
import { ThemeProvider } from './theme-context'
import { NotificationsProvider } from './notifications-context'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationsProvider>
          {children}
        </NotificationsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
