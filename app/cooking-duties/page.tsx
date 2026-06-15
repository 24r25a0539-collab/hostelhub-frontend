'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { PageContainer } from '@/components/layout/PageContainer'
import { ChevronLeft, ChevronRight, Edit2, Copy } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

interface DutyAssignment {
  date: Date
  studentId: string
  studentName: string
  room: string
  status: 'pending' | 'completed' | 'swapped'
}

const mockDuties: DutyAssignment[] = [
  { date: new Date(2026, 5, 1), studentId: '1', studentName: 'Arjun Reddy', room: 'A-101', status: 'completed' },
  { date: new Date(2026, 5, 2), studentId: '2', studentName: 'Priya Sharma', room: 'A-102', status: 'completed' },
  { date: new Date(2026, 5, 3), studentId: '3', studentName: 'Vikram Iyer', room: 'A-103', status: 'completed' },
  { date: new Date(2026, 5, 4), studentId: '4', studentName: 'Ananya Singh', room: 'A-104', status: 'completed' },
  { date: new Date(2026, 5, 5), studentId: '5', studentName: 'Rohit Mehra', room: 'A-105', status: 'completed' },
  { date: new Date(2026, 5, 6), studentId: '6', studentName: 'Sneha Patel', room: 'A-106', status: 'completed' },
  { date: new Date(2026, 5, 7), studentId: '7', studentName: 'Karthik Rao', room: 'A-107', status: 'completed' },
  { date: new Date(2026, 5, 8), studentId: '8', studentName: 'Divya Nair', room: 'A-108', status: 'completed' },
  { date: new Date(2026, 5, 9), studentId: '1', studentName: 'Arjun Reddy', room: 'A-101', status: 'completed' },
  { date: new Date(2026, 5, 10), studentId: '2', studentName: 'Priya Sharma', room: 'A-102', status: 'completed' },
  { date: new Date(2026, 5, 11), studentId: '3', studentName: 'Vikram Iyer', room: 'A-103', status: 'completed' },
  { date: new Date(2026, 5, 12), studentId: '4', studentName: 'Ananya Singh', room: 'A-104', status: 'completed' },
]

export default function CookingDutiesPage() {
  const { currentRole } = useAuth()
  const [currentMonth, setCurrentMonth] = useState(5) // June (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026)
  const [duties] = useState<DutyAssignment[]>(mockDuties)

  const getDaysInMonth = () => new Date(currentYear, currentMonth + 1, 0).getDate()
  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const daysInMonth = getDaysInMonth()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const getDutyForDate = (day: number) => {
    return duties.find(
      (d) => d.date.getDate() === day && d.date.getMonth() === currentMonth && d.date.getFullYear() === currentYear
    )
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  if (currentRole === 'STUDENT') {
    return (
      <ProtectedRoute>
        <PageContainer title="Cooking Duties">
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
            <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-4">Auto-rotated for the month. Swap with a teammate anytime.</p>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#111827] dark:text-white">{monthName}</h2>
              <button className="px-4 py-2 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] font-semibold rounded-lg transition-all flex items-center gap-2">
                Request swap
              </button>
            </div>

            {/* Daily Duty Cards - Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {days.slice(0, 12).map((day) => {
                const duty = getDutyForDate(day)
                const dateStr = new Date(currentYear, currentMonth, day).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                })
                const dayName = new Date(currentYear, currentMonth, day).toLocaleDateString('en-US', { weekday: 'short' })

                return (
                  <div key={day} className="bg-[#F5F7FA] dark:bg-[#374151] rounded-2xl p-4 border border-[#E5E7EB] dark:border-[#4B5563]">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF]">Day {day}</p>
                        <p className="text-sm font-semibold text-[#111827] dark:text-white">{dateStr}</p>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded">
                        {duty?.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                    </div>

                    {duty ? (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#1F3A93] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-white">
                            {duty.studentName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#111827] dark:text-white">{duty.studentName}</p>
                          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Room {duty.room}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-[#9CA3AF]">Not assigned</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </PageContainer>
      </ProtectedRoute>
    )
  }

  // Maintainer View
  return (
    <ProtectedRoute requiredRole="MAINTAINER">
      <PageContainer title="Cooking Duties Management">
        <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151] mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#111827] dark:text-white">{monthName}</h2>
            <div className="flex items-center gap-4">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded-lg">
                <ChevronLeft size={20} className="text-[#6B7280] dark:text-[#9CA3AF]" />
              </button>
              <button onClick={handleNextMonth} className="p-2 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded-lg">
                <ChevronRight size={20} className="text-[#6B7280] dark:text-[#9CA3AF]" />
              </button>
            </div>
          </div>

          {/* Daily Duty Cards - Maintainer Can Edit */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {days.slice(0, 12).map((day) => {
              const duty = getDutyForDate(day)
              const dateStr = new Date(currentYear, currentMonth, day).toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
              })

              return (
                <div key={day} className="bg-[#F5F7FA] dark:bg-[#374151] rounded-2xl p-4 border border-[#E5E7EB] dark:border-[#4B5563]">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF]">Day {day}</p>
                      <p className="text-sm font-semibold text-[#111827] dark:text-white">{dateStr}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-medium rounded">
                      {duty?.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                  </div>

                  {duty ? (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-[#1F3A93] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-white">
                            {duty.studentName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#111827] dark:text-white">{duty.studentName}</p>
                          <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Room {duty.room}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 p-2 hover:bg-[#E5E7EB] dark:hover:bg-[#2D3748] rounded text-xs font-medium text-[#111827] dark:text-white flex items-center justify-center gap-1">
                          <Edit2 size={14} /> Reassign
                        </button>
                        <button className="flex-1 p-2 hover:bg-[#E5E7EB] dark:hover:bg-[#2D3748] rounded text-xs font-medium text-[#111827] dark:text-white flex items-center justify-center gap-1">
                          <Copy size={14} /> Swap
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button className="w-full p-2 border border-[#1F3A93] text-[#1F3A93] dark:text-[#F7B538] dark:border-[#F7B538] rounded text-xs font-medium hover:bg-[#1F3A93]/10 transition-all">
                      Assign
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </PageContainer>
    </ProtectedRoute>
  )
}
