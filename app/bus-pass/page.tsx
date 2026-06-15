'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { PageContainer } from '@/components/layout/PageContainer'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Plus, Minus, Eye } from 'lucide-react'

interface Transaction {
  id: string
  date: Date
  type: 'add' | 'deduct'
  amount: number
  balance: number
  description: string
}

interface StudentBusPass {
  id: string
  name: string
  room: string
  balance: number
  transactions: Transaction[]
}

const mockStudents: StudentBusPass[] = [
  {
    id: '1',
    name: 'Arjun Reddy',
    room: '101',
    balance: 5000,
    transactions: [
      { id: '1', date: new Date(2025, 5, 15), type: 'add', amount: 2000, balance: 5000, description: 'Monthly recharge' },
      { id: '2', date: new Date(2025, 5, 10), type: 'deduct', amount: 500, balance: 3000, description: 'Bus fare' },
    ],
  },
  {
    id: '2',
    name: 'Priya Sharma',
    room: '102',
    balance: 3500,
    transactions: [
      { id: '3', date: new Date(2025, 5, 12), type: 'add', amount: 1500, balance: 3500, description: 'Monthly recharge' },
    ],
  },
]

export default function BusPassPage() {
  const { currentRole, currentUser } = useAuth()
  const [students, setStudents] = useState<StudentBusPass[]>(mockStudents)
  const [selectedStudent, setSelectedStudent] = useState<StudentBusPass | null>(null)
  const [showLedger, setShowLedger] = useState(false)
  const [formData, setFormData] = useState({ amount: '', type: 'add' as const, description: '' })

  if (currentRole === 'STUDENT') {
    const student = students[0]
    return (
      <ProtectedRoute>
        <PageContainer title="Bus Pass">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">Current Balance</p>
            <p className="text-3xl font-bold text-[#111827] dark:text-white">₹{student.balance.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">Total Transactions</p>
            <p className="text-3xl font-bold text-[#111827] dark:text-white">{student.transactions.length}</p>
          </div>
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">Status</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">Active</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
          <h3 className="text-xl font-bold text-[#111827] dark:text-white mb-6">Transaction History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] dark:border-[#374151]">
                  <th className="text-left py-3 px-4 font-semibold text-[#111827] dark:text-white">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#111827] dark:text-white">Type</th>
                  <th className="text-center py-3 px-4 font-semibold text-[#111827] dark:text-white">Amount</th>
                  <th className="text-center py-3 px-4 font-semibold text-[#111827] dark:text-white">Balance</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#111827] dark:text-white">Description</th>
                </tr>
              </thead>
              <tbody>
                {student.transactions.map(txn => (
                  <tr key={txn.id} className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F5F7FA] dark:hover:bg-[#374151]">
                    <td className="py-3 px-4 text-[#111827] dark:text-white">{txn.date.toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        txn.type === 'add'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {txn.type === 'add' ? 'Add' : 'Deduct'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-[#111827] dark:text-white font-medium">
                      {txn.type === 'add' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center text-[#111827] dark:text-white font-medium">
                      ₹{txn.balance.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-[#6B7280] dark:text-[#9CA3AF]">{txn.description}</td>
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

  return (
    <ProtectedRoute requiredRole="MAINTAINER">
      <PageContainer title="Bus Pass Management">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
          <h3 className="text-xl font-bold text-[#111827] dark:text-white mb-6">Student Bus Pass List</h3>
          <div className="space-y-4">
            {students.map(student => (
              <div
                key={student.id}
                onClick={() => {
                  setSelectedStudent(student)
                  setShowLedger(true)
                }}
                className="p-4 border border-[#E5E7EB] dark:border-[#374151] rounded-lg hover:bg-[#F5F7FA] dark:hover:bg-[#374151] cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#111827] dark:text-white">{student.name}</p>
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Room {student.room}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#111827] dark:text-white">₹{student.balance.toLocaleString()}</p>
                    <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Current Balance</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedStudent && showLedger && (
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#111827] dark:text-white">{selectedStudent.name} - Ledger</h3>
              <button
                onClick={() => setShowLedger(false)}
                className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mb-6 p-4 bg-[#F5F7FA] dark:bg-[#374151] rounded-lg">
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-1">Current Balance</p>
              <p className="text-2xl font-bold text-[#111827] dark:text-white">₹{selectedStudent.balance.toLocaleString()}</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (formData.amount && selectedStudent) {
                  const amount = parseInt(formData.amount)
                  const newBalance = formData.type === 'add' 
                    ? selectedStudent.balance + amount 
                    : selectedStudent.balance - amount
                  
                  const newTransaction: Transaction = {
                    id: Date.now().toString(),
                    date: new Date(),
                    type: formData.type,
                    amount,
                    balance: newBalance,
                    description: formData.description,
                  }
                  
                  setStudents(students.map(s => 
                    s.id === selectedStudent.id 
                      ? { ...s, balance: newBalance, transactions: [newTransaction, ...s.transactions] }
                      : s
                  ))
                  setSelectedStudent({ ...selectedStudent, balance: newBalance })
                  setFormData({ amount: '', type: 'add', description: '' })
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-[#111827] dark:text-white mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'add' | 'deduct' })}
                  className="w-full p-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white"
                >
                  <option value="add">Add Money</option>
                  <option value="deduct">Deduct Money</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] dark:text-white mb-2">Amount (₹)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Enter amount"
                  className="w-full p-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] dark:text-white mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                  className="w-full p-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] font-semibold rounded-lg transition-all"
              >
                {formData.type === 'add' ? 'Add Money' : 'Deduct Money'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#E5E7EB] dark:border-[#374151]">
              <h4 className="font-semibold text-[#111827] dark:text-white mb-4">Recent Transactions</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedStudent.transactions.slice(0, 5).map(txn => (
                  <div key={txn.id} className="flex items-center justify-between text-sm">
                    <span className="text-[#6B7280] dark:text-[#9CA3AF]">{txn.date.toLocaleDateString()}</span>
                    <span className={txn.type === 'add' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {txn.type === 'add' ? '+' : '-'}₹{txn.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      </PageContainer>
    </ProtectedRoute>
  )
}
