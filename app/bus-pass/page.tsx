'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { PageContainer } from '@/components/layout/PageContainer'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Plus, Minus, X } from 'lucide-react'

interface BusPassTransaction {
  id: string
  date: string
  time: string
  type: 'deduct' | 'add'
  amount: number
  description: string
  balanceAfter: number
}

interface Student {
  id: string
  name: string
  room: string
  busPassEligible: boolean
  busPassBalance: number
}

const MONTHLY_ALLOCATION = 630

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Arjun Reddy',
    room: '203',
    busPassEligible: true,
    busPassBalance: 540,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    room: '204',
    busPassEligible: true,
    busPassBalance: 450,
  },
  {
    id: '3',
    name: 'Vikram Iyer',
    room: '205',
    busPassEligible: false,
    busPassBalance: 0,
  },
]

const mockTransactions: BusPassTransaction[] = [
  {
    id: '1',
    date: '2026-06-10',
    time: '14:30',
    type: 'deduct',
    amount: 50,
    description: 'Vegetables',
    balanceAfter: 540,
  },
  {
    id: '2',
    date: '2026-06-07',
    time: '10:15',
    type: 'deduct',
    amount: 20,
    description: 'Milk',
    balanceAfter: 590,
  },
  {
    id: '3',
    date: '2026-06-05',
    time: '09:45',
    type: 'deduct',
    amount: 10,
    description: 'Soap',
    balanceAfter: 610,
  },
]

