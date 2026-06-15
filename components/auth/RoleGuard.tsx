'use client'

import { redirect } from 'next/navigation'

type UserRole = 'STUDENT' | 'MAINTAINER'

export interface RoleGuardProps {
  requiredRole: UserRole
  children: React.ReactNode
  fallback?: React.ReactNode
}

// TODO: Replace with actual auth context when available
const currentUserRole: UserRole = 'MAINTAINER'

export function RoleGuard({
  requiredRole,
  children,
  fallback,
}: RoleGuardProps) {
  if (currentUserRole !== requiredRole) {
    if (fallback) {
      return <>{fallback}</>
    }
    redirect('/403')
  }

  return <>{children}</>
}
