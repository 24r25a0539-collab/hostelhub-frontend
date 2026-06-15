'use client'

import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Plus, LogOut, CheckCircle, Clock, X } from 'lucide-react'

interface VisitorRecord {
  id: string
  name: string
  phone: string
  room: string
  entryTime: Date
  exitTime?: Date
  visitingStudent: string
  status: 'active' | 'exited'
  approvalStatus: 'pending' | 'approved' | 'rejected'
}

const mockVisitors: VisitorRecord[] = [
  {
    id: '1',
    name: 'Mohit Singh',
    phone: '9876543210',
    room: '101',
    entryTime: new Date(2025, 5, 15, 14, 30),
    visitingStudent: 'Rahul Kumar',
    status: 'active',
    approvalStatus: 'approved',
  },
  {
    id: '2',
    name: 'Anjali Mehta',
    phone: '9876543211',
    room: '102',
    entryTime: new Date(2025, 5, 15, 10, 0),
    exitTime: new Date(2025, 5, 15, 12, 0),
    visitingStudent: 'Priya Sharma',
    status: 'exited',
    approvalStatus: 'approved',
  },
]

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<VisitorRecord[]>(mockVisitors)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', room: '', visitingStudent: '' })

  const handleEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.phone && formData.room) {
      const newVisitor: VisitorRecord = {
        id: Date.now().toString(),
        name: formData.name,
        phone: formData.phone,
        room: formData.room,
        entryTime: new Date(),
        visitingStudent: formData.visitingStudent,
        status: 'active',
        approvalStatus: 'pending',
      }
      setVisitors([newVisitor, ...visitors])
      setFormData({ name: '', phone: '', room: '', visitingStudent: '' })
      setShowForm(false)
    }
  }

  const markExit = (id: string) => {
    setVisitors(visitors.map(v => v.id === id ? { ...v, exitTime: new Date(), status: 'exited' } : v))
  }

  const approveVisitor = (id: string) => {
    setVisitors(visitors.map(v => v.id === id ? { ...v, approvalStatus: 'approved' } : v))
  }

  const rejectVisitor = (id: string) => {
    setVisitors(visitors.map(v => v.id === id ? { ...v, approvalStatus: 'rejected' } : v))
  }

  return (
    <PageContainer title="Visitor Management">
      <div className="max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] font-semibold rounded-lg transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Visitor Entry
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151] mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#111827] dark:text-white">Record Visitor Entry</h3>
              <button onClick={() => setShowForm(false)} className="text-[#6B7280] hover:text-[#111827] dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEntrySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111827] dark:text-white mb-2">Visitor Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full p-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] dark:text-white mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10-digit number"
                  className="w-full p-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] dark:text-white mb-2">Room Number</label>
                <input
                  type="text"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  placeholder="Room #"
                  className="w-full p-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] dark:text-white mb-2">Visiting Student</label>
                <input
                  type="text"
                  value={formData.visitingStudent}
                  onChange={(e) => setFormData({ ...formData, visitingStudent: e.target.value })}
                  placeholder="Student name"
                  className="w-full p-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white"
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] font-semibold rounded-lg transition-all">
                  Record Entry
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-[#E5E7EB] dark:bg-[#374151] text-[#111827] dark:text-white font-semibold rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {visitors.map(visitor => (
            <div key={visitor.id} className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#111827] dark:text-white">{visitor.name}</h3>
                  <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Room {visitor.room} • Visiting {visitor.visitingStudent}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    visitor.status === 'active'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}>
                    {visitor.status === 'active' ? 'Active' : 'Exited'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    visitor.approvalStatus === 'approved'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : visitor.approvalStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {visitor.approvalStatus.charAt(0).toUpperCase() + visitor.approvalStatus.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-[#6B7280] dark:text-[#9CA3AF] text-xs">Phone</p>
                  <p className="font-semibold text-[#111827] dark:text-white">{visitor.phone}</p>
                </div>
                <div>
                  <p className="text-[#6B7280] dark:text-[#9CA3AF] text-xs">Entry Time</p>
                  <p className="font-semibold text-[#111827] dark:text-white">{visitor.entryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {visitor.status === 'active' && (
                  <>
                    {visitor.approvalStatus === 'pending' && (
                      <>
                        <button
                          onClick={() => approveVisitor(visitor.id)}
                          className="flex-1 px-3 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 font-semibold rounded-lg transition-all text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectVisitor(visitor.id)}
                          className="flex-1 px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 font-semibold rounded-lg transition-all text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => markExit(visitor.id)}
                      className="flex-1 px-3 py-2 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] font-semibold rounded-lg transition-all text-sm flex items-center justify-center gap-2"
                    >
                      <LogOut size={16} />
                      Mark Exit
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  )
}
