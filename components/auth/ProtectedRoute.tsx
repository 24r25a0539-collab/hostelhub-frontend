'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'STUDENT' | 'MAINTAINER'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter()
  const { currentUser, currentRole, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      // Redirect to signin if not authenticated
      if (!currentUser) {
        router.push('/signin')
        return
      }

      // Check role if required
      if (requiredRole && currentRole !== requiredRole) {
        router.push('/')
        return
      }
    }
  }, [currentUser, currentRole, isLoading, requiredRole, router])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!currentUser) {
    return null
  }

  if (requiredRole && currentRole !== requiredRole) {
    return null
  }

  return <>{children}</>
}
