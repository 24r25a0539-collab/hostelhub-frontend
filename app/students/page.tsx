'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useNotifications } from '@/lib/notifications-context'
import { PageContainer } from '@/components/layout/PageContainer'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Plus, Edit2, Trash2, Eye, Mail, Phone, MapPin, X, Check, X as XIcon } from 'lucide-react'
import { HOSTEL_STUDENTS, HostelStudent } from '@/lib/students-data'
import { STUDENT_REQUESTS, StudentRequest } from '@/lib/requests-data'

export default function StudentsPage() {
  const { currentRole } = useAuth()
  const { addNotification } = useNotifications()
  const [students, setStudents] = useState<HostelStudent[]>(HOSTEL_STUDENTS)
  const [requests, setRequests] = useState<StudentRequest[]>(STUDENT_REQUESTS)
  const [selectedStudent, setSelectedStudent] = useState<HostelStudent | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showRequests, setShowRequests] = useState(false)
  const [editingBacklogId, setEditingBacklogId] = useState<string | null>(null)
  const [backlogInput, setBacklogInput] = useState<string>('')
  const [toast, setToast] = useState('')

  const deleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id))
  }

  const handleUpdateBacklog = (studentId: string) => {
    if (currentRole !== 'MAINTAINER') {
      setToast('You are not the current maintainer.')
      setTimeout(() => setToast(''), 3000)
      return
    }

    const backlogNum = parseInt(backlogInput)
    if (isNaN(backlogNum) || backlogNum < 0) {
      alert('Please enter a valid backlog count')
      return
    }

    setStudents(
      students.map(s =>
        s.id === studentId ? { ...s, backlogCount: backlogNum } : s
      )
    )
    setEditingBacklogId(null)
    setBacklogInput('')

    if (selectedStudent?.id === studentId) {
      setSelectedStudent({ ...selectedStudent, backlogCount: backlogNum })
    }
  }

  const handleAcceptRequest = (requestId: string) => {
    if (currentRole !== 'MAINTAINER') {
      setToast('Only maintainers can accept student requests.')
      setTimeout(() => setToast(''), 3000)
      return
    }

    const request = requests.find(r => r.id === requestId)
    if (!request) return

    // Mark request as approved
    setRequests(
      requests.map(r =>
        r.id === requestId ? { ...r, status: 'approved' } : r
      )
    )

    // Add new student to the roster
    const newStudent: HostelStudent = {
      id: request.id,
      name: request.name,
      email: request.email,
      phone: request.phone,
      room: 0,
      attendance: 0,
      busPassBalance: 0,
      busPassEligible: true,
      backlogCount: 0,
    }
    setStudents([...students, newStudent])

    // Send notification to the student
    addNotification({
      type: 'student_approved',
      title: 'Hostel Entry Approved',
      message: `Your hostel entry request has been approved by the maintainer. Welcome to HostelHub!`,
      priority: 'high',
      actionData: { studentId: request.id, studentName: request.name },
    })

    setToast('Student request accepted successfully!')
    setTimeout(() => setToast(''), 3000)
  }

  const handleRejectRequest = (requestId: string) => {
    if (currentRole !== 'MAINTAINER') {
      setToast('Only maintainers can reject student requests.')
      setTimeout(() => setToast(''), 3000)
      return
    }

    const request = requests.find(r => r.id === requestId)
    if (!request) return

    // Mark request as rejected
    setRequests(
      requests.map(r =>
        r.id === requestId ? { ...r, status: 'rejected' } : r
      )
    )

    setToast('Student request rejected.')
    setTimeout(() => setToast(''), 3000)
  }

  return (
    <ProtectedRoute>
      <PageContainer title="Student Management">
      <div className="mb-6 flex gap-4 flex-wrap">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] font-semibold rounded-lg transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Add Student
        </button>
        <button
          onClick={() => setShowRequests(!showRequests)}
          className={`px-6 py-3 font-semibold rounded-lg transition-all flex items-center gap-2 ${
            showRequests
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300'
          }`}
        >
          <Users size={20} />
          Pending Requests ({requests.filter(r => r.status === 'pending').length})
        </button>
      </div>

      {showRequests && (
        <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 border border-[#E5E7EB] dark:border-[#374151] mb-6 shadow-sm">
          <h3 className="text-xl font-bold text-[#111827] dark:text-white mb-6">Student Join Requests</h3>
          
          {requests.filter(r => r.status === 'pending').length === 0 ? (
            <p className="text-center text-[#6B7280] dark:text-[#9CA3AF] py-6">No pending requests</p>
          ) : (
            <div className="space-y-4">
              {requests.filter(r => r.status === 'pending').map(request => (
                <div key={request.id} className="border border-[#E5E7EB] dark:border-[#374151] rounded-xl p-4 hover:border-[#F7B538] dark:hover:border-[#F7B538] transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#111827] dark:text-white text-lg">{request.name}</h4>
                      <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">{request.department} • Year {request.year}</p>
                    </div>
                    <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">{request.requestDate}</span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 text-sm">
                    <div>
                      <p className="text-[#6B7280] dark:text-[#9CA3AF]">Roll Number</p>
                      <p className="font-semibold text-[#111827] dark:text-white">{request.rollNumber}</p>
                    </div>
                    <div>
                      <p className="text-[#6B7280] dark:text-[#9CA3AF]">Email</p>
                      <p className="font-semibold text-[#111827] dark:text-white break-all">{request.email}</p>
                    </div>
                    <div>
                      <p className="text-[#6B7280] dark:text-[#9CA3AF]">Phone</p>
                      <p className="font-semibold text-[#111827] dark:text-white">{request.phone}</p>
                    </div>
                    <div>
                      <p className="text-[#6B7280] dark:text-[#9CA3AF]">Room Preference</p>
                      <p className="font-semibold text-[#111827] dark:text-white">{request.roomPreference}</p>
                    </div>
                    <div>
                      <p className="text-[#6B7280] dark:text-[#9CA3AF]">Parent Name</p>
                      <p className="font-semibold text-[#111827] dark:text-white">{request.parentName}</p>
                    </div>
                    <div>
                      <p className="text-[#6B7280] dark:text-[#9CA3AF]">Parent Phone</p>
                      <p className="font-semibold text-[#111827] dark:text-white">{request.parentPhone}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-[#E5E7EB] dark:border-[#374151]">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
                      disabled={currentRole !== 'MAINTAINER'}
                    >
                      <Check size={18} />
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all"
                      disabled={currentRole !== 'MAINTAINER'}
                    >
                      <XIcon size={18} />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedStudent && (
        <div
          className={`rounded-3xl p-8 shadow-sm border-2 mb-6 ${
            selectedStudent.backlogCount === 0
              ? 'bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-700'
              : 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-700'
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#111827] dark:text-white">Student Details</h3>
            <button
              onClick={() => setSelectedStudent(null)}
              className="p-1 hover:bg-[#F5F7FA] rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-1">Name</p>
              <p className="text-lg font-semibold text-[#111827] dark:text-white">{selectedStudent.name}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-1">Room Number</p>
              <p className="text-lg font-semibold text-[#111827] dark:text-white">{selectedStudent.room}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-1">Email</p>
              <p className="text-lg font-semibold text-[#111827] dark:text-white">{selectedStudent.email}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-1">Phone</p>
              <p className="text-lg font-semibold text-[#111827] dark:text-white">{selectedStudent.phone}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-1">Attendance Percentage</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">{selectedStudent.attendance}%</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-1">Bus Pass Balance</p>
              <p className="text-lg font-semibold text-[#111827] dark:text-white">₹{selectedStudent.busPassBalance}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-1">Bus Pass Eligibility</p>
              <p className={`text-lg font-semibold ${selectedStudent.busPassEligible ? 'text-green-600' : 'text-red-600'}`}>
                {selectedStudent.busPassEligible ? 'Eligible' : 'Not Eligible'}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-1">Backlog Status</p>
              <p className={`text-lg font-semibold ${selectedStudent.backlogCount === 0 ? 'text-green-600' : 'text-red-600'}`}>
                {selectedStudent.backlogCount === 0 ? 'No Backlogs' : `Pending Backlogs`}
              </p>
            </div>
          </div>

          {/* Backlog Count Edit Section */}
          <div className={`p-4 rounded-lg mb-6 ${
            selectedStudent.backlogCount === 0 ? 'bg-white/50' : 'bg-white/50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Backlog Count</p>
                <p className={`text-2xl font-bold ${selectedStudent.backlogCount === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedStudent.backlogCount}
                </p>
              </div>
              {editingBacklogId === selectedStudent.id ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={backlogInput}
                    onChange={e => setBacklogInput(e.target.value)}
                    min="0"
                    className="w-20 px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F3A93]"
                    placeholder="0"
                  />
                  <button
                    onClick={() => handleUpdateBacklog(selectedStudent.id)}
                    className="px-4 py-2 bg-[#1F3A93] text-white rounded-lg hover:bg-[#162952] transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingBacklogId(null)
                      setBacklogInput('')
                    }}
                    className="px-4 py-2 border border-[#E5E7EB] rounded-lg hover:bg-[#F5F7FA] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              ) : currentRole === 'MAINTAINER' ? (
                <button
                  onClick={() => {
                    setEditingBacklogId(selectedStudent.id)
                    setBacklogInput(selectedStudent.backlogCount.toString())
                  }}
                  className="px-4 py-2 bg-[#1F3A93] text-white rounded-lg hover:bg-[#162952] transition-all flex items-center gap-2"
                >
                  <Edit2 size={16} /> Edit
                </button>
              ) : null}
            </div>
          </div>

        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {toast}
        </div>
      )}

      <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
        <h3 className="text-xl font-bold text-[#111827] dark:text-white mb-6">All Students ({students.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] dark:border-[#374151]">
                <th className="text-left py-3 px-4 font-semibold text-[#111827] dark:text-white">Name</th>
                <th className="text-center py-3 px-4 font-semibold text-[#111827] dark:text-white">Room</th>
                <th className="text-center py-3 px-4 font-semibold text-[#111827] dark:text-white">Attendance</th>
                <th className="text-center py-3 px-4 font-semibold text-[#111827] dark:text-white">Bus Pass</th>
                <th className="text-center py-3 px-4 font-semibold text-[#111827] dark:text-white">Backlogs</th>
                <th className="text-center py-3 px-4 font-semibold text-[#111827] dark:text-white">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-[#111827] dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr
                  key={student.id}
                  className={`border-b transition-all ${
                    student.backlogCount === 0
                      ? 'border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-900/20'
                      : 'border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20'
                  }`}
                >
                  <td className="py-3 px-4 text-[#111827] dark:text-white font-semibold">{student.name}</td>
                  <td className="py-3 px-4 text-center text-[#6B7280] dark:text-[#9CA3AF]">{student.room}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      student.attendance >= 90
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : student.attendance >= 75
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {student.attendance}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-[#111827] dark:text-white font-semibold">₹{student.busPassBalance}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      student.backlogCount === 0
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {student.backlogCount}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      student.backlogCount === 0
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {student.backlogCount === 0 ? 'No Backlogs' : 'Pending Backlogs'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="p-2 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded-lg transition-all inline-block"
                    >
                      <Eye size={18} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </PageContainer>
    </ProtectedRoute>
  )
}
