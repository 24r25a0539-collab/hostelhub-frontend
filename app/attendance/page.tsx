'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { PageContainer } from '@/components/layout/PageContainer'
import { ChevronLeft, ChevronRight, Lock, Edit2 } from 'lucide-react'

interface AttendanceRecord {
  status: 'present' | 'absent' | null
  submitted: boolean
  editCount: number
}

interface StudentAttendance {
  id: string
  name: string
  room: string
  attendance: { [key: string]: AttendanceRecord }
}

const mockStudents: StudentAttendance[] = [
  { id: '1', name: 'Rahul Kumar', room: '101', attendance: {} },
  { id: '2', name: 'Priya Sharma', room: '102', attendance: {} },
  { id: '3', name: 'Amit Patel', room: '103', attendance: {} },
  { id: '4', name: 'Neha Singh', room: '104', attendance: {} },
]

export default function AttendancePage() {
  const { currentRole } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 15))
  const [students, setStudents] = useState<StudentAttendance[]>(mockStudents)

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))

  const updateAttendance = (studentId: string, day: number, status: 'present' | 'absent' | null) => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`
    setStudents(students.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          attendance: {
            ...s.attendance,
            [dateKey]: {
              status,
              submitted: false,
              editCount: s.attendance[dateKey]?.editCount || 0,
            },
          },
        }
      }
      return s
    }))
  }

  const submitAttendance = (studentId: string) => {
    setStudents(students.map(s => {
      if (s.id === studentId) {
        const updated = { ...s }
        Object.keys(updated.attendance).forEach(key => {
          if (updated.attendance[key].status) {
            updated.attendance[key].submitted = true
          }
        })
        return updated
      }
      return s
    }))
  }

  const editAttendance = (studentId: string, day: number) => {
    const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`
    setStudents(students.map(s => {
      if (s.id === studentId && s.attendance[dateKey]) {
        const record = s.attendance[dateKey]
        if (record.editCount < 3) {
          return {
            ...s,
            attendance: {
              ...s.attendance,
              [dateKey]: {
                ...record,
                editCount: record.editCount + 1,
              },
            },
          }
        }
      }
      return s
    }))
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  if (currentRole === 'STUDENT') {
    const currentStudent = students[0]
    return (
      <PageContainer title="My Attendance">
        <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#111827] dark:text-white">{monthName}</h3>
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
              const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${day}`
              const record = currentStudent.attendance[dateKey]
              const isLocked = record?.submitted && record.editCount >= 3
              return (
                <div key={day} className="relative">
                  <button
                    onClick={() => {
                      if (!isLocked) {
                        updateAttendance(currentStudent.id, day, record?.status === 'present' ? 'absent' : 'present')
                      }
                    }}
                    disabled={isLocked}
                    className={`w-full p-3 rounded-lg text-sm font-semibold transition-all ${
                      !record
                        ? 'bg-[#F5F7FA] dark:bg-[#374151] text-[#6B7280] dark:text-[#9CA3AF]'
                        : record.status === 'present'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : record.status === 'absent'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-[#F5F7FA] dark:bg-[#374151]'
                    } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
                  >
                    {day}
                  </button>
                  {isLocked && <Lock size={12} className="absolute top-1 right-1 text-red-600" />}
                  {record?.submitted && record.editCount > 0 && !isLocked && (
                    <span className="absolute top-1 right-1 text-xs bg-yellow-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                      {record.editCount}
                    </span>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
              <p>Edit Count: <span className="font-semibold text-[#111827] dark:text-white">3/3</span></p>
            </div>
            <button
              onClick={() => submitAttendance(currentStudent.id)}
              className="px-6 py-2 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] font-semibold rounded-lg transition-all"
            >
              Submit Attendance
            </button>
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer title="Attendance Management">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#111827] dark:text-white">{monthName}</h3>
            <div className="flex gap-2">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded-lg">
                <ChevronLeft size={20} className="text-[#6B7280] dark:text-[#9CA3AF]" />
              </button>
              <button onClick={handleNextMonth} className="p-2 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded-lg">
                <ChevronRight size={20} className="text-[#6B7280] dark:text-[#9CA3AF]" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] dark:border-[#374151]">
                  <th className="text-left py-3 px-4 font-semibold text-[#111827] dark:text-white">Student</th>
                  <th className="text-center py-3 px-4 font-semibold text-[#111827] dark:text-white">Room</th>
                  <th className="text-center py-3 px-4 font-semibold text-[#111827] dark:text-white">Status</th>
                  <th className="text-center py-3 px-4 font-semibold text-[#111827] dark:text-white">Edits</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => {
                  const todayKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${new Date().getDate()}`
                  const todayRecord = student.attendance[todayKey]
                  return (
                    <tr key={student.id} className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F5F7FA] dark:hover:bg-[#374151]">
                      <td className="py-3 px-4 text-[#111827] dark:text-white">{student.name}</td>
                      <td className="py-3 px-4 text-center text-[#6B7280] dark:text-[#9CA3AF]">{student.room}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          todayRecord?.status === 'present'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : todayRecord?.status === 'absent'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                          {todayRecord?.status === 'present' ? 'Present' : todayRecord?.status === 'absent' ? 'Absent' : 'Not Marked'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-[#111827] dark:text-white font-medium">
                        {todayRecord?.editCount ?? 0}/3
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
          <h3 className="font-bold text-[#111827] dark:text-white mb-6">Analytics</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-1">Attendance Rate</p>
              <p className="text-2xl font-bold text-[#111827] dark:text-white">90.5%</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-1">Present Today</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">38/42</p>
            </div>
            <div>
              <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mb-1">Absent Today</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">4</p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
