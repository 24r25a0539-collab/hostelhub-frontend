'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { PageContainer } from '@/components/layout/PageContainer'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { FileText, Download, Printer, Eye, X } from 'lucide-react'

interface Report {
  id: string
  title: string
  type: string
  icon: string
  description: string
  lastGenerated: Date
  dataPoints: number
}

const reports: Report[] = [
  {
    id: '1',
    title: 'Attendance Report',
    type: 'attendance',
    icon: '📋',
    description: 'Monthly attendance summary for all students',
    lastGenerated: new Date(2025, 5, 15),
    dataPoints: 42,
  },
  {
    id: '2',
    title: 'Expense Report',
    type: 'expense',
    icon: '💰',
    description: 'Monthly expense breakdown by category',
    lastGenerated: new Date(2025, 5, 14),
    dataPoints: 28,
  },
  {
    id: '3',
    title: 'Fund Report',
    type: 'fund',
    icon: '🏦',
    description: 'Fund balance and transaction history',
    lastGenerated: new Date(2025, 5, 13),
    dataPoints: 15,
  },
  {
    id: '4',
    title: 'Bus Pass Report',
    type: 'buspass',
    icon: '🚌',
    description: 'Bus pass balance and usage report',
    lastGenerated: new Date(2025, 5, 12),
    dataPoints: 42,
  },
  {
    id: '5',
    title: 'Cooking Duty Report',
    type: 'cooking',
    icon: '🍳',
    description: 'Cooking duty assignments and completion',
    lastGenerated: new Date(2025, 5, 11),
    dataPoints: 30,
  },
  {
    id: '6',
    title: 'Election Report',
    type: 'election',
    icon: '🗳️',
    description: 'Election results and voting statistics',
    lastGenerated: new Date(2025, 5, 10),
    dataPoints: 4,
  },
]

