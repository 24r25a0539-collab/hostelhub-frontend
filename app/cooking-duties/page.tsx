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
]

export default function CookingDutiesPage() {
  const { currentRole } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 15))
  const [duties, setDuties] = useState<DutyAssignment[]>(mockDuties)
  const [showReassignModal, setShowReassignModal] = useState(false)
  const [selectedDuty, setSelectedDuty] = useState<DutyAssignment | null>(null)

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const updateStatus = (date: Date, status: 'pending' | 'completed' | 'swapped') => {
    setDuties(duties.map(d => d.date === date ? { ...d, status } : d))
  }

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

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-[#374151]">
                <th className="text-left py-3 px-4 font-semibold text-[#111827] dark:text-white">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-[#111827] dark:text-white">Student</th>
                <th className="text-center py-3 px-4 font-semibold text-[#111827] dark:text-white">Room</th>
                <th className="text-center py-3 px-4 font-semibold text-[#111827] dark:text-white">Status</th>
                {currentRole === 'MAINTAINER' && (
                  <th className="text-center py-3 px-4 font-semibold text-[#111827] dark:text-white">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {duties.map((duty, idx) => (
                <tr key={idx} className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F5F7FA] dark:hover:bg-[#374151]">
                  <td className="py-3 px-4 text-[#111827] dark:text-white">{duty.date.toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-[#111827] dark:text-white">{duty.studentName}</td>
                  <td className="py-3 px-4 text-center text-[#6B7280] dark:text-[#9CA3AF]">{duty.room}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      duty.status === 'completed'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : duty.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {duty.status.charAt(0).toUpperCase() + duty.status.slice(1)}
                    </span>
                  </td>
                  {currentRole === 'MAINTAINER' && (
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedDuty(duty)
                            setShowReassignModal(true)
                          }}
                          className="p-1 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded"
                          title="Reassign Duty"
                        >
                          <Edit2 size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                        </button>
                        <button
                          className="p-1 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded"
                          title="Swap Duty"
                        >
                          <Copy size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  )
}
