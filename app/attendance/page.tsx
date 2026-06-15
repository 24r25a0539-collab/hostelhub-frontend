'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { PageContainer } from '@/components/layout/PageContainer'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

interface StudentAttendance {
  id: string
  name: string
  room: string
  attendance: 'present' | 'absent' | null
}

const mockStudents: StudentAttendance[] = [
  { id: '1', name: 'Arjun Reddy', room: '101', attendance: null },
  { id: '2', name: 'Priya Sharma', room: '102', attendance: null },
  { id: '3', name: 'Vikram Iyer', room: '103', attendance: null },
  { id: '4', name: 'Neha Singh', room: '104', attendance: null },
  { id: '5', name: 'Rahul Kumar', room: '105', attendance: null },
  { id: '6', name: 'Anjali Verma', room: '106', attendance: null },
]

export default function AttendancePage() {
  const { currentRole } = useAuth()
  const [currentMonth, setCurrentMonth] = useState(6) // June
  const [currentYear, setCurrentYear] = useState(2025)
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
    // Save attendance
    alert(`Attendance marked for ${selectedDate} ${monthName}`)
    setSelectedDate(null)
  }

  if (currentRole === 'STUDENT') {
    const currentStudent = mockStudents[0]
    const recordCount = {
      present: Math.floor(Math.random() * 20) + 10,
      absent: Math.floor(Math.random() * 5),
      percentage: 92,
    }

    return (
      <ProtectedRoute>
        <PageContainer title="My Attendance">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">Attendance Percentage</p>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{recordCount.percentage}%</p>
            </div>
            <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">Present Days</p>
              <p className="text-4xl font-bold text-[#111827] dark:text-white">{recordCount.present}</p>
            </div>
            <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">Absent Days</p>
              <p className="text-4xl font-bold text-red-600 dark:text-red-400">{recordCount.absent}</p>
            </div>
          </div>

          {/* Attendance Calendar */}
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#111827] dark:text-white">{monthName}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentMonth(m => (m - 1 + 12) % 12)}
                  className="p-2 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded-lg"
                >
                  <ChevronLeft size={20} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                </button>
                <button
                  onClick={() => setCurrentMonth(m => (m + 1) % 12)}
                  className="p-2 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded-lg"
                >
                  <ChevronRight size={20} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] py-2">
                  {d}
                </div>
              ))}
              {Array(firstDay)
                .fill(null)
                .map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
              {days.map(day => (
                <div
                  key={day}
                  className="p-3 rounded-lg bg-[#F5F7FA] dark:bg-[#374151] text-center"
                >
                  <p className="text-sm font-semibold text-[#111827] dark:text-white">{day}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">P</p>
                </div>
              ))}
            </div>
          </div>
        </PageContainer>
      </ProtectedRoute>
    )
  }

  // Maintainer view
  return (
    <ProtectedRoute requiredRole="MAINTAINER">
      <PageContainer title="Attendance Management">
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

        {selectedDate ? (
          // Mark attendance view
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
            <h2 className="text-2xl font-bold text-[#111827] dark:text-white mb-2">
              {selectedDate} {monthName}
            </h2>
            <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-6">Mark attendance for all students</p>

            <div className="space-y-4 mb-6">
              {studentsForDate.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-[#F5F7FA] dark:bg-[#374151] rounded-lg">
                  <div>
                    <p className="font-semibold text-[#111827] dark:text-white">{student.name}</p>
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Room {student.room}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAttendance(student.id, 'present')}
                      className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                        student.attendance === 'present'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-[#111827] dark:text-white hover:bg-gray-400'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => handleAttendance(student.id, 'absent')}
                      className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                        student.attendance === 'absent'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-[#111827] dark:text-white hover:bg-gray-400'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] font-semibold rounded-lg transition-all"
              >
                Submit Attendance
              </button>
              <button
                onClick={() => setSelectedDate(null)}
                className="px-6 py-3 border border-[#E5E7EB] dark:border-[#374151] text-[#111827] dark:text-white font-semibold rounded-lg hover:bg-[#F5F7FA] dark:hover:bg-[#374151] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // Calendar view
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
            <h2 className="text-2xl font-bold text-[#111827] dark:text-white mb-6">{monthName}</h2>

            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-semibold text-[#6B7280] dark:text-[#9CA3AF] py-2">
                  {d}
                </div>
              ))}
              {Array(firstDay)
                .fill(null)
                .map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => handleDateSelect(day)}
                  className="p-4 rounded-lg bg-[#F5F7FA] dark:bg-[#374151] hover:bg-[#F7B538] text-[#111827] dark:text-white font-semibold transition-all"
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}
      </PageContainer>
    </ProtectedRoute>
  )
}
