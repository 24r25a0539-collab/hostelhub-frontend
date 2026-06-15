'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { PageContainer } from '@/components/layout/PageContainer'
import { Edit2, Copy } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

interface DutyAssignment {
  date: Date
  studentId: string
  studentName: string
  room: string
  status: 'pending' | 'completed' | 'swapped'
}

const mockDuties: DutyAssignment[] = [
  { date: new Date(2025, 5, 16), studentId: '1', studentName: 'Arjun Reddy', room: '101', status: 'pending' },
  { date: new Date(2025, 5, 17), studentId: '2', studentName: 'Priya Sharma', room: '102', status: 'completed' },
  { date: new Date(2025, 5, 18), studentId: '3', studentName: 'Vikram Iyer', room: '103', status: 'pending' },
  { date: new Date(2025, 5, 19), studentId: '4', studentName: 'Neha Singh', room: '104', status: 'swapped' },
  { date: new Date(2025, 5, 20), studentId: '5', studentName: 'Rahul Kumar', room: '105', status: 'pending' },
  { date: new Date(2025, 5, 21), studentId: '6', studentName: 'Anjali Verma', room: '106', status: 'pending' },
]

export default function CookingDutiesPage() {
  const { currentRole } = useAuth()
  const [currentMonth, setCurrentMonth] = useState(6) // June
  const [currentYear, setCurrentYear] = useState(2025)
  const [duties, setDuties] = useState<DutyAssignment[]>(mockDuties)

  const getDaysInMonth = () => new Date(currentYear, currentMonth + 1, 0).getDate()
  const getFirstDayOfMonth = () => new Date(currentYear, currentMonth, 1).getDay()

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const getDutyForDate = (day: number) => {
    return duties.find(d => d.date.getDate() === day && d.date.getMonth() === currentMonth && d.date.getFullYear() === currentYear)
  }

  const daysInMonth = getDaysInMonth()
  const firstDay = getFirstDayOfMonth()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  if (currentRole === 'STUDENT') {
    return (
      <ProtectedRoute>
        <PageContainer title="My Cooking Duties">
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
            <p className="text-[#6B7280] dark:text-[#9CA3AF]">You can view your assigned cooking duties here.</p>
          </div>
        </PageContainer>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="MAINTAINER">
      <PageContainer title="Cooking Duties Management">
        {/* Month/Year Selectors */}
        <div className="mb-6 bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#111827] dark:text-white mb-2">Month</label>
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                className="p-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white"
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(
                  (month, idx) => (
                    <option key={idx} value={idx}>
                      {month}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] dark:text-white mb-2">Year</label>
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                className="p-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white"
              >
                {[2024, 2025, 2026].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
          <h2 className="text-2xl font-bold text-[#111827] dark:text-white mb-6">{monthName}</h2>

          <div className="grid grid-cols-7 gap-3">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] py-3">
                {d}
              </div>
            ))}

            {/* Empty cells */}
            {Array(firstDay)
              .fill(null)
              .map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

            {/* Day cells */}
            {days.map(day => {
              const duty = getDutyForDate(day)
              return (
                <div key={day} className="bg-[#F5F7FA] dark:bg-[#374151] rounded-lg p-4 min-h-28 flex flex-col">
                  <p className="font-bold text-[#111827] dark:text-white text-sm mb-3">{day}</p>

                  {duty ? (
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-semibold text-[#111827] dark:text-white truncate">{duty.studentName}</p>
                        <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Room {duty.room}</p>
                      </div>

                      <div>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded inline-block mb-2 ${
                            duty.status === 'completed'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : duty.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}
                        >
                          {duty.status === 'completed' ? 'Completed' : duty.status === 'pending' ? 'Pending' : 'Swapped'}
                        </span>

                        <div className="flex gap-1">
                          <button className="p-1 hover:bg-[#E5E7EB] dark:hover:bg-[#1F2937] rounded text-xs" title="Reassign Duty">
                            <Edit2 size={12} className="text-[#6B7280]" />
                          </button>
                          <button className="p-1 hover:bg-[#E5E7EB] dark:hover:bg-[#1F2937] rounded text-xs" title="Swap Duty">
                            <Copy size={12} className="text-[#6B7280]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#9CA3AF]">Unassigned</p>
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
