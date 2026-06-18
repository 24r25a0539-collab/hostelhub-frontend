'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Search, Plus, MoreVertical, Download, CheckCircle, X } from 'lucide-react'
import Link from 'next/link'

export default function StudentsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newStudent, setNewStudent] = useState({ name: '', email: '', phone: '', room: '' })
  const [students, setStudents] = useState([
    { id: '1', name: 'Rahul Kumar', email: 'rahul@example.com', phone: '+91 98765 43210', room: '101', joinDate: '2024-01-15', status: 'active' },
    { id: '2', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98765 43211', room: '102', joinDate: '2024-01-20', status: 'active' },
    { id: '3', name: 'Amit Patel', email: 'amit@example.com', phone: '+91 98765 43212', room: '103', joinDate: '2024-02-01', status: 'active' },
    { id: '4', name: 'Anjali Singh', email: 'anjali@example.com', phone: '+91 98765 43213', room: '104', joinDate: '2024-02-10', status: 'pending' },
  ])

  if (user?.role !== 'MAINTAINER') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] dark:from-[#111827] dark:to-[#1F2937]">
        <div className="text-center">
          <p className="text-[#6B7280]">Only maintainers can access this page</p>
          <Link href="/dashboard" className="text-[#1F3A93] hover:underline mt-4 block">
            Go back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email) return
    setStudents([...students, { ...newStudent, id: Date.now().toString(), joinDate: new Date().toISOString().split('T')[0], status: 'active' }])
    setNewStudent({ name: '', email: '', phone: '', room: '' })
    setShowAddModal(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6] dark:from-[#111827] dark:to-[#1F2937]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-[#1F2937] border-b border-[#E5E7EB] dark:border-[#374151]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Students</h1>
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">{students.length} total students</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg hover:bg-[#F5F7FA] dark:hover:bg-[#374151] flex items-center gap-2 text-sm font-medium text-[#111827] dark:text-white transition-all">
              <Download className="w-4 h-4" /> Export
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#1F3A93] hover:bg-[#162952] text-white rounded-lg flex items-center gap-2 text-sm font-medium transition-all"
            >
              <Plus className="w-4 h-4" /> Add Student
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-4 py-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-sm border border-[#E5E7EB] dark:border-[#374151] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F9FAFB] dark:bg-[#111827] border-b border-[#E5E7EB] dark:border-[#374151]">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-[#111827] dark:text-white text-sm">Name</th>
                  <th className="text-left px-6 py-4 font-semibold text-[#111827] dark:text-white text-sm">Email</th>
                  <th className="text-left px-6 py-4 font-semibold text-[#111827] dark:text-white text-sm">Phone</th>
                  <th className="text-left px-6 py-4 font-semibold text-[#111827] dark:text-white text-sm">Room</th>
                  <th className="text-left px-6 py-4 font-semibold text-[#111827] dark:text-white text-sm">Join Date</th>
                  <th className="text-left px-6 py-4 font-semibold text-[#111827] dark:text-white text-sm">Status</th>
                  <th className="text-left px-6 py-4 font-semibold text-[#111827] dark:text-white text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F5F7FA] dark:hover:bg-[#374151] transition-colors">
                    <td className="px-6 py-4 text-sm text-[#111827] dark:text-white font-medium">{student.name}</td>
                    <td className="px-6 py-4 text-sm text-[#6B7280] dark:text-[#9CA3AF]">{student.email}</td>
                    <td className="px-6 py-4 text-sm text-[#6B7280] dark:text-[#9CA3AF]">{student.phone}</td>
                    <td className="px-6 py-4 text-sm text-[#6B7280] dark:text-[#9CA3AF]">{student.room || '-'}</td>
                    <td className="px-6 py-4 text-sm text-[#6B7280] dark:text-[#9CA3AF]">{new Date(student.joinDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        student.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-[#E5E7EB] dark:hover:bg-[#374151] rounded-lg transition-all">
                        <MoreVertical className="w-4 h-4 text-[#6B7280]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-xl w-full max-w-md p-6 border border-[#E5E7EB] dark:border-[#374151]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#111827] dark:text-white">Add New Student</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                className="w-full px-4 py-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
              />
              <input
                type="email"
                placeholder="Email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                className="w-full px-4 py-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newStudent.phone}
                onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                className="w-full px-4 py-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
              />
              <input
                type="text"
                placeholder="Room Number"
                value={newStudent.room}
                onChange={(e) => setNewStudent({ ...newStudent, room: e.target.value })}
                className="w-full px-4 py-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#F7B538]"
              />
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg hover:bg-[#F5F7FA] dark:hover:bg-[#374151] text-[#111827] dark:text-white font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStudent}
                  className="flex-1 px-4 py-2 bg-[#1F3A93] hover:bg-[#162952] text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Add Student
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