export default function ReportsPage() {
  const { currentRole } = useAuth()
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [toast, setToast] = useState('')

  const handleGenerate = () => {
    if (currentRole !== 'MAINTAINER') {
      setToast('You are not the current maintainer.')
      setTimeout(() => setToast(''), 3000)
      return
    }
    alert(`Generating ${selectedReport?.title}...`)
  }

  const handleExport = (format: 'pdf' | 'excel' | 'print') => {
    if (!selectedReport) return
    
    if (format === 'print') {
      window.print()
    } else if (format === 'pdf') {
      // Generate mock PDF
      const dataStr = JSON.stringify(selectedReport, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${selectedReport.title.replace(' ', '_')}.pdf`
      link.click()
    } else if (format === 'excel') {
      // Generate mock Excel
      const dataStr = `Report: ${selectedReport.title}\nGenerated: ${new Date().toLocaleDateString()}`
      const dataBlob = new Blob([dataStr], { type: 'text/csv' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${selectedReport.title.replace(' ', '_')}.csv`
      link.click()
    }
  }

  return (
    <ProtectedRoute>
      <PageContainer title="Reports & Analytics">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {reports.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className={`p-6 rounded-3xl shadow-sm border transition-all text-left ${
                selectedReport?.id === report.id
                  ? 'bg-[#F7B538] border-[#F7B538] text-[#1F2937]'
                  : 'bg-white dark:bg-[#1F2937] border-[#E5E7EB] dark:border-[#374151] hover:border-[#F7B538]'
              }`}
            >
              <div className="text-3xl mb-3">{report.icon}</div>
              <h3 className={`font-bold text-lg mb-2 ${selectedReport?.id === report.id ? 'text-[#1F2937]' : 'text-[#111827] dark:text-white'}`}>
                {report.title}
              </h3>
              <p className={`text-sm mb-3 ${selectedReport?.id === report.id ? 'text-[#1F2937]' : 'text-[#6B7280] dark:text-[#9CA3AF]'}`}>
                {report.description}
              </p>
              <div className={`text-xs ${selectedReport?.id === report.id ? 'text-[#1F2937]' : 'text-[#6B7280] dark:text-[#9CA3AF]'}`}>
                {report.dataPoints} data points • Generated {report.lastGenerated.toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>

        {selectedReport && (
          <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 shadow-sm border border-[#E5E7EB] dark:border-[#374151]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#111827] dark:text-white mb-2">{selectedReport.title}</h2>
                <p className="text-[#6B7280] dark:text-[#9CA3AF]">
                  Last generated: {selectedReport.lastGenerated.toLocaleDateString()} • {selectedReport.dataPoints} records
                </p>
              </div>
              <FileText size={40} className="text-[#F7B538]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {selectedReport.type === 'attendance' && (
                <>
                  <div className="bg-[#F5F7FA] dark:bg-[#374151] p-4 rounded-lg">
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Average Attendance</p>
                    <p className="text-2xl font-bold text-[#111827] dark:text-white">87.5%</p>
                  </div>
                  <div className="bg-[#F5F7FA] dark:bg-[#374151] p-4 rounded-lg">
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Present This Month</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">892 days</p>
                  </div>
                  <div className="bg-[#F5F7FA] dark:bg-[#374151] p-4 rounded-lg">
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Absent This Month</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">78 days</p>
                  </div>
                </>
              )}

              {selectedReport.type === 'expense' && (
                <>
                  <div className="bg-[#F5F7FA] dark:bg-[#374151] p-4 rounded-lg">
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Total Expenses</p>
                    <p className="text-2xl font-bold text-[#111827] dark:text-white">₹24,500</p>
                  </div>
                  <div className="bg-[#F5F7FA] dark:bg-[#374151] p-4 rounded-lg">
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Utilities</p>
                    <p className="text-2xl font-bold text-[#111827] dark:text-white">₹8,000</p>
                  </div>
                  <div className="bg-[#F5F7FA] dark:bg-[#374151] p-4 rounded-lg">
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Maintenance</p>
                    <p className="text-2xl font-bold text-[#111827] dark:text-white">₹16,500</p>
                  </div>
                </>
              )}

              {selectedReport.type === 'fund' && (
                <>
                  <div className="bg-[#F5F7FA] dark:bg-[#374151] p-4 rounded-lg">
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Current Balance</p>
                    <p className="text-2xl font-bold text-[#111827] dark:text-white">₹42,000</p>
                  </div>
                  <div className="bg-[#F5F7FA] dark:bg-[#374151] p-4 rounded-lg">
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Income</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹50,000</p>
                  </div>
                  <div className="bg-[#F5F7FA] dark:bg-[#374151] p-4 rounded-lg">
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Expenses</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">₹8,000</p>
                  </div>
                </>
              )}

              {selectedReport.type === 'buspass' && (
                <>
                  <div className="bg-[#F5F7FA] dark:bg-[#374151] p-4 rounded-lg">
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Active Passes</p>
                    <p className="text-2xl font-bold text-[#111827] dark:text-white">40/42</p>
                  </div>
                  <div className="bg-[#F5F7FA] dark:bg-[#374151] p-4 rounded-lg">
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Avg Balance</p>
                    <p className="text-2xl font-bold text-[#111827] dark:text-white">₹3,750</p>
                  </div>
                  <div className="bg-[#F5F7FA] dark:bg-[#374151] p-4 rounded-lg">
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Total Distributed</p>
                    <p className="text-2xl font-bold text-[#111827] dark:text-white">₹157,500</p>
                  </div>
                </>
              )}

              {selectedReport.type === 'cooking' && (
                <>
                  <div className="bg-[#F5F7FA] dark:bg-[#374151] p-4 rounded-lg">
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Total Assignments</p>
                    <p className="text-2xl font-bold text-[#111827] dark:text-white">30</p>
                  </div>
                  <div className="bg-[#F5F7FA] dark:bg-[#374151] p-4 rounded-lg">
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Completed</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">28</p>
                  </div>
                  <div className="bg-[#F5F7FA] dark:bg-[#374151] p-4 rounded-lg">
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">2</p>
                  </div>
                </>
              )}

              {selectedReport.type === 'election' && (
                <>
                  <div className="bg-[#F5F7FA] dark:bg-[#374151] p-4 rounded-lg">
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Total Candidates</p>
                    <p className="text-2xl font-bold text-[#111827] dark:text-white">4</p>
                  </div>
                  <div className="bg-[#F5F7FA] dark:bg-[#374151] p-4 rounded-lg">
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Total Votes</p>
                    <p className="text-2xl font-bold text-[#111827] dark:text-white">63</p>
                  </div>
                  <div className="bg-[#F5F7FA] dark:bg-[#374151] p-4 rounded-lg">
                    <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">Winner</p>
                    <p className="text-lg font-bold text-[#111827] dark:text-white">Rahul Kumar</p>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-[#E5E7EB] dark:border-[#374151] pt-6">
              <h3 className="font-semibold text-[#111827] dark:text-white mb-4">Actions</h3>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setShowViewDialog(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                >
                  <Eye size={18} />
                  View Report
                </button>

                {currentRole === 'MAINTAINER' && (
                  <button
                    onClick={handleGenerate}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                  >
                    Generate Report
                  </button>
                )}

                <button
                  onClick={() => handleExport('pdf')}
                  className="px-6 py-3 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] font-semibold rounded-lg transition-all flex items-center gap-2"
                >
                  <Download size={18} />
                  Download PDF
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                >
                  <Download size={18} />
                  Download Excel
                </button>
                <button
                  onClick={() => handleExport('print')}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                >
                  <Printer size={18} />
                  Print
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Report Dialog */}
        {showViewDialog && selectedReport && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1F2937] rounded-3xl p-8 max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#111827] dark:text-white">Report Preview: {selectedReport.title}</h3>
                <button
                  onClick={() => setShowViewDialog(false)}
                  className="p-1 hover:bg-[#F5F7FA] dark:hover:bg-[#374151] rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-[#6B7280] dark:text-[#9CA3AF] mb-2">Report Details</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-[#F5F7FA] dark:bg-[#374151] rounded-lg">
                      <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Type</p>
                      <p className="font-semibold text-[#111827] dark:text-white">{selectedReport.type}</p>
                    </div>
                    <div className="p-3 bg-[#F5F7FA] dark:bg-[#374151] rounded-lg">
                      <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Data Points</p>
                      <p className="font-semibold text-[#111827] dark:text-white">{selectedReport.dataPoints}</p>
                    </div>
                    <div className="p-3 bg-[#F5F7FA] dark:bg-[#374151] rounded-lg">
                      <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Last Generated</p>
                      <p className="font-semibold text-[#111827] dark:text-white">{selectedReport.lastGenerated.toLocaleDateString()}</p>
                    </div>
                    <div className="p-3 bg-[#F5F7FA] dark:bg-[#374151] rounded-lg">
                      <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Status</p>
                      <p className="font-semibold text-green-600 dark:text-green-400">Generated</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#6B7280] dark:text-[#9CA3AF] mb-2">Description</p>
                  <p className="text-[#111827] dark:text-white">{selectedReport.description}</p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-300">This is a preview of the {selectedReport.title}. Download or print to see the full report with detailed analytics and charts.</p>
                </div>

                <button
                  onClick={() => setShowViewDialog(false)}
                  className="w-full px-4 py-2 bg-[#1F3A93] text-white rounded-lg font-semibold hover:bg-[#162952] transition-all"
                >
                  Close
                </button>
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
      </PageContainer>
    </ProtectedRoute>
  )
}