export default function BusPassPage() {
  const { currentRole } = useAuth()
  const [selectedStudent, setSelectedStudent] = useState<Student>(mockStudents[0])
  const [transactions, setTransactions] = useState<BusPassTransaction[]>(mockTransactions)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeductDialog, setShowDeductDialog] = useState(false)
  const [showEligibilityDialog, setShowEligibilityDialog] = useState(false)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [toast, setToast] = useState('')

  const currentBalance = selectedStudent.busPassBalance
  const spent = MONTHLY_ALLOCATION - currentBalance
  const progressPercentage = (spent / MONTHLY_ALLOCATION) * 100

  const handleAddMoney = () => {
    if (currentRole !== 'MAINTAINER') {
      setToast('You are not the current maintainer.')
      setTimeout(() => setToast(''), 3000)
      return
    }

    if (!amount || !description) {
      alert('Please fill in all fields')
      return
    }

    const amountNum = parseFloat(amount)
    const newBalance = currentBalance + amountNum
    const timestamp = new Date()

    const newTransaction: BusPassTransaction = {
      id: Math.random().toString(),
      date: timestamp.toISOString().split('T')[0],
      time: timestamp.toTimeString().slice(0, 5),
      type: 'add',
      amount: amountNum,
      description,
      balanceAfter: newBalance,
    }

    setTransactions([newTransaction, ...transactions])
    setSelectedStudent({
      ...selectedStudent,
      busPassBalance: newBalance,
    })
    setAmount('')
    setDescription('')
    setShowAddDialog(false)
  }

  const handleDeductMoney = () => {
    if (currentRole !== 'MAINTAINER') {
      setToast('You are not the current maintainer.')
      setTimeout(() => setToast(''), 3000)
      return
    }

    if (!amount || !description) {
      alert('Please fill in all fields')
      return
    }

    const amountNum = parseFloat(amount)
    if (currentBalance - amountNum < 0) {
      alert('Cannot deduct: insufficient balance')
      return
    }

    const newBalance = currentBalance - amountNum
    const timestamp = new Date()

    const newTransaction: BusPassTransaction = {
      id: Math.random().toString(),
      date: timestamp.toISOString().split('T')[0],
      time: timestamp.toTimeString().slice(0, 5),
      type: 'deduct',
      amount: amountNum,
      description,
      balanceAfter: newBalance,
    }

    setTransactions([newTransaction, ...transactions])
    setSelectedStudent({
      ...selectedStudent,
      busPassBalance: newBalance,
    })
    setAmount('')
    setDescription('')
    setShowDeductDialog(false)
  }

  const handleToggleEligibility = () => {
    if (currentRole !== 'MAINTAINER') {
      setToast('You are not the current maintainer.')
      setTimeout(() => setToast(''), 3000)
      return
    }

    const newEligibility = !selectedStudent.busPassEligible
    const newBalance = newEligibility ? MONTHLY_ALLOCATION : 0

    setSelectedStudent({
      ...selectedStudent,
      busPassEligible: newEligibility,
      busPassBalance: newBalance,
    })
    setTransactions([])
    setShowEligibilityDialog(false)
  }

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student)
    setTransactions(mockTransactions)
  }

  return (
    <ProtectedRoute>
      <PageContainer title="Bus Pass Balance" breadcrumbs={[{ label: 'Bus Pass' }]}>
        <div className="space-y-6">
          {/* Student Selector (Maintainer only) */}
          {currentRole === 'MAINTAINER' && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E5E7EB]">
              <h3 className="text-lg font-semibold text-[#111827] mb-4">Select Student</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {mockStudents.map(student => (
                  <button
                    key={student.id}
                    onClick={() => handleStudentSelect(student)}
                    className={`p-4 rounded-lg text-left transition-all ${
                      selectedStudent.id === student.id
                        ? 'bg-[#1F3A93] text-white border-2 border-[#1F3A93]'
                        : 'bg-[#F5F7FA] text-[#111827] border border-[#E5E7EB] hover:border-[#1F3A93]'
                    }`}
                  >
                    <p className="font-semibold">{student.name}</p>
                    <p className="text-sm opacity-75">Room {student.room}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
            <p className="text-sm font-semibold text-[#6B7280] mb-2">CURRENT BALANCE</p>
            <p className="text-5xl font-bold text-[#111827] mb-2">₹{currentBalance}</p>
            <p className="text-sm text-[#6B7280] mb-6">
              of ₹{MONTHLY_ALLOCATION} monthly allocation
            </p>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-blue-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-[#6B7280]">
                <span>Spent ₹{spent}</span>
                <span>Remaining ₹{currentBalance}</span>
              </div>
            </div>

            {/* Eligibility Status */}
            <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
              <p className="text-sm text-[#6B7280] mb-2">Bus Pass Eligibility</p>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-[#111827]">
                  {selectedStudent.busPassEligible ? 'Eligible' : 'Not Eligible'}
                </p>
                {currentRole === 'MAINTAINER' && (
                  <button
                    onClick={() => setShowEligibilityDialog(true)}
                    className="text-sm px-4 py-2 bg-[#1F3A93] text-white rounded-lg hover:bg-[#162952] transition-all"
                  >
                    {selectedStudent.busPassEligible ? 'Remove' : 'Grant'} Eligibility
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons (Maintainer only) */}
          {currentRole === 'MAINTAINER' && (
            <div className="flex gap-4">
              <button
                onClick={() => setShowAddDialog(true)}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={20} /> Add Money
              </button>
              <button
                onClick={() => setShowDeductDialog(true)}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                <Minus size={20} /> Deduct Money
              </button>
            </div>
          )}

          {/* Transaction History */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E5E7EB]">
            <h3 className="text-xl font-bold text-[#111827] mb-6">Transaction History</h3>
            {transactions.length === 0 ? (
              <p className="text-[#6B7280] text-center py-8">No transactions yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E7EB]">
                      <th className="text-left py-3 px-4 font-semibold text-[#111827] text-sm">Description</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#111827] text-sm">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#111827] text-sm">Time</th>
                      <th className="text-right py-3 px-4 font-semibold text-[#111827] text-sm">Amount</th>
                      <th className="text-right py-3 px-4 font-semibold text-[#111827] text-sm">Balance After</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(transaction => (
                      <tr key={transaction.id} className="border-b border-[#E5E7EB] hover:bg-[#F5F7FA] transition-all">
                        <td className="py-3 px-4 text-sm text-[#111827]">{transaction.description}</td>
                        <td className="py-3 px-4 text-sm text-[#6B7280]">{transaction.date}</td>
                        <td className="py-3 px-4 text-sm text-[#6B7280]">{transaction.time}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-semibold ${
                            transaction.type === 'deduct' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {transaction.type === 'deduct' ? '-' : '+'}₹{transaction.amount}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-sm font-semibold text-[#111827]">
                          ₹{transaction.balanceAfter}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Toast */}
          {toast && (
            <div className="fixed bottom-6 right-6 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
              {toast}
            </div>
          )}

          {/* Add Money Dialog */}
          {showAddDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#111827]">Add Money</h3>
                  <button
                    onClick={() => setShowAddDialog(false)}
                    className="p-1 hover:bg-[#F5F7FA] rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">Amount (₹)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F3A93]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">Description</label>
                    <input
                      type="text"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Enter description"
                      className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F3A93]"
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowAddDialog(false)}
                      className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded-lg font-semibold text-[#111827] hover:bg-[#F5F7FA] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddMoney}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
                    >
                      Add Money
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Deduct Money Dialog */}
          {showDeductDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#111827]">Deduct Money</h3>
                  <button
                    onClick={() => setShowDeductDialog(false)}
                    className="p-1 hover:bg-[#F5F7FA] rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">Amount (₹)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F3A93]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">Description</label>
                    <input
                      type="text"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Enter description"
                      className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F3A93]"
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowDeductDialog(false)}
                      className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded-lg font-semibold text-[#111827] hover:bg-[#F5F7FA] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeductMoney}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
                    >
                      Deduct Money
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Eligibility Dialog */}
          {showEligibilityDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#111827]">Manage Eligibility</h3>
                  <button
                    onClick={() => setShowEligibilityDialog(false)}
                    className="p-1 hover:bg-[#F5F7FA] rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className="text-[#6B7280] mb-6">
                  {selectedStudent.busPassEligible
                    ? 'Remove bus pass eligibility for this student?'
                    : 'Grant bus pass eligibility for this student?'}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEligibilityDialog(false)}
                    className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded-lg font-semibold text-[#111827] hover:bg-[#F5F7FA] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleToggleEligibility}
                    className={`flex-1 px-4 py-2 text-white rounded-lg font-semibold transition-all ${
                      selectedStudent.busPassEligible
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {selectedStudent.busPassEligible ? 'Remove' : 'Grant'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </PageContainer>
    </ProtectedRoute>
  )
}
