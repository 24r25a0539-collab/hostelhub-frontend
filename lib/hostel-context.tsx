'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'
import { useAuth } from './auth-context'

export type HostelType = 'BOYS' | 'GIRLS' | 'CO_LIVING'
export type RequestStatus = 'pending' | 'approved' | 'rejected'

export interface Hostel {
  id: string
  name: string
  code: string
  address: string
  city: string
  state: string
  pincode: string
  description?: string
  capacity: number
  type: HostelType
  founderId: string
  createdAt: string
}

export interface JoinRequest {
  id: string
  hostelCode: string
  studentId: string
  studentName: string
  email: string
  phone: string
  roomNumber: string
  preferredName: string
  intro: string
  status: RequestStatus
  requestDate: string
  assignedRoom?: string
  notes?: string
  rejectReason?: string
  decidedAt?: string
}

interface CreateHostelInput {
  name: string
  address: string
  city: string
  state: string
  pincode: string
  description?: string
  capacity: number
  type: HostelType
}

interface SubmitJoinInput {
  hostelCode: string
  roomNumber: string
  preferredName: string
  intro: string
}

interface HostelContextType {
  hostels: Hostel[]
  joinRequests: JoinRequest[]
  hostelExists: (code: string) => boolean
  generateHostelCode: (name: string) => string
  createHostel: (input: CreateHostelInput) => Promise<{ ok: boolean; hostel?: Hostel; error?: string }>
  submitJoinRequest: (input: SubmitJoinInput) => Promise<{ ok: boolean; error?: string }>
  approveRequest: (id: string, assignedRoom: string, notes?: string) => Promise<void>
  rejectRequest: (id: string, reason: string) => Promise<void>
  requestsForCurrentHostel: () => JoinRequest[]
}

const HostelContext = createContext<HostelContextType | undefined>(undefined)

const HOSTELS_KEY = 'hostelhub_hostels'
const REQUESTS_KEY = 'hostelhub_join_requests'

function seedHostels(): Hostel[] {
  return [
    {
      id: 'hostel-srh',
      name: 'Sai Residency Hostel',
      code: 'SRH2026',
      address: '12-4-9, College Road',
      city: 'Vizianagaram',
      state: 'Andhra Pradesh',
      pincode: '535002',
      description: 'A premium co-living hostel for engineering students.',
      capacity: 120,
      type: 'CO_LIVING',
      founderId: '1',
      createdAt: new Date().toISOString(),
    },
  ]
}

