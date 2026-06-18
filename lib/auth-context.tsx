'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User, Hostel } from './types'

interface AuthContextType {
  user: User | null
  hostel: Hostel | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (userData: any) => Promise<void>
  createHostel: (hostelData: any) => Promise<void>
  joinHostel: (code: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock data for demonstration
const MOCK_USERS: Record<string, any> = {
  'john@example.com': {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    phone: '+91 98765 43210',
    role: 'MAINTAINER',
    hostelId: 'hostel-1',
    password: 'demo@123',
  },
  'jane@example.com': {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    phone: '+91 98765 43211',
    role: 'STUDENT',
    hostelId: 'hostel-1',
    password: 'demo@123',
  },
}

const MOCK_HOSTELS: Record<string, Hostel> = {
  'hostel-1': {
    id: 'hostel-1',
    code: 'MDK2026',
    name: 'Sai Residency Hostel',
    address: 'Bangalore, India',
    description: 'Premium student hostel',
    totalCapacity: 50,
    founderId: '1',
    createdAt: new Date('2026-01-01'),
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [hostel, setHostel] = useState<Hostel | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('hostelhub_user')
    const savedHostel = localStorage.getItem('hostelhub_hostel')
    
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    if (savedHostel) {
      setHostel(JSON.parse(savedHostel))
    }
    
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const mockUser = MOCK_USERS[email]
    if (!mockUser || mockUser.password !== password) {
      throw new Error('Invalid email or password')
    }

    const userData: User = {
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      phone: mockUser.phone,
      role: mockUser.role,
      hostelId: mockUser.hostelId,
      joiningDate: new Date(),
      createdAt: new Date(),
    }

    setUser(userData)
    const hostelData = MOCK_HOSTELS[mockUser.hostelId]
    if (hostelData) {
      setHostel(hostelData)
      localStorage.setItem('hostelhub_hostel', JSON.stringify(hostelData))
    }
    localStorage.setItem('hostelhub_user', JSON.stringify(userData))
  }

  const signup = async (userData: any) => {
    // Mock signup implementation
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      role: 'STUDENT',
      hostelId: userData.hostelId,
      joiningDate: new Date(),
      createdAt: new Date(),
    }

    setUser(newUser)
    localStorage.setItem('hostelhub_user', JSON.stringify(newUser))
  }

  const createHostel = async (hostelData: any) => {
    if (!user) throw new Error('User not authenticated')

    const newHostel: Hostel = {
      id: `hostel-${Date.now()}`,
      code: hostelData.code,
      name: hostelData.name,
      address: hostelData.address,
      description: hostelData.description,
      totalCapacity: hostelData.capacity,
      founderId: user.id,
      createdAt: new Date(),
    }

    // Update user to become maintainer
    const updatedUser = { ...user, role: 'MAINTAINER' as const, hostelId: newHostel.id }
    setUser(updatedUser)
    setHostel(newHostel)
    localStorage.setItem('hostelhub_user', JSON.stringify(updatedUser))
    localStorage.setItem('hostelhub_hostel', JSON.stringify(newHostel))
  }

  const joinHostel = async (code: string) => {
    // Mock join hostel - in real app, this would validate the code
    const hostelEntry = Object.values(MOCK_HOSTELS).find(h => h.code === code)
    if (!hostelEntry) throw new Error('Invalid hostel code')

    if (user) {
      const updatedUser = { ...user, hostelId: hostelEntry.id }
      setUser(updatedUser)
      setHostel(hostelEntry)
      localStorage.setItem('hostelhub_user', JSON.stringify(updatedUser))
      localStorage.setItem('hostelhub_hostel', JSON.stringify(hostelEntry))
    }
  }

  const logout = () => {
    setUser(null)
    setHostel(null)
    localStorage.removeItem('hostelhub_user')
    localStorage.removeItem('hostelhub_hostel')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        hostel,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        createHostel,
        joinHostel,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
