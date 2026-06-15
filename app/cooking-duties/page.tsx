'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { PageContainer } from '@/components/layout/PageContainer'
import { ChevronLeft, ChevronRight, Edit2, Copy, X } from 'lucide-react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { HOSTEL_STUDENTS } from '@/lib/students-data'

interface CookingDuty {
  id: string
  date: Date
  studentId: string
  studentName: string
  roomNumber: string
  backlogCount: number
}

const mockStudents = HOSTEL_STUDENTS.map(s => ({
  id: s.id,
  name: s.name,
  room: s.room,
  backlogCount: s.backlogCount,
}))

const generateMockDuties = (month: number, year: number) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const duties: CookingDuty[] = []

  for (let day = 1; day <= daysInMonth; day++) {
    const studentIndex = (day - 1) % mockStudents.length
    const student = mockStudents[studentIndex]
    duties.push({
      id: `${month}-${year}-${day}`,
      date: new Date(year, month, day),
      studentId: student.id,
      studentName: student.name,
      roomNumber: student.room,
      backlogCount: student.backlogCount,
    })
  }

  return duties
}

export default function CookingDutiesPage() {
  const { currentRole } = useAuth()
  const [currentMonth, setCurrentMonth] = useState(5) // June (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026)
  const [duties, setDuties] = useState<CookingDuty[]>(generateMockDuties(5, 2026))
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [showReassignDialog, setShowReassignDialog] = useState(false)
  const [showSwapDialog, setShowSwapDialog] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedSwapDay, setSelectedSwapDay] = useState<number | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [toast, setToast] = useState('')

  const getDaysInMonth = () => new Date(currentYear, currentMonth + 1, 0).getDate()
  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const daysInMonth = getDaysInMonth()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const getDutyForDate = (day: number) => {
    return duties.find(
      (d) => d.date.getDate() === day && d.date.getMonth() === currentMonth && d.date.getFullYear() === currentYear
    )
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    )
  }

  const getTodaysDuty = () => {
    const today = new Date()
    return duties.find(
      (d) =>
        d.date.getDate() === today.getDate() &&
        d.date.getMonth() === today.getMonth() &&
        d.date.getFullYear() === today.getFullYear()
    )
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
    setDuties(generateMockDuties(currentMonth === 0 ? 11 : currentMonth - 1, currentMonth === 0 ? currentYear - 1 : currentYear))
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
    setDuties(generateMockDuties(currentMonth === 11 ? 0 : currentMonth + 1, currentMonth === 11 ? currentYear + 1 : currentYear))
  }

  const handleAssignDuty = () => {
    if (currentRole !== 'MAINTAINER') {
      setToast('You are not the current maintainer.')
      setTimeout(() => setToast(''), 3000)
      return
    }

    if (!selectedDay || !selectedStudent) return

    const student = mockStudents.find(s => s.id === selectedStudent)
    if (!student) return

    const newDuty: CookingDuty = {
      id: `${currentMonth}-${currentYear}-${selectedDay}`,
      date: new Date(currentYear, currentMonth, selectedDay),
      studentId: student.id,
      studentName: student.name,
      roomNumber: student.room,
    }

    setDuties(duties.filter(d => d.date.getDate() !== selectedDay || d.date.getMonth() !== currentMonth || d.date.getFullYear() !== currentYear).concat(newDuty))
    setShowAssignDialog(false)
    setSelectedDay(null)
    setSelectedStudent('')
  }

  const handleReassignDuty = () => {
    if (currentRole !== 'MAINTAINER') {
      setToast('You are not the current maintainer.')
      setTimeout(() => setToast(''), 3000)
      return
    }

    if (!selectedDay || !selectedStudent) return

    const student = mockStudents.find(s => s.id === selectedStudent)
    if (!student) return

    const newDuty: CookingDuty = {
      id: `${currentMonth}-${currentYear}-${selectedDay}`,
      date: new Date(currentYear, currentMonth, selectedDay),
      studentId: student.id,
      studentName: student.name,
      roomNumber: student.room,
    }

    setDuties(duties.filter(d => d.date.getDate() !== selectedDay || d.date.getMonth() !== currentMonth || d.date.getFullYear() !== currentYear).concat(newDuty))
    setShowReassignDialog(false)
    setSelectedDay(null)
    setSelectedStudent('')
  }

  const handleSwapDuty = () => {
    if (currentRole !== 'MAINTAINER') {
      setToast('You are not the current maintainer.')
      setTimeout(() => setToast(''), 3000)
      return
    }

    if (!selectedDay || !selectedSwapDay) return

    const duty1 = getDutyForDate(selectedDay)
    const duty2 = getDutyForDate(selectedSwapDay)

    if (!duty1 || !duty2) return

    const updatedDuties = duties.map(d => {
      if (d.date.getDate() === selectedDay && d.date.getMonth() === currentMonth && d.date.getFullYear() === currentYear) {
        return {
          ...d,
          studentId: duty2.studentId,
          studentName: duty2.studentName,
          roomNumber: duty2.roomNumber,
        }
      }
      if (d.date.getDate() === selectedSwapDay && d.date.getMonth() === currentMonth && d.date.getFullYear() === currentYear) {
        return {
          ...d,
          studentId: duty1.studentId,
          studentName: duty1.studentName,
          roomNumber: duty1.roomNumber,
        }
      }
      return d
    })

    setDuties(updatedDuties)
    setShowSwapDialog(false)
    setSelectedDay(null)
    setSelectedSwapDay(null)
  }

  const todaysDuty = getTodaysDuty()

  // Student View
  if (currentRole === 'STUDENT') {
    return (
      <ProtectedRoute>
        <PageContainer title="Cooking Duties" breadcrumbs={[{ label: 'Cooking Duties' }]}>
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E5E7EB]">
                <p className="text-sm text-[#6B7280] mb-2">Total Students</p>
                <p className="text-3xl font-bold text-[#111827]">{mockStudents.length}</p>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E5E7EB]">
                <p className="text-sm text-[#6B7280] mb-2">Total Assigned Days</p>
                <p className="text-3xl font-bold text-[#111827]">{daysInMonth}</p>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E5E7EB]">
                <p className="text-sm text-[#6B7280] mb-2">Today&apos;s Duty Student</p>
                <p className="text-lg font-bold text-[#111827]">{todaysDuty?.studentName || '-'}</p>
              </div>
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E5E7EB]">
                <p className="text-sm text-[#6B7280] mb-2">Next Month</p>
                <p className="text-lg font-bold text-[#111827]">{currentMonth === 11 ? 'January' : new Date(currentYear, currentMonth + 1).toLocaleDateString('en-US', { month: 'short' })}</p>
              </div>
            </div>

            {/* Monthly Calendar */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E5E7EB]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#111827]">{monthName}</h2>
                <div className="flex gap-2">
                  <button onClick={handlePrevMonth} className="p-2 hover:bg-[#F5F7FA] rounded-lg">
                    <ChevronLeft size={20} className="text-[#6B7280]" />
                  </button>
                  <button onClick={handleNextMonth} className="p-2 hover:bg-[#F5F7FA] rounded-lg">
                    <ChevronRight size={20} className="text-[#6B7280]" />
                  </button>
                </div>
              </div>

              {/* Day Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {days.map(day => {
                  const duty = getDutyForDate(day)
                  const dayName = new Date(currentYear, currentMonth, day).toLocaleDateString('en-US', { weekday: 'long' })
                  const dateStr = new Date(currentYear, currentMonth, day).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                  const isTodayDate = isToday(day)

                  return (
                    <div
                      key={day}
                      className={`rounded-2xl p-4 border-2 transition-all ${
                        isTodayDate
                          ? 'bg-green-50 border-green-300'
                          : 'bg-[#F5F7FA] border-[#E5E7EB] hover:border-[#1F3A93]'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm font-semibold text-[#111827]">{day} {new Date(currentYear, currentMonth, day).toLocaleDateString('en-US', { month: 'short' })}</p>
                          <p className="text-xs text-[#6B7280]">{dayName}</p>
                        </div>
                        {isTodayDate && (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                            Today
                          </span>
                        )}
                      </div>

                      {duty ? (
                        <div className="p-3 bg-white rounded-lg border border-[#E5E7EB]">
                          <p className="text-sm font-semibold text-[#111827]">{duty.studentName}</p>
                          <p className="text-xs text-[#6B7280]">Room {duty.roomNumber}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-[#6B7280]">Not assigned</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </PageContainer>
      </ProtectedRoute>
    )
  }

  // Maintainer View
  return (
    <ProtectedRoute requiredRole="MAINTAINER">
      <PageContainer title="Cooking Duties Management" breadcrumbs={[{ label: 'Cooking Duties' }]}>
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E5E7EB]">
              <p className="text-sm text-[#6B7280] mb-2">Total Students</p>
              <p className="text-3xl font-bold text-[#111827]">{mockStudents.length}</p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E5E7EB]">
              <p className="text-sm text-[#6B7280] mb-2">Total Assigned Days</p>
              <p className="text-3xl font-bold text-[#111827]">{daysInMonth}</p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E5E7EB]">
              <p className="text-sm text-[#6B7280] mb-2">Today&apos;s Duty Student</p>
              <p className="text-lg font-bold text-[#111827]">{todaysDuty?.studentName || '-'}</p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E5E7EB]">
              <p className="text-sm text-[#6B7280] mb-2">Upcoming Duty</p>
              <p className="text-lg font-bold text-[#111827]">{getDutyForDate((new Date().getDate() % daysInMonth) + 1)?.studentName || '-'}</p>
            </div>
          </div>

          {/* Calendar with Management */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#111827]">{monthName}</h2>
              <div className="flex gap-2">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-[#F5F7FA] rounded-lg">
                  <ChevronLeft size={20} className="text-[#6B7280]" />
                </button>
                <button onClick={handleNextMonth} className="p-2 hover:bg-[#F5F7FA] rounded-lg">
                  <ChevronRight size={20} className="text-[#6B7280]" />
                </button>
              </div>
            </div>

            {/* Day Cards Grid with Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {days.map(day => {
                const duty = getDutyForDate(day)
                const dayName = new Date(currentYear, currentMonth, day).toLocaleDateString('en-US', { weekday: 'long' })
                const isTodayDate = isToday(day)

                return (
                  <div
                    key={day}
                    className={`rounded-2xl p-4 border-2 transition-all ${
                      isTodayDate
                        ? 'bg-green-50 border-green-300'
                        : 'bg-[#F5F7FA] border-[#E5E7EB] hover:border-[#1F3A93]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm font-semibold text-[#111827]">{day} {new Date(currentYear, currentMonth, day).toLocaleDateString('en-US', { month: 'short' })}</p>
                        <p className="text-xs text-[#6B7280]">{dayName}</p>
                      </div>
                      {isTodayDate && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                          Today
                        </span>
                      )}
                    </div>

                    {duty ? (
                      <div>
                        <div className="p-3 bg-white rounded-lg border border-[#E5E7EB] mb-3">
                          <p className="text-sm font-semibold text-[#111827]">{duty.studentName}</p>
                          <p className="text-xs text-[#6B7280]">Room {duty.roomNumber}</p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedDay(day)
                              setShowReassignDialog(true)
                            }}
                            className="flex-1 px-2 py-1 text-xs font-medium bg-[#1F3A93] text-white rounded hover:bg-[#162952] transition-all flex items-center justify-center gap-1"
                          >
                            <Edit2 size={14} /> Reassign
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDay(day)
                              setShowSwapDialog(true)
                            }}
                            className="flex-1 px-2 py-1 text-xs font-medium bg-[#1F3A93] text-white rounded hover:bg-[#162952] transition-all flex items-center justify-center gap-1"
                          >
                            <Copy size={14} /> Swap
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedDay(day)
                          setShowAssignDialog(true)
                        }}
                        className="w-full px-3 py-2 text-xs font-medium border-2 border-[#1F3A93] text-[#1F3A93] rounded hover:bg-[#1F3A93] hover:text-white transition-all"
                      >
                        Assign Duty
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Toast */}
          {toast && (
            <div className="fixed bottom-6 right-6 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
              {toast}
            </div>
          )}

          {/* Assign Dialog */}
          {showAssignDialog && selectedDay && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#111827]">Assign Duty</h3>
                  <button onClick={() => setShowAssignDialog(false)} className="p-1 hover:bg-[#F5F7FA] rounded-lg">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-[#6B7280]">
                    Date: {new Date(currentYear, currentMonth, selectedDay).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>

                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">Select Student</label>
                    <select
                      value={selectedStudent}
                      onChange={e => setSelectedStudent(e.target.value)}
                      className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F3A93]"
                    >
                      <option value="">Choose a student...</option>
                      {mockStudents.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name} (Room {student.room})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowAssignDialog(false)}
                      className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded-lg font-semibold text-[#111827] hover:bg-[#F5F7FA] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAssignDuty}
                      className="flex-1 px-4 py-2 bg-[#1F3A93] text-white rounded-lg font-semibold hover:bg-[#162952] transition-all"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reassign Dialog */}
          {showReassignDialog && selectedDay && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#111827]">Reassign Duty</h3>
                  <button onClick={() => setShowReassignDialog(false)} className="p-1 hover:bg-[#F5F7FA] rounded-lg">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-[#6B7280]">
                    Current: {getDutyForDate(selectedDay)?.studentName}
                  </p>

                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">Select New Student</label>
                    <select
                      value={selectedStudent}
                      onChange={e => setSelectedStudent(e.target.value)}
                      className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F3A93]"
                    >
                      <option value="">Choose a student...</option>
                      {mockStudents.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name} (Room {student.room})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowReassignDialog(false)}
                      className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded-lg font-semibold text-[#111827] hover:bg-[#F5F7FA] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReassignDuty}
                      className="flex-1 px-4 py-2 bg-[#1F3A93] text-white rounded-lg font-semibold hover:bg-[#162952] transition-all"
                    >
                      Reassign
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Swap Dialog */}
          {showSwapDialog && selectedDay && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#111827]">Swap Duty</h3>
                  <button onClick={() => setShowSwapDialog(false)} className="p-1 hover:bg-[#F5F7FA] rounded-lg">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-[#6B7280]">
                    Swap {getDutyForDate(selectedDay)?.studentName} with another date
                  </p>

                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">Select Second Date</label>
                    <select
                      value={selectedSwapDay || ''}
                      onChange={e => setSelectedSwapDay(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F3A93]"
                    >
                      <option value="">Choose a date...</option>
                      {days.map(day => {
                        if (day === selectedDay) return null
                        const dutyForDay = getDutyForDate(day)
                        return (
                          <option key={day} value={day}>
                            {day} - {dutyForDay?.studentName}
                          </option>
                        )
                      })}
                    </select>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowSwapDialog(false)}
                      className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded-lg font-semibold text-[#111827] hover:bg-[#F5F7FA] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSwapDuty}
                      className="flex-1 px-4 py-2 bg-[#1F3A93] text-white rounded-lg font-semibold hover:bg-[#162952] transition-all"
                    >
                      Swap
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </ProtectedRoute>
  )
}