function seedRequests(): JoinRequest[] {
  return [
    {
      id: 'req-1',
      hostelCode: 'SRH2026',
      studentId: 'seed-1',
      studentName: 'Rahul Kumar',
      email: 'rahul@example.com',
      phone: '+91 98765 43210',
      roomNumber: '206',
      preferredName: 'Rahul',
      intro: 'Second year ECE student looking for a room close to the study hall.',
      status: 'pending',
      requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'req-2',
      hostelCode: 'SRH2026',
      studentId: 'seed-2',
      studentName: 'Sneha Patel',
      email: 'sneha@example.com',
      phone: '+91 98765 43211',
      roomNumber: '207',
      preferredName: 'Sneha',
      intro: 'Final year IT student, transferring from another hostel block.',
      status: 'pending',
      requestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'req-3',
      hostelCode: 'SRH2026',
      studentId: 'seed-3',
      studentName: 'Vikram Iyer',
      email: 'vikram@example.com',
      phone: '+91 98765 43212',
      roomNumber: '205',
      preferredName: 'Vikram',
      intro: 'Mechanical engineering student, joined last semester.',
      status: 'approved',
      requestDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      assignedRoom: '205',
      notes: 'Assigned to ground floor as requested.',
      decidedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
}

export function HostelProvider({ children }: { children: ReactNode }) {
  const { currentUser, updateUser, getStoredUsers, persistUsers } = useAuth()
  const [hostels, setHostels] = useState<Hostel[]>([])
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const rawH = localStorage.getItem(HOSTELS_KEY)
      if (rawH) {
        setHostels(JSON.parse(rawH))
      } else {
        const seeded = seedHostels()
        localStorage.setItem(HOSTELS_KEY, JSON.stringify(seeded))
        setHostels(seeded)
      }
      const rawR = localStorage.getItem(REQUESTS_KEY)
      if (rawR) {
        setJoinRequests(JSON.parse(rawR))
      } else {
        const seeded = seedRequests()
        localStorage.setItem(REQUESTS_KEY, JSON.stringify(seeded))
        setJoinRequests(seeded)
      }
    } catch {
      setHostels(seedHostels())
      setJoinRequests(seedRequests())
    }
    setIsLoaded(true)
  }, [])

  const persistHostels = (next: Hostel[]) => {
    setHostels(next)
    localStorage.setItem(HOSTELS_KEY, JSON.stringify(next))
  }
  const persistRequests = (next: JoinRequest[]) => {
    setJoinRequests(next)
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(next))
  }

  const hostelExists = useCallback(
    (code: string) => hostels.some((h) => h.code.toUpperCase() === code.toUpperCase()),
    [hostels],
  )

  const generateHostelCode = useCallback(
    (name: string) => {
      const letters =
        name
          .replace(/[^a-zA-Z\s]/g, '')
          .trim()
          .split(/\s+/)
          .map((w) => w[0])
          .join('')
          .toUpperCase()
          .slice(0, 3) || 'HST'
      const year = new Date().getFullYear()
      let code = `${letters}${year}`
      let attempt = 1
      while (hostels.some((h) => h.code === code)) {
        code = `${letters}${year}${attempt}`
        attempt++
      }
      return code
    },
    [hostels],
  )

  const createHostel = useCallback(
    async (input: CreateHostelInput) => {
      await new Promise((r) => setTimeout(r, 700))
      if (!currentUser) return { ok: false, error: 'You must be signed in' }
      const code = generateHostelCode(input.name)
      const hostel: Hostel = {
        id: `hostel-${Date.now()}`,
        ...input,
        code,
        founderId: currentUser.id,
        createdAt: new Date().toISOString(),
      }
      persistHostels([...hostels, hostel])
      // Founder becomes maintainer
      updateUser({
        role: 'MAINTAINER',
        isFounder: true,
        hostelId: hostel.id,
        hostelCode: hostel.code,
        hostelName: hostel.name,
        joinStatus: 'approved',
      })
      return { ok: true, hostel }
    },
    [currentUser, generateHostelCode, hostels, updateUser],
  )

  const submitJoinRequest = useCallback(
    async (input: SubmitJoinInput) => {
      await new Promise((r) => setTimeout(r, 700))
      if (!currentUser) return { ok: false, error: 'You must be signed in' }
      const code = input.hostelCode.toUpperCase()
      const hostel = hostels.find((h) => h.code.toUpperCase() === code)
      if (!hostel) {
        return { ok: false, error: 'No hostel found with that code' }
      }
      const duplicate = joinRequests.find(
        (r) => r.studentId === currentUser.id && r.status === 'pending',
      )
      if (duplicate) {
        return { ok: false, error: 'You already have a pending request' }
      }
      const request: JoinRequest = {
        id: `req-${Date.now()}`,
        hostelCode: code,
        studentId: currentUser.id,
        studentName: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        roomNumber: input.roomNumber,
        preferredName: input.preferredName,
        intro: input.intro,
        status: 'pending',
        requestDate: new Date().toISOString(),
      }
      persistRequests([request, ...joinRequests])
      updateUser({
        joinStatus: 'pending',
        hostelId: hostel.id,
        hostelCode: hostel.code,
        hostelName: hostel.name,
      })
      return { ok: true }
    },
    [currentUser, hostels, joinRequests, updateUser],
  )

  const approveRequest = useCallback(
    async (id: string, assignedRoom: string, notes?: string) => {
      await new Promise((r) => setTimeout(r, 500))
      const next = joinRequests.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'approved' as RequestStatus,
              assignedRoom,
              notes,
              decidedAt: new Date().toISOString(),
            }
          : r,
      )
      persistRequests(next)
      // Promote the requesting student in the users store
      const target = joinRequests.find((r) => r.id === id)
      if (target) {
        try {
          const users = getStoredUsers()
          const idx = users.findIndex((u) => u.id === target.studentId)
          if (idx >= 0) {
            users[idx] = {
              ...users[idx],
              joinStatus: 'approved',
              hostelCode: target.hostelCode,
              profile: { ...users[idx].profile, roomNumber: assignedRoom },
            }
            persistUsers(users)
            // Reflect immediately if the approved student is the current user
            if (currentUser?.id === target.studentId) {
              updateUser({ joinStatus: 'approved', profile: { roomNumber: assignedRoom } })
            }
          }
        } catch {
          // ignore
        }
      }
    },
    [joinRequests, getStoredUsers, persistUsers, currentUser, updateUser],
  )

  const rejectRequest = useCallback(
    async (id: string, reason: string) => {
      await new Promise((r) => setTimeout(r, 500))
      const next = joinRequests.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'rejected' as RequestStatus,
              rejectReason: reason,
              decidedAt: new Date().toISOString(),
            }
          : r,
      )
      persistRequests(next)
      const target = joinRequests.find((r) => r.id === id)
      if (target) {
        try {
          const users = getStoredUsers()
          const idx = users.findIndex((u) => u.id === target.studentId)
          if (idx >= 0) {
            users[idx] = { ...users[idx], joinStatus: 'rejected' }
            persistUsers(users)
            if (currentUser?.id === target.studentId) {
              updateUser({ joinStatus: 'rejected' })
            }
          }
        } catch {
          // ignore
        }
      }
    },
    [joinRequests, getStoredUsers, persistUsers, currentUser, updateUser],
  )

  const requestsForCurrentHostel = useCallback(() => {
    if (!currentUser?.hostelCode) return joinRequests
    return joinRequests.filter(
      (r) => r.hostelCode.toUpperCase() === currentUser.hostelCode!.toUpperCase(),
    )
  }, [currentUser, joinRequests])

  return (
    <HostelContext.Provider
      value={{
        hostels,
        joinRequests,
        hostelExists,
        generateHostelCode,
        createHostel,
        submitJoinRequest,
        approveRequest,
        rejectRequest,
        requestsForCurrentHostel,
      }}
    >
      {children}
    </HostelContext.Provider>
  )
}

export function useHostel() {
  const context = useContext(HostelContext)
  if (context === undefined) {
    throw new Error('useHostel must be used within HostelProvider')
  }
  return context
}
