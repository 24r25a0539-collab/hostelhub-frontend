'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { PageContainer } from '@/components/layout/PageContainer'
import { Plus, Trash2, CheckCircle, AlertCircle, X } from 'lucide-react'

interface Complaint {
  id: string
  title: string
  description: string
  studentName: string
  room: string
  status: 'open' | 'in-progress' | 'resolved'
  date: Date
}

const mockComplaints: Complaint[] = [
  {
    id: '1',
    title: 'Water leakage in bathroom',
    description: 'Water is leaking from the ceiling in room 101 bathroom.',
    studentName: 'Rahul Kumar',
    room: '101',
    status: 'open',
    date: new Date(2025, 5, 15),
  },
  {
    id: '2',
    title: 'Noise complaint',
    description: 'Excessive noise from adjacent room during study hours.',
    studentName: 'Priya Sharma',
    room: '102',
    status: 'in-progress',
    date: new Date(2025, 5, 14),
  },
  {
    id: '3',
    title: 'Internet connectivity issue',
    description: 'WiFi not working in room 103.',
    studentName: 'Amit Patel',
    room: '103',
    status: 'resolved',
    date: new Date(2025, 5, 13),
  },
]

export default function ComplaintsPage() {
  const { currentRole } = useAuth()
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '' })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title && formData.description) {
      const newComplaint: Complaint = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        studentName: 'Jane Smith',
        room: '105',
        status: 'open',
        date: new Date(),
      }
      setComplaints([newComplaint, ...complaints])
      setFormData({ title: '', description: '' })
      setShowForm(false)
    }
  }

  const updateStatus = (id: string, status: 'open' | 'in-progress' | 'resolved') => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status } : c))
  }

  const deleteComplaint = (id: string) => {
    setComplaints(complaints.filter(c => c.id !== id))
  }

  return (
    <PageContainer title="Complaints & Issues">
      <div className="max-w-4xl">
        {currentRole === 'STUDENT' && (
          <div className="mb-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              File Complaint
            </button>
          </div>
        )}

        {showForm && currentRole === 'STUDENT' && (
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151] mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#111827] dark:text-white">File a Complaint</h3>
              <button onClick={() => setShowForm(false)} className="text-[#6B7280] hover:text-[#111827] dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111827] dark:text-white mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Brief title of complaint"
                  className="w-full p-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] dark:text-white mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of the issue"
                  rows={4}
                  className="w-full p-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white"
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] font-semibold rounded-lg transition-all">
                  Submit Complaint
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
          {complaints.map(complaint => (
            <div key={complaint.id} className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-[#111827] dark:text-white">{complaint.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      complaint.status === 'resolved'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : complaint.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {complaint.status === 'in-progress' ? 'In Progress' : complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-2">{complaint.description}</p>
                  <div className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                    <span>{complaint.studentName} • Room {complaint.room} • {complaint.date.toLocaleDateString()}</span>
                  </div>
                </div>

                {currentRole === 'MAINTAINER' && (
                  <div className="flex gap-2">
                    <select
                      value={complaint.status}
                      onChange={(e) => updateStatus(complaint.id, e.target.value as 'open' | 'in-progress' | 'resolved')}
                      className="p-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white text-sm"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <button
                      onClick={() => deleteComplaint(complaint.id)}
                      className="p-2 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded-lg transition-all"
                    >
                      <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  )
}
