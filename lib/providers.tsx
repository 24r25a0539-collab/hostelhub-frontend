'use client'

import { AuthProvider } from './auth-context'
import { ThemeProvider } from './theme-context'
import { HostelProvider } from './hostel-context'
import { FundProvider } from './fund-context'
import { NotificationsProvider } from './notifications-context'
import { ElectionsProvider } from './elections-context'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HostelProvider>
          <FundProvider>
            <NotificationsProvider>
              <ElectionsProvider>{children}</ElectionsProvider>
            </NotificationsProvider>
          </FundProvider>
        </HostelProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
