'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'

export type UserRole = 'STUDENT' | 'MAINTAINER'
export type JoinStatus = 'none' | 'pending' | 'approved' | 'rejected'

export interface UserProfile {
  photo?: string
  dateOfBirth?: string
  emergencyContact?: string
  collegeName?: string
  branch?: string
  year?: string
  roomNumber?: string
  bio?: string
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  avatar: string
  busPassBalance: number
  // Onboarding state
  hostelId?: string
  hostelCode?: string
  hostelName?: string
  joinStatus: JoinStatus
  isFounder: boolean
  profileComplete: boolean
  profile: UserProfile
  createdAt: string
}

// Stored user also carries password (frontend mock only)
interface StoredUser extends User {
  password: string
}

interface SignupInput {
  name: string
  email: string
  phone: string
  password: string
}

interface AuthContextType {
  currentUser: User | null
  currentRole: UserRole
  isLoading: boolean
  login: (
    email: string,
    password: string,
    rememberMe?: boolean,
  ) => Promise<{ ok: boolean; error?: string }>
  signup: (input: SignupInput) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  updateUser: (patch: Partial<User>) => void
  refreshUser: () => void
  // Internal helpers used by hostel context
  getStoredUsers: () => StoredUser[]
  persistUsers: (users: StoredUser[]) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USERS_KEY = 'hostelhub_users'
const SESSION_KEY = 'hostelhub_session'
const REMEMBER_DAYS = 30
const SESSION_HOURS = 8

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Seed demo accounts so the app is usable immediately
function seedUsers(): StoredUser[] {
  const now = new Date().toISOString()
  return [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Demo@123',
      phone: '+91 90000 00001',
      role: 'MAINTAINER',
      avatar: 'JD',
      busPassBalance: 5000,
      hostelId: 'hostel-srh',
      hostelCode: 'SRH2026',
      hostelName: 'Sai Residency Hostel',
      joinStatus: 'approved',
      isFounder: true,
      profileComplete: true,
      profile: {
        dateOfBirth: '1999-04-12',
        emergencyContact: '+91 90000 11111',
        collegeName: 'MVGR College of Engineering',
        branch: 'CSE',
        year: 'Final',
        roomNumber: '101',
        bio: 'Founder and maintainer of Sai Residency Hostel.',
      },
      createdAt: now,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'Demo@123',
      phone: '+91 90000 00002',
      role: 'STUDENT',
      avatar: 'JS',
      busPassBalance: 2500,
      hostelId: 'hostel-srh',
      hostelCode: 'SRH2026',
      hostelName: 'Sai Residency Hostel',
      joinStatus: 'approved',
      isFounder: false,
      profileComplete: true,
      profile: {
        dateOfBirth: '2002-08-21',
        emergencyContact: '+91 90000 22222',
        collegeName: 'MVGR College of Engineering',
        branch: 'ECE',
        year: 'Third',
        roomNumber: '204',
        bio: 'Resident student.',
      },
      createdAt: now,
    },
  ]
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const getStoredUsers = useCallback((): StoredUser[] => {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem(USERS_KEY)
      if (!raw) {
        const seeded = seedUsers()
        localStorage.setItem(USERS_KEY, JSON.stringify(seeded))
        return seeded
      }
      return JSON.parse(raw) as StoredUser[]
    } catch {
      const seeded = seedUsers()
      localStorage.setItem(USERS_KEY, JSON.stringify(seeded))
      return seeded
    }
  }, [])

  const persistUsers = useCallback((users: StoredUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }, [])

  const stripPassword = (u: StoredUser): User => {
    const { password: _password, ...rest } = u
    return rest
  }

  // Initialize session on mount
  useEffect(() => {
    try {
      const users = getStoredUsers()
      const rawSession = localStorage.getItem(SESSION_KEY)
      if (rawSession) {
        const session = JSON.parse(rawSession) as {
          userId: string
          expiresAt: number
        }
        if (session.expiresAt > Date.now()) {
          const found = users.find((u) => u.id === session.userId)
          if (found) {
            setCurrentUser(stripPassword(found))
          } else {
            localStorage.removeItem(SESSION_KEY)
          }
        } else {
          // Expired
          localStorage.removeItem(SESSION_KEY)
        }
      }
    } catch {
      localStorage.removeItem(SESSION_KEY)
    }
    setIsLoading(false)
  }, [getStoredUsers])

  const createSession = (userId: string, rememberMe?: boolean) => {
    const ms = rememberMe
      ? REMEMBER_DAYS * 24 * 60 * 60 * 1000
      : SESSION_HOURS * 60 * 60 * 1000
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ userId, expiresAt: Date.now() + ms }),
    )
  }

  const login = useCallback(
    async (email: string, password: string, rememberMe?: boolean) => {
      await new Promise((r) => setTimeout(r, 600))
      const users = getStoredUsers()
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      )
      if (!found) {
        return { ok: false, error: 'No account found with that email' }
      }
      if (found.password !== password) {
        return { ok: false, error: 'Incorrect password. Please try again.' }
      }
      createSession(found.id, rememberMe)
      setCurrentUser(stripPassword(found))
      return { ok: true }
    },
    [getStoredUsers],
  )

  const signup = useCallback(
    async (input: SignupInput) => {
      await new Promise((r) => setTimeout(r, 700))
      const users = getStoredUsers()
      if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
        return { ok: false, error: 'An account with this email already exists' }
      }
      const newUser: StoredUser = {
        id: `user-${Date.now()}`,
        name: input.name,
        email: input.email,
        phone: input.phone,
        password: input.password,
        role: 'STUDENT',
        avatar: initials(input.name),
        busPassBalance: 0,
        joinStatus: 'none',
        isFounder: false,
        profileComplete: false,
        profile: {},
        createdAt: new Date().toISOString(),
      }
      const updated = [...users, newUser]
      persistUsers(updated)
      createSession(newUser.id)
      setCurrentUser(stripPassword(newUser))
      return { ok: true }
    },
    [getStoredUsers, persistUsers],
  )

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setCurrentUser(null)
  }, [])

  // Re-read the current user from the persisted store (e.g. to pick up
  // an approval/rejection made elsewhere).
  const refreshUser = useCallback(() => {
    setCurrentUser((prev) => {
      if (!prev) return prev
      const users = getStoredUsers()
      const found = users.find((u) => u.id === prev.id)
      return found ? stripPassword(found) : prev
    })
  }, [getStoredUsers])

  const updateUser = useCallback(
    (patch: Partial<User>) => {
      setCurrentUser((prev) => {
        if (!prev) return prev
        const merged = { ...prev, ...patch, profile: { ...prev.profile, ...(patch.profile ?? {}) } }
        // Persist into the users store
        try {
          const users = getStoredUsers()
          const idx = users.findIndex((u) => u.id === merged.id)
          if (idx >= 0) {
            users[idx] = { ...users[idx], ...merged }
            persistUsers(users)
          }
        } catch {
          // ignore
        }
        return merged
      })
    },
    [getStoredUsers, persistUsers],
  )

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.role ?? 'STUDENT',
        isLoading,
        login,
        signup,
        logout,
        updateUser,
        refreshUser,
        getStoredUsers,
        persistUsers,
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
