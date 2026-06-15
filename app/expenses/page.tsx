'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { PageContainer } from '@/components/layout/PageContainer'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Plus, Upload, X, Trash2 } from 'lucide-react'

interface Expense {
  id: string
  category: string
  amount: number
  description: string
  date: string
}

const CATEGORIES = [
  'Groceries',
  'Vegetables',
  'Gas',
  'Electricity',
  'Maintenance',
  'Cleaning',
  'Internet',
  'Water',
  'Repairs',
  'Miscellaneous',
]

const mockExpenses: Expense[] = [
  {
    id: '1',
    category: 'Groceries',
    amount: 5000,
    description: 'Weekly grocery shopping',
    date: '2026-06-10',
  },
  {
    id: '2',
    category: 'Electricity',
    amount: 2500,
    description: 'Monthly electricity bill',
    date: '2026-06-08',
  },
  {
    id: '3',
    category: 'Maintenance',
    amount: 1500,
    description: 'Pipe repair in common area',
    date: '2026-06-05',
  },
]

export default function ExpensesPage() {
  const { currentRole } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [toast, setToast] = useState('')
  
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: '',
  })
  const [uploadedFile, setUploadedFile] = useState<{ name: string; uploadedDate: string } | null>(null)

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)

  const handleAddExpense = () => {
    if (currentRole !== 'MAINTAINER') {
      setToast('You are not the current maintainer.')
      setTimeout(() => setToast(''), 3000)
      return
    }

    if (!formData.category || !formData.amount || !formData.description) {
      alert('Please fill in all required fields')
      return
    }

    const newExpense: Expense = {
      id: Math.random().toString(),
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: new Date().toISOString().split('T')[0],
    }

    setExpenses([newExpense, ...expenses])
    setFormData({ category: '', amount: '', description: '' })
    setUploadedFile(null)
    setShowAddDialog(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg']
      if (!validTypes.includes(file.type)) {
        alert('Please upload JPG, PNG, or PDF files only')
        return
      }
      setUploadedFile({
        name: file.name,
        uploadedDate: new Date().toISOString().split('T')[0],
      })
    }
  }

  const handleDeleteExpense = (id: string) => {
    if (currentRole !== 'MAINTAINER') {
      setToast('You are not the current maintainer.')
      setTimeout(() => setToast(''), 3000)
      return
    }
    setExpenses(expenses.filter(e => e.id !== id))
  }

  return (
    <ProtectedRoute>
      <PageContainer title="Expenses" breadcrumbs={[{ label: 'Expenses' }]}>
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 border border-[#E5E7EB] dark:border-[#374151]">
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">Total Expenses</p>
              <p className="text-3xl font-bold text-[#111827] dark:text-white">₹{totalExpenses.toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 border border-[#E5E7EB] dark:border-[#374151]">
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">Total Entries</p>
              <p className="text-3xl font-bold text-[#111827] dark:text-white">{expenses.length}</p>
            </div>
            <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 border border-[#E5E7EB] dark:border-[#374151]">
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">Average Expense</p>
              <p className="text-3xl font-bold text-[#111827] dark:text-white">₹{Math.round(totalExpenses / Math.max(expenses.length, 1)).toLocaleString()}</p>
            </div>
          </div>

          {/* Add Expense Button */}
          {currentRole === 'MAINTAINER' && (
            <button
              onClick={() => setShowAddDialog(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#1F3A93] text-white rounded-lg hover:bg-[#162952] transition-all font-semibold"
            >
              <Plus size={20} /> Add Expense
            </button>
          )}

          {/* Expenses Table */}
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 border border-[#E5E7EB] dark:border-[#374151]">
            <h3 className="text-xl font-bold text-[#111827] dark:text-white mb-6">Expense List</h3>
            {expenses.length === 0 ? (
              <p className="text-center text-[#6B7280] dark:text-[#9CA3AF] py-8">No expenses recorded yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] dark:border-[#374151]">
                      <th className="text-left py-3 px-4 font-semibold text-[#111827] dark:text-white">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#111827] dark:text-white">Description</th>
                      <th className="text-center py-3 px-4 font-semibold text-[#111827] dark:text-white">Amount</th>
                      <th className="text-center py-3 px-4 font-semibold text-[#111827] dark:text-white">Date</th>
                      <th className="text-center py-3 px-4 font-semibold text-[#111827] dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map(expense => (
                      <tr key={expense.id} className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F5F7FA] dark:hover:bg-[#374151]">
                        <td className="py-3 px-4 text-[#111827] dark:text-white font-semibold">{expense.category}</td>
                        <td className="py-3 px-4 text-[#6B7280] dark:text-[#9CA3AF]">{expense.description}</td>
                        <td className="py-3 px-4 text-center text-[#111827] dark:text-white font-semibold">₹{expense.amount}</td>
                        <td className="py-3 px-4 text-center text-[#6B7280] dark:text-[#9CA3AF]">{expense.date}</td>
                        <td className="py-3 px-4 text-center">
                          {currentRole === 'MAINTAINER' && (
                            <button
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="text-red-600 hover:text-red-700"
                              title="Delete expense"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
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

          {/* Add Expense Dialog */}
          {showAddDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 max-w-md w-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#111827] dark:text-white">Add Expense</h3>
                  <button onClick={() => setShowAddDialog(false)} className="p-1 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded-lg">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] dark:text-white mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F3A93]"
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] dark:text-white mb-2">Amount (₹)</label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="Enter amount"
                      className="w-full px-4 py-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F3A93]"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] dark:text-white mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter description"
                      className="w-full px-4 py-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1F3A93] resize-none"
                      rows={3}
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] dark:text-white mb-2">Scan Bill (Optional)</label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="hidden"
                        id="bill-upload"
                      />
                      <label
                        htmlFor="bill-upload"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-[#E5E7EB] dark:border-[#374151] rounded-lg cursor-pointer hover:border-[#1F3A93] dark:hover:border-[#1F3A93] transition-all"
                      >
                        <Upload size={16} className="text-[#6B7280] dark:text-[#9CA3AF]" />
                        <span className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
                          {uploadedFile ? uploadedFile.name : 'Choose file'}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowAddDialog(false)}
                      className="flex-1 px-4 py-2 border border-[#E5E7EB] dark:border-[#374151] rounded-lg font-semibold text-[#111827] dark:text-white hover:bg-[#F5F7FA] dark:hover:bg-[#374151] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddExpense}
                      className="flex-1 px-4 py-2 bg-[#1F3A93] text-white rounded-lg font-semibold hover:bg-[#162952] transition-all"
                    >
                      Add Expense
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
