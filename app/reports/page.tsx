'use client'

import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { FileText, Download, Printer } from 'lucide-react'

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
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'print'>('pdf')

  const handleExport = (format: 'pdf' | 'excel' | 'print') => {
    if (format === 'print') {
      window.print()
    } else {
      alert(`${selectedReport?.title} exported as ${format.toUpperCase()}`)
    }
  }

  return (
    <RoleGuard requiredRole="MAINTAINER">
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
              <h3 className="font-semibold text-[#111827] dark:text-white mb-4">Export Report</h3>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => handleExport('pdf')}
                  className="px-6 py-3 bg-[#F7B538] hover:bg-[#F59E0B] text-[#1F2937] font-semibold rounded-lg transition-all flex items-center gap-2"
                >
                  <Download size={18} />
                  Export as PDF
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                >
                  <Download size={18} />
                  Export as Excel
                </button>
                <button
                  onClick={() => handleExport('print')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                >
                  <Printer size={18} />
                  Print Report
                </button>
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </RoleGuard>
  )
}
