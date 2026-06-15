'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { PageContainer } from '@/components/layout/PageContainer'
import { ChevronLeft, ChevronRight, Edit2, Copy } from 'lucide-react'

interface DutyAssignment {
  date: Date
  studentId: string
  studentName: string
  room: string
  status: 'pending' | 'completed' | 'swapped'
}

const mockDuties: DutyAssignment[] = [
  { date: new Date(2025, 5, 16), studentId: '1', studentName: 'Rahul Kumar', room: '101', status: 'pending' },
  { date: new Date(2025, 5, 17), studentId: '2', studentName: 'Priya Sharma', room: '102', status: 'completed' },
  { date: new Date(2025, 5, 18), studentId: '3', studentName: 'Amit Patel', room: '103', status: 'pending' },
  { date: new Date(2025, 5, 19), studentId: '4', studentName: 'Neha Singh', room: '104', status: 'swapped' },
  { date: new Date(2025, 5, 20), studentId: '1', studentName: 'Rahul Kumar', room: '101', status: 'pending' },
  { date: new Date(2025, 5, 21), studentId: '2', studentName: 'Priya Sharma', room: '102', status: 'pending' },
]

export default function CookingDutiesPage() {
  const { currentRole } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 15))
  const [duties, setDuties] = useState<DutyAssignment[]>(mockDuties)
  const [showReassignModal, setShowReassignModal] = useState(false)
  const [selectedDuty, setSelectedDuty] = useState<DutyAssignment | null>(null)

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const getDutyForDate = (day: number) => {
    return duties.find(d => d.date.getDate() === day && d.date.getMonth() === currentDate.getMonth() && d.date.getFullYear() === currentDate.getFullYear())
  }

  const updateStatus = (date: Date, status: 'pending' | 'completed' | 'swapped') => {
    setDuties(duties.map(d => d.date === date ? { ...d, status } : d))
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <PageContainer title="Cooking Duties">
      <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#111827] dark:text-white">{monthName}</h3>
          {currentRole === 'MAINTAINER' && (
            <button className="px-4 py-2 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] font-semibold rounded-lg transition-all">
              Assign Duty
            </button>
          )}
          <div className="flex gap-2">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded-lg">
              <ChevronLeft size={20} className="text-[#6B7280] dark:text-[#9CA3AF]" />
            </button>
            <button onClick={handleNextMonth} className="p-2 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded-lg">
              <ChevronRight size={20} className="text-[#6B7280] dark:text-[#9CA3AF]" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-6">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] py-2">
              {d}
            </div>
          ))}
          {Array(firstDay).fill(null).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map(day => {
            const duty = getDutyForDate(day)
            return (
              <div key={day} className="bg-[#F5F7FA] dark:bg-[#374151] rounded-lg p-3 min-h-24 flex flex-col">
                <p className="font-bold text-[#111827] dark:text-white text-sm mb-2">{day}</p>
                {duty ? (
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#111827] dark:text-white truncate">{duty.studentName}</p>
                      <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Room {duty.room}</p>
                    </div>
                    <div className="mt-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded inline-block ${
                        duty.status === 'completed'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : duty.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {duty.status === 'completed' ? 'Done' : duty.status === 'pending' ? 'Pending' : 'Swapped'}
                      </span>
                    </div>
                    {currentRole === 'MAINTAINER' && (
                      <div className="mt-2 flex gap-1">
                        <button className="p-1 hover:bg-[#E5E7EB] dark:hover:bg-[#1F2937] rounded text-xs" title="Reassign">
                          <Edit2 size={12} className="text-[#6B7280]" />
                        </button>
                        <button className="p-1 hover:bg-[#E5E7EB] dark:hover:bg-[#1F2937] rounded text-xs" title="Swap">
                          <Copy size={12} className="text-[#6B7280]" />
                        </button>
                      </div>
                    )}
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
  )
}
