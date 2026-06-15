'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

export type UserRole = 'STUDENT' | 'MAINTAINER'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  isElectedMaintainer: boolean
  busPassBalance: number
  avatar?: string
}

interface AuthContextType {
  currentUser: User | null
  currentRole: UserRole
  isLoading: boolean
  canSwitchRole: () => boolean
  switchRole: (role: UserRole) => void
  logout: () => void
  login: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user for demo purposes
const MOCK_USER: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'MAINTAINER',
  isElectedMaintainer: true,
  busPassBalance: 5000,
  avatar: 'JD',
}

const MOCK_STUDENT_USER: User = {
  id: '2',
  name: 'Jane Smith',
  email: 'jane@example.com',
  role: 'STUDENT',
  isElectedMaintainer: false,
  busPassBalance: 2500,
  avatar: 'JS',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentRole, setCurrentRole] = useState<UserRole>('MAINTAINER')
  const [isLoading, setIsLoading] = useState(true)

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('hostelhub_user')
    const savedRole = localStorage.getItem('hostelhub_role') as UserRole | null

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setCurrentUser(user)
        setCurrentRole(savedRole || user.role)
      } catch (e) {
        // If parsing fails, use mock user
        setCurrentUser(MOCK_USER)
        setCurrentRole(MOCK_USER.role)
      }
    } else {
      // Default to mock user for demo
      setCurrentUser(MOCK_USER)
      setCurrentRole(MOCK_USER.role)
    }
    setIsLoading(false)
  }, [])

  const canSwitchRole = (): boolean => {
    return currentUser?.isElectedMaintainer ?? false
  }

  const switchRole = (role: UserRole) => {
    if (!canSwitchRole()) {
      console.warn('User is not an elected maintainer and cannot switch roles')
      return
    }
    setCurrentRole(role)
    localStorage.setItem('hostelhub_role', role)
  }

  const logout = () => {
    setCurrentUser(null)
    setCurrentRole('STUDENT')
    localStorage.removeItem('hostelhub_user')
    localStorage.removeItem('hostelhub_role')
    // Redirect to signin will be handled by page component
  }

  const login = (user: User) => {
    setCurrentUser(user)
    setCurrentRole(user.role)
    localStorage.setItem('hostelhub_user', JSON.stringify(user))
    localStorage.setItem('hostelhub_role', user.role)
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isLoading,
        canSwitchRole,
        switchRole,
        logout,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
