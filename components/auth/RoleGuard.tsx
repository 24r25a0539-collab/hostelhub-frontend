'use client'

import { redirect } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export interface RoleGuardProps {
  requiredRole: 'STUDENT' | 'MAINTAINER'
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGuard({
  requiredRole,
  children,
  fallback,
}: RoleGuardProps) {
  const { currentRole, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (currentRole !== requiredRole) {
    if (fallback) {
      return <>{fallback}</>
    }
    redirect('/403')
  }

  return <>{children}</>
}
