'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { PageContainer } from '@/components/layout/PageContainer'
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

interface StudentAttendance {
  id: string
  name: string
  room: string
  attendance: 'present' | 'absent' | null
}

const mockStudents: StudentAttendance[] = [
  { id: '1', name: 'Arjun Reddy', room: 'A-101', attendance: null },
  { id: '2', name: 'Priya Sharma', room: 'A-102', attendance: null },
  { id: '3', name: 'Vikram Iyer', room: 'A-103', attendance: null },
  { id: '4', name: 'Ananya Singh', room: 'A-104', attendance: null },
  { id: '5', name: 'Rohit Mehra', room: 'A-105', attendance: null },
  { id: '6', name: 'Sneha Patel', room: 'A-106', attendance: null },
]

export default function AttendancePage() {
  const { currentRole } = useAuth()
  const [currentMonth, setCurrentMonth] = useState(5) // June (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026)
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [studentsForDate, setStudentsForDate] = useState<StudentAttendance[]>(mockStudents)

  const getDaysInMonth = () => new Date(currentYear, currentMonth + 1, 0).getDate()
  const getFirstDayOfMonth = () => new Date(currentYear, currentMonth, 1).getDay()

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const daysInMonth = getDaysInMonth()
  const firstDay = getFirstDayOfMonth()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const handleDateSelect = (day: number) => {
    setSelectedDate(day)
    setStudentsForDate(mockStudents.map(s => ({ ...s, attendance: null })))
  }

  const handleAttendance = (studentId: string, status: 'present' | 'absent') => {
    setStudentsForDate(
      studentsForDate.map(s => (s.id === studentId ? { ...s, attendance: status } : s))
    )
  }

  const handleSubmit = () => {
    alert(`Attendance marked for ${selectedDate} ${monthName}`)
    setSelectedDate(null)
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

  // Student View
  if (currentRole === 'STUDENT') {
    return (
      <ProtectedRoute>
        <PageContainer title="My Attendance">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">Attendance Percentage</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">92%</p>
            </div>
            <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">Present Days</p>
              <p className="text-4xl font-bold text-[#111827] dark:text-white">22</p>
            </div>
            <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">Absent Days</p>
              <p className="text-4xl font-bold text-red-600 dark:text-red-400">2</p>
            </div>
          </div>

          {/* Attendance Calendar */}
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#111827] dark:text-white">{monthName}</h2>
              <div className="flex gap-2">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded-lg">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={handleNextMonth} className="p-2 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded-lg">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] py-2">
                  {d}
                </div>
              ))}
              {Array(firstDay).fill(null).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map(day => (
                <div
                  key={day}
                  className="aspect-square flex items-center justify-center rounded-lg bg-[#F5F7FA] dark:bg-[#374151] text-sm font-semibold text-[#111827] dark:text-white cursor-pointer hover:bg-[#E5E7EB] dark:hover:bg-[#4B5563] transition-all"
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </PageContainer>
      </ProtectedRoute>
    )
  }

  // Maintainer View
  return (
    <ProtectedRoute requiredRole="MAINTAINER">
      <PageContainer title="Attendance Management">
        <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
          {!selectedDate ? (
            <>
              {/* Month/Year Controls */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#111827] dark:text-white">{monthName}</h2>
                <div className="flex gap-2">
                  <button onClick={handlePrevMonth} className="p-2 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded-lg">
                    <ChevronLeft size={20} className="text-[#6B7280]" />
                  </button>
                  <button onClick={handleNextMonth} className="p-2 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded-lg">
                    <ChevronRight size={20} className="text-[#6B7280]" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] py-2">
                    {d}
                  </div>
                ))}
                {Array(firstDay).fill(null).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {days.map(day => (
                  <button
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    className="aspect-square flex items-center justify-center rounded-lg bg-[#F5F7FA] dark:bg-[#374151] text-sm font-semibold text-[#111827] dark:text-white hover:bg-[#E5E7EB] dark:hover:bg-[#4B5563] hover:border-2 border-[#1F3A93] transition-all"
                  >
                    {day}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Date Selection UI */}
              <button onClick={() => setSelectedDate(null)} className="mb-6 text-[#1F3A93] hover:text-[#162952] font-medium flex items-center gap-2">
                <ChevronLeft size={18} /> Back to Calendar
              </button>

              <h2 className="text-2xl font-bold text-[#111827] dark:text-white mb-6">
                {new Date(currentYear, currentMonth, selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </h2>

              {/* Student Attendance List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {studentsForDate.map(student => (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-[#F5F7FA] dark:bg-[#374151] rounded-lg border border-[#E5E7EB] dark:border-[#4B5563]">
                    <div>
                      <p className="font-semibold text-[#111827] dark:text-white">{student.name}</p>
                      <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Room {student.room}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAttendance(student.id, 'present')}
                        className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                          student.attendance === 'present'
                            ? 'bg-green-500 text-white'
                            : 'bg-white dark:bg-[#2D3748] text-[#111827] dark:text-white border border-[#E5E7EB] dark:border-[#4B5563] hover:border-green-500'
                        }`}
                      >
                        <Check size={18} /> Present
                      </button>
                      <button
                        onClick={() => handleAttendance(student.id, 'absent')}
                        className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                          student.attendance === 'absent'
                            ? 'bg-red-500 text-white'
                            : 'bg-white dark:bg-[#2D3748] text-[#111827] dark:text-white border border-[#E5E7EB] dark:border-[#4B5563] hover:border-red-500'
                        }`}
                      >
                        <X size={18} /> Absent
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="mt-6 w-full px-6 py-3 bg-[#1F3A93] text-white rounded-lg font-semibold hover:bg-[#162952] transition-all"
              >
                Submit Attendance
              </button>
            </>
          )}
        </div>
      </PageContainer>
    </ProtectedRoute>
  )
}
