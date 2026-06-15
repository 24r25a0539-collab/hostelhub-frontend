'use client'

import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Plus, Edit2, Trash2, Eye, Mail, Phone, MapPin } from 'lucide-react'

interface Student {
  id: string
  name: string
  email: string
  phone: string
  room: string
  rollNumber: string
  course: string
  joinDate: Date
  attendance: number
  busPassBalance: number
}

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Rahul Kumar',
    email: 'rahul@example.com',
    phone: '9876543210',
    room: '101',
    rollNumber: '2021001',
    course: 'BTech - CSE',
    joinDate: new Date(2021, 6, 15),
    attendance: 92,
    busPassBalance: 5000,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9876543211',
    room: '102',
    rollNumber: '2021002',
    course: 'BTech - ECE',
    joinDate: new Date(2021, 6, 20),
    attendance: 88,
    busPassBalance: 3500,
  },
  {
    id: '3',
    name: 'Amit Patel',
    email: 'amit@example.com',
    phone: '9876543212',
    room: '103',
    rollNumber: '2021003',
    course: 'BTech - ME',
    joinDate: new Date(2021, 7, 5),
    attendance: 85,
    busPassBalance: 2000,
  },
]

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showForm, setShowForm] = useState(false)

  const deleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id))
  }

  return (
    <PageContainer title="Student Management">
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] font-semibold rounded-lg transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Add Student
        </button>
      </div>

      {selectedStudent && (
        <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151] mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#111827] dark:text-white">Student Details</h3>
            <button
              onClick={() => setSelectedStudent(null)}
              className="text-[#6B7280] hover:text-[#111827] dark:hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-1">Name</p>
              <p className="text-lg font-semibold text-[#111827] dark:text-white">{selectedStudent.name}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-1">Roll Number</p>
              <p className="text-lg font-semibold text-[#111827] dark:text-white">{selectedStudent.rollNumber}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-1">Course</p>
              <p className="text-lg font-semibold text-[#111827] dark:text-white">{selectedStudent.course}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-1">Room</p>
              <p className="text-lg font-semibold text-[#111827] dark:text-white">Room {selectedStudent.room}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-1">Email</p>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                <p className="text-lg font-semibold text-[#111827] dark:text-white">{selectedStudent.email}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-1">Phone</p>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                <p className="text-lg font-semibold text-[#111827] dark:text-white">{selectedStudent.phone}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-1">Join Date</p>
              <p className="text-lg font-semibold text-[#111827] dark:text-white">{selectedStudent.joinDate.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-1">Attendance</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">{selectedStudent.attendance}%</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-1">Bus Pass Balance</p>
              <p className="text-lg font-semibold text-[#111827] dark:text-white">₹{selectedStudent.busPassBalance}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 px-4 py-2 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] font-semibold rounded-lg transition-all flex items-center justify-center gap-2">
              <Edit2 size={18} />
              Edit
            </button>
            <button
              onClick={() => {
                deleteStudent(selectedStudent.id)
                setSelectedStudent(null)
              }}
              className="flex-1 px-4 py-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
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
                <th className="text-center py-3 px-4 font-semibold text-[#111827] dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F5F7FA] dark:hover:bg-[#374151]">
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
  )
}
