'use client'

import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { Plus, Minus, X } from 'lucide-react'

interface Transaction {
  id: string
  date: Date
  type: 'income' | 'expense'
  amount: number
  source?: string
  category?: string
  description: string
  balance: number
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: new Date(2025, 5, 1),
    type: 'income',
    amount: 50000,
    source: 'Student Fund Collection',
    description: 'Monthly hostel maintenance fee',
    balance: 50000,
  },
  {
    id: '2',
    date: new Date(2025, 5, 5),
    type: 'expense',
    amount: 5000,
    category: 'Utilities',
    description: 'Electricity bill',
    balance: 45000,
  },
  {
    id: '3',
    date: new Date(2025, 5, 10),
    type: 'expense',
    amount: 3000,
    category: 'Maintenance',
    description: 'Wall paint and repairs',
    balance: 42000,
  },
]

export default function FundManagementPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState<'income' | 'expense'>('income')
  const [formData, setFormData] = useState({
    amount: '',
    sourceOrCategory: '',
    description: '',
  })

  const currentBalance = transactions.length > 0 ? transactions[transactions.length - 1].balance : 0
  const thisMonth = transactions.filter(t => t.date.getMonth() === new Date().getMonth())
  const moneyAdded = thisMonth.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const expenses = thisMonth.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.amount && formData.sourceOrCategory && formData.description) {
      const amount = parseFloat(formData.amount)
      const lastBalance = transactions[transactions.length - 1]?.balance || 0
      const newBalance = formType === 'income' ? lastBalance + amount : lastBalance - amount

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        date: new Date(),
        type: formType,
        amount,
        [formType === 'income' ? 'source' : 'category']: formData.sourceOrCategory,
        description: formData.description,
        balance: newBalance,
      }

      setTransactions([...transactions, newTransaction])
      setFormData({ amount: '', sourceOrCategory: '', description: '' })
      setShowForm(false)
    }
  }

  return (
    <RoleGuard requiredRole="MAINTAINER">
      <PageContainer title="Fund Management">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">Current Fund</p>
            <p className="text-3xl font-bold text-[#111827] dark:text-white">₹{currentBalance.toLocaleString()}</p>
          </div>

          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">Money Added (This Month)</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">₹{moneyAdded.toLocaleString()}</p>
          </div>

          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">Expenses (This Month)</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">₹{expenses.toLocaleString()}</p>
          </div>

          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-2">Remaining Balance</p>
            <p className="text-3xl font-bold text-[#111827] dark:text-white">₹{(moneyAdded - expenses).toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151] mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#111827] dark:text-white">Add Transaction</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] font-semibold rounded-lg transition-all"
            >
              {showForm ? 'Cancel' : '+ New Transaction'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-6 bg-[#F5F7FA] dark:bg-[#374151] rounded-lg">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="income"
                    checked={formType === 'income'}
                    onChange={(e) => setFormType(e.target.value as 'income' | 'expense')}
                  />
                  <span className="text-[#111827] dark:text-white font-medium">Income</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="expense"
                    checked={formType === 'expense'}
                    onChange={(e) => setFormType(e.target.value as 'income' | 'expense')}
                  />
                  <span className="text-[#111827] dark:text-white font-medium">Expense</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] dark:text-white mb-2">Amount</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0"
                  className="w-full p-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] dark:text-white mb-2">
                  {formType === 'income' ? 'Source' : 'Category'}
                </label>
                <input
                  type="text"
                  value={formData.sourceOrCategory}
                  onChange={(e) => setFormData({ ...formData, sourceOrCategory: e.target.value })}
                  placeholder={formType === 'income' ? 'Fund source' : 'Category'}
                  className="w-full p-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] dark:text-white mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Transaction details"
                  rows={3}
                  className="w-full p-3 border border-[#E5E7EB] dark:border-[#374151] rounded-lg bg-white dark:bg-[#1F2937] text-[#111827] dark:text-white"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] font-semibold rounded-lg transition-all"
                >
                  {formType === 'income' ? <Plus className="inline mr-2" size={18} /> : <Minus className="inline mr-2" size={18} />}
                  Add {formType === 'income' ? 'Income' : 'Expense'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
          <h2 className="text-xl font-bold text-[#111827] dark:text-white mb-6">Transaction Ledger</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E7EB] dark:border-[#374151]">
                  <th className="text-left py-3 px-4 font-semibold text-[#111827] dark:text-white">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#111827] dark:text-white">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#111827] dark:text-white">Description</th>
                  <th className="text-right py-3 px-4 font-semibold text-[#111827] dark:text-white">Amount</th>
                  <th className="text-right py-3 px-4 font-semibold text-[#111827] dark:text-white">Balance</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className="border-b border-[#E5E7EB] dark:border-[#374151] hover:bg-[#F5F7FA] dark:hover:bg-[#374151]">
                    <td className="py-3 px-4 text-[#111827] dark:text-white">{t.date.toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        t.type === 'income'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {t.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#111827] dark:text-white">{t.description}</td>
                    <td className={`py-3 px-4 text-right font-semibold ${
                      t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-[#111827] dark:text-white font-semibold">₹{t.balance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </PageContainer>
    </RoleGuard>
  )
}
